/* Startup */
loadUser();




var nav = new Vue({
    el: "#nav",
    data: {
        loggedIn: false
    }
});

function login() {
    // For testing
    let email = "person.smith@fakemail.com";
    let password = "12345";

    var http = new XMLHttpRequest();
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
                userProfile.password = this.response.password
                userProfile.accountType = this.response.accountType;
                nav.loggedIn = true;
            }
        }
    }

    http.send(JSON.stringify({'email': email, 'password': password}));
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
                userProfile.password = this.response.password
                userProfile.accountType = this.response.accountType;
                nav.loggedIn = true;
            }
        }
    }

    http.open("GET", "/loggedin", true);
    http.send();
}