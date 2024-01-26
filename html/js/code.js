const urlBase = "http://forestfolio.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("loginName").ariaValueMax;
  let password = document.getElementById("loginPassword");

  var hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";

  // let tmp = { login: login, password: password };
  var tmp = { login: login, password: hash };

  let jsonPayload = JSON.stringify(tmp);

  alert(jsonPayload);

  let url = urlBase + "/Login." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }
      }

      firstName = jsonObject.firstName;
      lastName = jsonObject.lastName;

      saveCookie();

      window.location.href = "color.html";
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

// TODO: *** Put Registration Function Here
function doSignUp() {}

function saveCookie() {
  let minutes = 20;
  let date = new Date();

  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTSTRing();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");

  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");

    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").innerHTML =
      "Logged in as " + firstName + " " + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

// Clears add contacts modal form when its closed in anyway
$("#addContacts").on("hidden.bs.modal", function (e) {
  $(this)
    .find("input,textarea,select")
    .val("")
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();
});

function addContact() {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let email = document.getElementById("emailAddress").value;
  let phone = document.getElementById("phoneNumber").value;
  friendLvl = parseInt(document.getElementById("friendshipLevel").value, 10);

  if (friendLvl == null) {
    friendLvl = 0;
  }

  document.getElementById("contactAddResult").innerHTML = "";
  document.getElementById("contactAddResult").className = "label";

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    createdByUserId: userId,
    emailAddress: email,
    friendshipLevel: friendLvl,
    phoneNumber: phone,
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/AddContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactAddResult").className +=
          " label-success";
        document.getElementById("contactAddResult").innerHTML =
          "Contact has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactAddResult").className += " label-danger";
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}

// TODO: *** Put edit contact function
function editContact() {}

function deleteContactWrapper(id) {
  if (
    confirm(
      "Are you sure you want to delete this contact? \n(This choice is CANNOT BE REVERSED)"
    )
  ) {
    deleteContact(id);
  }
}

function deleteContact(i) {
  let firstName = document.getElementById(`firstName ${i}`).innerText;
  let lastName = document.getElementById(`lastName ${i}`).innerText;
  let email = document.getElementById(`emailAddress ${i}`).innerText;
  let phone = document.getElementById(`phoneNumber ${i}`).innerText;

  document.getElementById("contactSearchResult").innerHTML = "";
  document.getElementById("contactSearchResult").className = "label";

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    createdByUserId: userId,
    emailAddress: email,
    phoneNumber: phone,
  };

  let jsonPayload = JSON.stringify(tmp);

  console.log(jsonPayload);

  // let url = urlBase + "/DeleteContact." + extension;

  // let xhr = new XMLHttpRequest();
  // xhr.open("POST", url, true);

  // try {
  //   xhr.onreadystatechange = function () {
  //     if (this.readyState == 4 && this.status == 200) {
  //       document.getElementById("contactAddResult").className +=
  //         " label-success";
  //       document.getElementById("contactAddResult").innerHTML =
  //         "Contact has been deleted";
  //     }
  //   };
  //   xhr.send(jsonPayload);
  // } catch (err) {
  //   document.getElementById("contactAddResult").className += " label-danger";
  //   document.getElementById("contactAddResult").innerHTML = err.message;
  // }

  document.getElementById(`row ${i}`).remove();

  document.getElementById("contactSearchResult").className += " label-danger";
  document.getElementById("contactSearchResult").innerHTML = "Contact Deleted";
}

function convertJSONtoTable(data) {
  let jsonData = "";

  let tableBody = document.getElementById("contactsBody");
  tableBody.innerHTML = "";

  if (Object.keys(data).length == 2) {
    jsonData = data["results"];
  } else {
    document.getElementById("contactSearchResult").className += " label-danger";
    document.getElementById("contactSearchResult").innerHTML =
      "No Records Found";
    return;
  }

  for (i = 0; i < jsonData.length; i++) {
    let item = jsonData[i];

    let tr = document.createElement("tr");
    tr.id = `row ${i}`;

    let td = document.createElement("td");
    td.id = `ID ${i}`;
    td.innerText = item.ID;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = `firstName ${i}`;
    td.innerText = item.FirstName;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = `lastName ${i}`;
    td.innerText = item.LastName;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = `emailAddress ${i}`;
    td.innerText = item.EmailAddress;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = `phoneNumber ${i}`;
    td.innerText = item.PhoneNumber;
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = `
    <button id="${i}" class="btn btn-info">
      <span class="glyphicon glyphicon-edit"></span>
    </button> 
    &nbsp;&nbsp; 
    <button id="${i}" class="btn btn-danger" onclick="deleteContactWrapper(this.id);">
      <span class="glyphicon glyphicon-trash"></span>
    </button>`;
    tr.appendChild(td);

    tableBody.appendChild(tr);
  }
}

function searchContact() {
  let srch = document.getElementById("searchText").value;

  document.getElementById("contactSearchResult").innerHTML = "";
  document.getElementById("contactSearchResult").className = "label";

  let tmp = { search: srch, createdByUserId: 5 };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SearchContacts." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("contactSearchResult").className +=
          " label-success";
        document.getElementById("contactSearchResult").innerHTML =
          "Contact(s) have been retrieved";

        let jsonObject = JSON.parse(xhr.responseText);

        convertJSONtoTable(jsonObject);
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").className += " label-danger";
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}
