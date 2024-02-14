const urlBase = "http://forestfolio.xyz/LAMPAPI";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";

let pageSelected = 1;
let numPages = 1;
let numContacts = 0;

let srch = "";

let oldData = {};

$(document).ready(function () {
  $("#sidebarCollapse").on("click", function () {
    $("#sidebar").toggleClass("active");
  });
});

function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";

  let login = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  document.getElementById("loginResult").innerHTML = "";
  document.getElementById("username").style.color = "inherit";
  document.getElementById("password").style.color = "inherit";
  document.getElementById("username").placeholder = "Username";
  document.getElementById("password").placeholder = "Password";

  if (login == "" && password != "") {
    document.getElementById("loginResult").innerHTML =
      "Username field is empty *";
    document.getElementById("username").style.color = "red";
    document.getElementById("username").placeholder = "Username *";
    return;
  } else if (password == "" && login != "") {
    document.getElementById("loginResult").innerHTML =
      "Password field is empty *";
    document.getElementById("password").style.color = "red";
    document.getElementById("password").placeholder = "Password *";
    return;
  } else if (login == "" && password == "") {
    document.getElementById("loginResult").innerHTML =
      "Username and password fields are empty *";
    document.getElementById("username").style.color = "red";
    document.getElementById("username").placeholder = "Username *";
    document.getElementById("password").style.color = "red";
    document.getElementById("password").placeholder = "Password *";
    return;
  }

  var hash = md5(password);

  var tmp = { login: login, password: hash };

  let jsonPayload = JSON.stringify(tmp);

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
        } else {
          firstName = jsonObject.firstName;
          lastName = jsonObject.lastName;
          saveCookie();
          window.location.href = "./landing-page.html?#";
        }
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

