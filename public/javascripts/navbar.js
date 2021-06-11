/* Startup */
loadUser();




var nav = new Vue({
    el: "#nav",
    data: {
        loggedIn: false,
        name: ""
    }
});

function login() {
    // For testing
    let email = "person.smith@fakemail.com";
    let password = "12345";

    let http = new XMLHttpRequest();
    http.open("POST", "/login");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.id = this.response.id;
                userProfile.fName = this.response.fName;
                userProfile.lName = this.response.lName;
                userProfile.email = this.response.email;
                userProfile.password = this.response.password;
                userProfile.accountType = this.response.accountType;
                nav.loggedIn = true;
                nav.name = this.response.fName;
            }
        }
    }

    http.send(JSON.stringify({'email': email, 'password': password}));
}

function logout() {
    let email = "person.smith@fakemail.com";

    let http = new XMLHttpRequest();
    http.open("POST", "/logout");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.id = -1;
                userProfile.fName = "";
                userProfile.lName = "";
                userProfile.email = "";
                userProfile.password = "";
                userProfile.accountType = "";
                nav.loggedIn = false;
                nav.name = "";
            }
        }
    }

    http.send(JSON.stringify({'email': email}));
}

function loadUser() {
    var http = new XMLHttpRequest();
    http.responseType = "json";

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.id = this.response.id;
                userProfile.fName = this.response.fName;
                userProfile.lName = this.response.lName;
                userProfile.email = this.response.email;
                userProfile.password = this.response.password;
                userProfile.accountType = this.response.accountType;
                nav.loggedIn = true;
                nav.name = this.response.fName;
            }
        }
    }

    http.open("GET", "/loggedin", true);
    http.send();
}