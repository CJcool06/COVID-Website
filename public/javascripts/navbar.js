/* Startup */
loadUser();




var nav = new Vue({
    el: "#nav",
    data: {
        loggedIn: false,
        name: "",
        accountType: ""
    }
});

function login() {
    // For testing
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;

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
                nav.accountType = this.response.accountType;

                // Redirect back to main page... I wish the login page was made better so I didn't have to do this!
                window.location.replace('/');
            }
        }
    }

    http.send(JSON.stringify({ 'email': email, 'password': password }));
}

function logout() {
    let http = new XMLHttpRequest();
    http.responseType = "json";

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
                nav.accountType = "";
            }
        }
    }

    http.open("GET", "/logout");
    http.send();
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
                nav.accountType = this.response.accountType;
            }
        }
    }

    http.open("GET", "/loggedin");
    http.send();
}