// TODO: *** Put Registration Function Here
function doSignUp() {
  userId = 0;
  firstName = "";
  lastName = "";
  let pass = 1;

  let newLogin = document.getElementById("newUsername").value;
  let newPassword = document.getElementById("newPassword").value;
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;

  document.getElementById("signupResult").innerHTML = "";
  document.getElementById("newUsername").style.color = "inherit";
  document.getElementById("newPassword").style.color = "inherit";
  document.getElementById("newUsername").placeholder = "Username";
  document.getElementById("newPassword").placeholder = "Password";
  document.getElementById("nameResult").innerHTML = "";
  document.getElementById("firstName").style.color = "inherit";
  document.getElementById("lastName").style.color = "inherit";
  document.getElementById("firstName").placeholder = "First Name";
  document.getElementById("lastName").placeholder = "Last Name";
  document.getElementById("passwordCheck").innerHTML = "";

  if (firstName == "" && lastName != "") {
    document.getElementById("nameResult").innerHTML =
      "First name field is empty *";
    document.getElementById("firstName").style.color = "red";
    document.getElementById("firstName").placeholder = "First Name *";
    pass = 0;
  } else if (lastName == "" && firstName != "") {
    document.getElementById("nameResult").innerHTML =
      "Last name field is empty *";
    document.getElementById("lastName").style.color = "red";
    document.getElementById("lastName").placeholder = "Last Name *";
    pass = 0;
  } else if (firstName == "" && lastName == "") {
    document.getElementById("nameResult").innerHTML =
      "First and last name fields are empty *";
    document.getElementById("firstName").style.color = "red";
    document.getElementById("firstName").placeholder = "First Name *";
    document.getElementById("lastName").style.color = "red";
    document.getElementById("lastName").placeholder = "Last Name *";
    pass = 0;
  }

  if (newLogin == "" && newPassword != "") {
    document.getElementById("signupResult").innerHTML =
      "Username field is empty *";
    document.getElementById("newUsername").style.color = "red";
    document.getElementById("newUsername").placeholder = "Username *";
    pass = 0;
  } else if (newPassword == "" && newLogin != "") {
    document.getElementById("signupResult").innerHTML =
      "Password field is empty *";
    document.getElementById("newPassword").style.color = "red";
    document.getElementById("newPassword").placeholder = "Password *";
    pass = 0;
  } else if (newPassword == "" && newLogin == "") {
    document.getElementById("signupResult").innerHTML =
      "Username and password fields are empty *";
    document.getElementById("newUsername").style.color = "red";
    document.getElementById("newUsername").placeholder = "Username *";
    document.getElementById("newPassword").style.color = "red";
    document.getElementById("newPassword").placeholder = "Password *";
    pass = 0;
  }
  console.log("newPassword: " + newPassword);

  if (newPassword == "") {
    return;
  }

  let regExUppercase = /[A-Z]/;
  let regExLowercase = /[a-z]/;
  let regExNumber = /\d/;
  let regExSpecialChar = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~ ]/;
  let password = document.getElementById("newPassword").value;
  let errorField = document.getElementById("passwordCheck");
  let errorMessage = "";

  if (password.length < 8) {
    errorMessage += "Password must be at least 8 characters long *\n";
  }
  if (!regExUppercase.test(password)) {
    errorMessage += "Password must contain an uppercase letter *\n";
  }
  if (!regExLowercase.test(password)) {
    errorMessage += "Password must contain a lowercase letter *\n";
  }
  if (!regExNumber.test(password)) {
    errorMessage += "Password must contain a number *\n";
  }
  if (!regExSpecialChar.test(password)) {
    errorMessage += "Password must contain a special character *";
  }
  errorField.innerHTML = errorMessage;
  if (errorMessage != "" || pass == 0) {
    return;
  }

  var newHash = md5(newPassword);

  var tmp = {
    login: newLogin,
    password: newHash,
    firstName: firstName,
    lastName: lastName,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SignUp." + extension;

  let xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    //Detects changes in the processing state of xhr
    xhr.onreadystatechange = function () {
      //xhr request finished processing
      if (this.readyState == 4) {
        if (this.status == 409) {
          //
          document.getElementById("signupResult").innerHTML =
            "Error: username is already taken";
          document.getElementById("SignupResult").color = "red";
          return;
        } else if (this.status == 200) {
          let jsonObject = JSON.parse(xhr.responseText);
          userId = jsonObject.id;

          saveCookie();
          window.location.href = "./landing-page.html?#";
        }
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("signupResult").innerHTML = err.message;
  }
}

function toggleForm(formToShow) {
  if (formToShow === "signup") {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";
  } else {
    document.getElementById("signupForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
  }
}

function showPassword() {
  let field = document.getElementById("password");
  if (field.type == "password") {
    field.type = "text";
  } else {
    field.type = "password";
  }
}

function showNewPassword() {
  let field = document.getElementById("newPassword");
  if (field.type == "password") {
    field.type = "text";
  } else {
    field.type = "password";
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
    date.toGMTString();
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
      "Logged in as \n" + firstName + " " + lastName;
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

  document.getElementById("addForm").style.display = "block";
  document.getElementById("addSubmitButton").style.display = "inline-block";
  document.getElementById("contactAddResult").innerHTML = "";
  document.getElementById("contactAddResult").className = "label";
});

$("#editContacts").on("hidden.bs.modal", function (e) {
  $(this)
    .find("input,textarea,select")
    .val("")
    .end()
    .find("input[type=checkbox], input[type=radio]")
    .prop("checked", "")
    .end();

  document.getElementById("editForm").style.display = "block";
  document.getElementById("editSubmitButton").style.display = "inline-block";
});

function addContact() {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let email = document.getElementById("emailAddress").value;
  let phone = document.getElementById("phoneNumber").value;

  document.getElementById("contactAddResult").innerHTML = "";
  document.getElementById("contactAddResult").className = "label";

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    createdByUserId: userId,
    emailAddress: email,
    phoneNumber: phone,
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/AddContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          document.getElementById("addForm").style.display = "none";
          document.getElementById("addSubmitButton").style.display = "none";

          document.getElementById("contactAddResult").className +=
            " label-success";
          document.getElementById("contactAddResult").innerHTML =
            "Contact has been added";
          searchContact(1);
        } else {
          err = JSON.parse(xhr.responseText).error;
          document.getElementById("contactAddResult").className +=
            " label-danger";
          document.getElementById("contactAddResult").innerHTML = err;
        }
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactAddResult").className += " label-danger";
    document.getElementById("contactAddResult").innerHTML = err.message;
  }
}

