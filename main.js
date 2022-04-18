let towns = [];
let fiscalCode = "";
/**
 * funzione che si occupa di creare le select con le città di residenza e di nascita
 * recupera il cap della città di residenza selezionata e lo stampa nel campo della form
 */
$(document).ready(function () {
  //richiesta in get al file php per recuperare tramite una query di select le città dal db
  $.get("getTown.php", function (result) {
    towns = JSON.parse(result);
    let $el = $("#birthPlace");
    $el.empty();
    //aggiunta in append di tutte le città nelle select
    $.each(towns, function () {
      $el.append(
        $("<option></option>").attr("value", this.nome).text(this.nome)
      );
    });
    $el = $("#town");
    $el.empty();
    $.each(towns, function () {
      $el.append(
        $("<option></option>").attr("value", this.nome).text(this.nome)
      );
    });
  });
  //funzione onchange per visualizzare il cap della città selezionata nella select della form
  document.getElementById("town").onchange = function () {
    var value = document.getElementById("town").value;
    $("#cap").val(getCap(value));
  };
  //rimozione della classe che visualizza i campi in errore
  $("#fname").on("input", () => {
    $("#fname").removeClass("error");
  });
  $("#lname").on("input", () => {
    $("#lname").removeClass("error");
  });
  $("#dateOfBirth").on("input", () => {
    $("#dateOfBirth").removeClass("error");
  });
  $("#fiscalCode").on("input", () => {
    $("#fiscalCode").removeClass("error");
  });
  $("#birthPlace").on("input", () => {
    $("#birthPlace").removeClass("error");
  });
});
/**
 * controlla la correttezza della partita IVA e del codice fiscale
 * per il cod fiscale fa uso di una funzione che a sua volta utilizza altre funzioni
 * per verificare ogni dato che influisce nella creazione del codice fiscale
 * @returns false se il controllo del codice o della p. IVA, o entrambi non sono andati a buon fine
 * altrimenti manda una post al file php per eseguire la query di insert nel db
 */
const control = () => {
  if (fiscalCode === "") {
    if (controlFiscalCode() && controlVatNumber()) {
      const citizen = {
        lname: document.getElementById("lname").value,
        fname: document.getElementById("fname").value,
        gender: getGender(),
        dateOfBirth: document.getElementById("dateOfBirth").value,
        street: document.getElementById("street").value,
        birthPlaceCadastralCode: getCadastralCode(
          document.getElementById("birthPlace").value
        ),
        residencePlaceCadastralCode: getCadastralCode(
          document.getElementById("town").value
        ),
        houseNumber: document.getElementById("houseNumber").value,
        fiscalCode: fiscalCode,
        vatNumber: document.getElementById("vatNumber").value,
      };
      //manda una richiesta con il metodo post al file php per eseguire la query di insert nel db
      $.post("addCitizen.php", citizen, (data, status) => {
        if (data == "true") {
          //rende tutti i dati nella form che sono stati usati per il codice fiscale già
          //controllato e corretto readonly per permettere di modificare eventuamente gli altri dati
          jQuery("#lname").prop("readonly", true);
          $("#fname").prop("readonly", true);
          $("#male").prop("readonly", true);
          $("#female").prop("readonly", true);
          $("#dateOfBirth").prop("readonly", true);
          $("#birthPlace").prop("disabled", true);
          $("#town").prop("disabled", true);
          $("#fiscalCode").prop("readonly", true);
        }
      });
    }
  } else {
    const dataToChange = {
      //i dati che si possono modificare dopo l'insert
      street: document.getElementById("street").value,
      houseNumber: document.getElementById("houseNumber").value,
      vatNumber: document.getElementById("vatNumber").value,
      fiscalCode: document.getElementById("fiscalCode").value,
    };
    //manda una richiesta post con i dati per eseguire la query di update
    $.post("updateCitizen.php", dataToChange, (data, status) => {
      alert(data);
    });
  }
  return false;
};
/**
 * funzione che permette di controllare i dati inseriti nel campo della partita IVA
 * @returns l'esito del controllo
 */
const controlVatNumber = () => {
  const vatNumber = document.getElementById("vatNumber").value;
  if (typeof vatNumber !== "undefined" && vatNumber !== null) {
    if (vatNumber.length != 0 && vatNumber.length != 11) {
      alert("VAT number is not correct");
      return false;
    }
  }
  return true;
};
/**
 * funzione per il controllo del codice fiscale attraverso la verifica del suo algoritmo di creazione
 * si ricrea un altro codice fiscale utilizzando i dati anagrafici necessari e seguendo l'algoritmo
 * @returns l'esito della comparazione tra quello creato dal codice e quello inserito dall'utente
 */
const controlFiscalCode = () => {
  fiscalCode = "";
  fiscalCode +=
    getNames("lname", 3) +
    getNames("fname", 4) +
    getYear() +
    getMonth() +
    getDay() +
    getCadastralCode(document.getElementById("birthPlace").value);
  fiscalCode += getControlLetter(fiscalCode);

  if (fiscalCode === document.getElementById("fiscalCode").value.toUpperCase())
    return true;
  else {
    //visualizza l'errore all'utente cambiando lo style dei campi che influenzano l'errore presente nel codice fiscale
    $("#fname").addClass("error");
    $("#lname").addClass("error");
    $("#dateOfBirth").addClass("error");
    $("#fiscalCode").addClass("error");
    $("#birthPlace").addClass("error");
    $("#male").addClass("error");
    $("#female").addClass("error");
    return false;
  }
};
/**
 *
 * @param {*} id dei campi nome e cognome, viene chiamata due volte
 * @param {*} lastIndex seguendo l'algoritmo deve essere 3 per il cognome (lname) o 4 per il nome (fname)
 * @returns la parte del codice fiscale inerente al nome e al cognome
 */
