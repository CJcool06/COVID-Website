const accountType = Object.freeze({"normal": "normal", "venueOwner": "venueOwner", "official": "official"});

var userProfile = new Vue({
    el: "#user",
    data: {
        id: -1,
        fName: "",
        lName: "",
        email: "",
        password: "",
        accountType: "",
        profileNav: "",
        activeVenue: {},
        activeUser: {}
    },
    mathods: {
        getNavActive(str) {
            return str === profileNav;
        }
    }
});

function unclickButton(id) {
    document.getElementById(id).blur();
}

function populateVenueData(venueCode) {
    let http = new XMLHttpRequest();
    http.open("POST", "/venue");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.activeVenue = this.response;
            }
        }
    }

    http.send(JSON.stringify({'venueCode': venueCode}));
}

function populateUserData(email) {
    let http = new XMLHttpRequest();
    http.open("POST", "/user");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.activeUser = this.response;
            }
        }
    }

    http.send(JSON.stringify({'email': email}));
}