function onClickEdit(i) {
  document.getElementById("contactEditResult").innerHTML = "";
  document.getElementById("contactEditResult").className = "label";

  let firstName = document.getElementById("editFirstName");
  let lastName = document.getElementById("editLastName");
  let email = document.getElementById("editEmailAddress");
  let phone = document.getElementById("editPhoneNumber");

  firstName.value = document.getElementById(`firstName ${i}`).innerText;
  lastName.value = document.getElementById(`lastName ${i}`).innerText;
  email.value = document.getElementById(`emailAddress ${i}`).innerText;
  phone.value = document.getElementById(`phoneNumber ${i}`).innerText;
  let createdByUserId = document.getElementById(
    `createdByUserID ${i}`
  ).innerText;

  oldData = {
    firstName: firstName.value ?? "",
    lastName: lastName.value ?? "",
    emailAddress: email.value ?? "",
    phoneNumber: phone.value ?? "",
    createdByUserId: parseInt(createdByUserId, 10),
  };
}

function editContact(oldData) {
  let firstName = document.getElementById("editFirstName").value ?? "";
  let lastName = document.getElementById("editLastName").value ?? "";
  let email = document.getElementById("editEmailAddress").value ?? "";
  let phone = document.getElementById("editPhoneNumber").value ?? "";

  let tmp = {
    newFirstName: firstName,
    newLastName: lastName,
    newCreatedByUserId: userId,
    newAddress: email,
    newNumber: phone,
  };

  let temp = Object.assign({}, tmp, oldData);

  let jsonPayload = JSON.stringify(temp);

  let url = urlBase + "/UpdateContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          document.getElementById("editForm").style.display = "none";
          document.getElementById("editSubmitButton").style.display = "none";

          document.getElementById("contactEditResult").className +=
            " label-success";
          document.getElementById("contactEditResult").innerHTML =
            "Contact has been edited";

          searchContact();
        } else {
          err = JSON.parse(xhr.responseText).error;
          document.getElementById("contactEditResult").className +=
            " label-danger";
          document.getElementById("contactEditResult").innerHTML = err;
        }
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactEditResult").className += " label-danger";
    document.getElementById("contactEditResult").innerHTML = err.message;
  }
}

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

  document.getElementById("contactResult").innerHTML = "";
  document.getElementById("contactResult").className = "label navbar-right";

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    createdByUserId: userId,
    emailAddress: email,
    phoneNumber: phone,
  };

  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/DeleteContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          document.getElementById("contactResult").className += " label-danger";
          document.getElementById("contactResult").innerHTML =
            "Contact has been Deleted";

          document.getElementById(`row ${i}`).remove();

          document.getElementById("contactResult").className += " label-danger";

          searchContact(1);
        } else {
          err = JSON.parse(xhr.responseText).error;
          document.getElementById("contactResult").className += " label-info";
          document.getElementById("contactResult").innerHTML = err;
        }
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactResult").className += " label-info";
    document.getElementById("contactResult").innerHTML = err.message;
  }
}

function onArrowPageChange(i) {
  if (pageSelected + i > numPages || pageSelected + i < 1) return;

  document.getElementById(`Page ${pageSelected}`).classList.remove("active");
  pageSelected += i;
  searchContact();
  document.getElementById(`Page ${pageSelected}`).classList.add("active");
}

function onButtonPageChange(i) {
  document.getElementById(`Page ${pageSelected}`).classList.remove("active");
  pageSelected = i;
  searchContact();
  document.getElementById(`Page ${pageSelected}`).classList.add("active");
}

