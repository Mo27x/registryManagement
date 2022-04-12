let towns = [];
let fiscalCode = "";

$(document).ready(function () {
  $.get("getTown.php", function (result) {
    towns = JSON.parse(result);
    let $el = $("#birthPlace");
    $el.empty();
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
    const changeSelected = () => {
      const $birth = document.querySelector("#birthPlace");
      $birth.value = "Rimini";
      const $residence = document.querySelector("#town");
      $birth.value = "Rimini";
    };
  });
  document.getElementById("town").onchange = function () {
    var value = document.getElementById("town").value;
    $("#cap").val(getCap(value));
  };
});

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
      $.post("addCitizen.php", citizen, (data, status) => {
        if (data == "true") {
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
      street: document.getElementById("street").value,
      houseNumber: document.getElementById("houseNumber").value,
      vatNumber: document.getElementById("vatNumber").value,
      fiscalCode: document.getElementById("fiscalCode").value,
    };
    $.post("updateCitizen.php", dataToChange, (data, status) => {
      alert(data);
    });
  }
  return false;
};

const isEmptyControl = (field) => {
  const value = document.getElementById(field).value;
  if (typeof value !== "undefined" && value !== null) {
    return false;
  }
  return true;
};

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
  alert(
    "Inserted fiscal code and calculated fiscal code does not match, check last name, first name, gender, date of birth and birthplace fields"
  );
  return (
    fiscalCode === document.getElementById("fiscalCode").value.toUpperCase()
  );
};
/**
 *
 * @param {*} id id of field
 * @param {*} lastIndex must be 3 for lname or 4 for fname
 * @returns
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

const getYear = () => {
  let date = document.getElementById("dateOfBirth").value;
  const d = new Date(date);
  const year = d.getFullYear().toString().split("").reverse().join("");
  return year[1] + year[0];
};

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

const getCap = (town) => {
  let ret = "";
  towns.forEach((element) => {
    if (element.nome == town) {
      ret = element.cap;
      return;
    }
  });
  return ret;
};