const getNames = (id, lastIndex) => {
  let value = document.getElementById(id).value;
  let consonants = "";
  let vowels = "";
  if (value.length == 3) {
    return value.toUpperCase();
  } else if (value.length < 3) {
    for (let i = value.length; i < 3; i++) {
      value += "X";
    }
    return value.toUpperCase();
  } else {
    for (let i = 0; i < value.length; i++) {
      if (value[i].match(/[bcdfghjklmnpqrstvwxyz]/gi)) {
        consonants += value[i];
        if (consonants.length === lastIndex) {
          return (
            consonants[0] +
            consonants[lastIndex - 2] +
            consonants[lastIndex - 1]
          ).toUpperCase();
        }
      } else {
        vowels += value[i];
      }
    }
    if (consonants.length === 3) {
      return consonants.toUpperCase();
    }
    let counter = 0;
    for (let i = 0; i < consonants.length; i++) {
      consonants += vowels[counter++];
    }
    return consonants.toUpperCase();
  }
};
/**
 * funzione che viene richiamata da getDay() per avere il sesso inserito dall'utente che andrà
 * ad influire sulla data di nascita nel codice fiscale
 * @returns il sesso M o F
 */
const getGender = () => {
  const genders = document.getElementsByName("gender");
  let gender = "";
  for (let i = 0; i < genders.length; i++) {
    if (genders[i].checked) {
      gender = genders[i].value;
    }
  }
  return gender;
};
/**
 * funzione che aggiunge al codice fiscale la parte inerente al giorno di nascita che cambia in relazione
 * al sesso della persona, se è maschio allora solo il numero se è femmina si aggiunge 40
 * @returns il giorno da aggiungere al codice fiscale
 */
const getDay = () => {
  const gender = getGender();
  let date = document.getElementById("dateOfBirth").value;
  const d = new Date(date);
  let day = d.getDate().toString();
  if (day < 10) {
    day = "0" + day;
  }
  return gender === "M" ? day : d.getDate() + 40;
};
/**
 * funzione che aggiunge al codice la parte inerente al mese di nascita e utilizza un array
 * di lettere in relazione al mese
 * @returns la lettera corrispondente al mese
 */
const getMonth = () => {
  let monthsLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "H",
    "L",
    "M",
    "P",
    "R",
    "S",
    "T",
  ];
  let date = document.getElementById("dateOfBirth").value;
  const d = new Date(date);
  return monthsLetters[d.getMonth()];
};
/**
 * funzione che aggiunge la parte inerenete all'anno di nascita
 * @returns ultime due cifre dell'anno di nascita
 */
const getYear = () => {
  let date = document.getElementById("dateOfBirth").value;
  const d = new Date(date);
  //conversione dell'anno in stringa e con il reverse si prende la parte significativa dell'anno da aggiungere al codice fisc
  const year = d.getFullYear().toString().split("").reverse().join("");
  return year[1] + year[0];
};
/**
 * @param {*} location prende in input la città di nascita
 * @returns ritorna il codice catastale della città
 */
const getCadastralCode = (location) => {
  let cadastralCode = "";
  towns.forEach((town) => {
    if (town.nome == location) {
      cadastralCode = town.codiceCatastale;
      return;
    }
  });
  return cadastralCode;
};
/**
 * questa funzione prende come parametro il codice fiscale fino ad ora ottenuto per poi applicare l'algoritmo
 * per selezionare una lettera di controllo da aggiungere come ultimo carattere del codice fiscale
 * @param {*} fiscalCode
 * @returns la lettera di controllo
 */
const getControlLetter = (fiscalCode) => {
  const characters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  const unevenNumbers = [
    1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16,
    10, 22, 25, 24, 23,
  ];
  let sum = 0;
  for (let i = 0; i < fiscalCode.length; i++) {
    if (i % 2 == 0) {
      if (Number.isNaN(Number.parseInt(fiscalCode[i]))) {
        sum += unevenNumbers[getIndex(characters, fiscalCode[i])];
      } else {
        sum += unevenNumbers[Number.parseInt(fiscalCode[i])];
      }
    } else {
      if (Number.isNaN(Number.parseInt(fiscalCode[i]))) {
        sum += getIndex(characters, fiscalCode[i]);
      } else {
        sum += Number.parseInt(fiscalCode[i]);
      }
    }
  }
  return characters[sum % 26];
};
/**
 *
 * @param {*} array di caratteri presente nella funzione per la lettera di controllo
 * @param {*} value la lettera da cercare nell'array
 * @returns index ritorna l'indice nell'array della lettera corrispondente al parametro preso in input
 */
const getIndex = (array, value) => {
  let index = -1;
  array.forEach((element) => {
    if (element === value) {
      index = array.indexOf(element);
      return;
    }
  });
  return index;
};
/**
 * questa funzione restituisce i cap delle città
 * @param {*} town città di residenza
 * @returns il cap della città
 */
const getCap = (town) => {
  let cap = "";
  towns.forEach((element) => {
    if (element.nome == town) {
      cap = element.cap;
      return;
    }
  });
  return cap;
};
