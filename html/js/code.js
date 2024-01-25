const urlBase = "http://forestfolio.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

// Put Registration Function Here

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

function addContact() {
  let friendLvl = 0;
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let email = document.getElementById("emailAddress").value;
  let phone = document.getElementById("phoneNumber").value;
  friendLvl = parseInt(document.getElementById("friendshipLevel").value, 10);

  //   document.getElementById("contactAddResult").innerHTML = "";
  //   document.getElementById("contactAddResult").className = "label";

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    createdByUserId: userId,
    emailAddress: email,
    friendshipLevel: friendLvl,
    phoneNumber: phone,
  };
  let jsonPayload = JSON.stringify(tmp);

  console.log(jsonPayload);

  let url = urlBase + "/AddContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        alert("yay");

        // document.getElementById("contactAddResult").innerHTML =
        //   "Contact has been added";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    alert("nay");
    // document.getElementById("contactAddResult").className += " label-danger";
    // document.getElementById("contactAddResult").innerHTML = err.message;
  }
}

function convertJSONtoTable(data) {
  let jsonData = data;

  let tableBody = document.getElementById("contactsBody");

  jsonData.forEach((item) => {
    let tr = document.createElement("tr");

    let vals = Object.values(item);

    vals.forEach((elem) => {
      let td = document.createElement("td");
      td.innerText = elem;
      tr.appendChild(td);
    });

    tableBody.appendChild(tr);
  });
}

function searchContact() {
  let srch = document.getElementById("searchText").value;
  console.log(srch);

  document.getElementById("contactSearchResult").innerHTML = "";
  document.getElementById("contactSearchResult").className = "label";

  let contactList = "";

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

        // for (let i = 0; i < jsonObject.results.length; i++) {
        //   contactList += jsonObject.results[i];
        //   if (i < jsonObject.results.length - 1) {
        //     contactList += "<br />\r\n";
        //   }
        // }

        convertJSONtoTable(jsonObject["result"]);

        // document.getElementsByTagName("p")[0].innerHTML = contactList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").className += " label-danger";
    document.getElementById("contactSearchResult").innerHTML = err.message;
  }
}