function createPaginationButtons(n) {
  numPages = n;

  document.getElementById("pagination-list").innerHTML = "";

  let listItem = document.createElement("li");
  let backButton = document.createElement("a");
  backButton.innerHTML = `
    <span aria-hidden="true">&laquo;</span>`;

  backButton.setAttribute("id", "backArrrow");
  backButton.setAttribute("aria-label", "Previous");
  backButton.setAttribute("onclick", `onArrowPageChange(${-1})`);

  listItem.appendChild(backButton);

  document.getElementById("pagination-list").appendChild(listItem);

  for (let i = 1; i <= numPages; i++) {
    listItem = document.createElement("li");

    let pageButton = document.createElement("a");
    pageButton.innerText = `${i}`;
    pageButton.setAttribute("onclick", `onButtonPageChange(${i})`);

    listItem.appendChild(pageButton);
    listItem.id = `Page ${i}`;

    document.getElementById("pagination-list").appendChild(listItem);
  }

  listItem = document.createElement("li");
  let forwardButton = document.createElement("a");
  forwardButton.innerHTML = `
    <span aria-hidden="true">&raquo;</span>`;

  forwardButton.setAttribute("id", "forwardArrow");
  forwardButton.setAttribute("aria-label", "Next");
  forwardButton.setAttribute("onclick", `onArrowPageChange(${1})`);

  listItem.appendChild(forwardButton);

  document.getElementById("pagination-list").appendChild(listItem);

  document.getElementById(`Page 1`).classList.add("active");

  pageSelected = 1;
}

function convertJSONtoTable(data, page) {
  let jsonData = "";

  let tableBody = document.getElementById("contactsBody");
  tableBody.innerHTML = "";

  if (Object.keys(data).length == 2) {
    jsonData = data["results"];

    numContacts = jsonData[0].AmountOfContacts;
    let pages = numContacts / 12;

    if (page == 1) {
      if (pages % 1 != 0) pages += 1;
      createPaginationButtons(pages);
    }
  } else {
    createPaginationButtons(1);
    document.getElementById("contactResult").className += " label-danger";
    document.getElementById("contactResult").innerHTML = "No Records Found";
  }

  for (let i = 1; i < jsonData.length; i++) {
    let item = jsonData[i];

    let tr = document.createElement("tr");
    tr.id = `row ${i}`;

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
    td.id = `friendshipLevel ${i}`;
    td.innerText = item.FriendshipLevel;
    tr.appendChild(td);

    td = document.createElement("td");
    td.id = `createdByUserID ${i}`;
    td.innerText = item.CreatedByUserID;
    td.style.display = "none";
    tr.appendChild(td);

    td = document.createElement("td");
    td.innerHTML = `
    <button id="${i}" class="btn btn-info" data-toggle="modal"
    data-target="#editContacts" onclick="onClickEdit(this.id);">
      <span class="glyphicon glyphicon-edit"></span>
    </button> 
    &nbsp;&nbsp; 
    <button id="${i}" class="btn btn-danger" onclick="deleteContactWrapper(this.id);">
      <span class="glyphicon glyphicon-trash"></span>
    </button>`;
    tr.appendChild(td);

    tableBody.appendChild(tr);
  }

  $.jQueryAnimate();
}

$.jQueryAnimate = function () {
  $("tbody tr").hide();
  $("tbody tr").each(function (index) {
    $(this)
      .delay(index * 100)
      .show(250);
  });
};

function searchContact(page = pageSelected) {
  srch = document.getElementById("searchText").value;

  document.getElementById("contactResult").innerHTML = "";
  document.getElementById("contactResult").className = "label navbar-right";

  let tmp = { search: srch, createdByUserId: userId, pageNumber: page };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/SearchContacts." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(xhr.responseText);

        convertJSONtoTable(data, page);
      }
    };

    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactResult").className += " label-danger";
    document.getElementById("contactResult").innerHTML = err.message;
  }
}
