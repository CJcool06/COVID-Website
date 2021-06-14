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
        activeUser: {},
        checkins: [{}],
        venues: [{}],
        venueCheckins: [{}],
        users: [{}],
        hotspots: [{}]
    },
    methods: {
        popVenueData(venueCode) {
            populateVenueData(venueCode);
            populateVenueCheckins(venueCode);
        },
        popUserData(email) {
            populateUserData(email);
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

function populateVenueCheckins(venueCode) {
    let http = new XMLHttpRequest();
    http.open("POST", "/venue/checkins");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.venueCheckins = this.response;
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

    http.send(JSON.stringify({ 'email': email, 'authEmail': userProfile.email, 'authPassword': userProfile.password}));
}

function populateUserCheckins() {
    let http = new XMLHttpRequest();
    http.open("POST", "/user/checkins");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.checkins = this.response;
            }
        }
    }

    http.send(JSON.stringify({ 'email': userProfile.email }));
}

function populateUserVenues() {
    let http = new XMLHttpRequest();
    http.open("POST", "/user/venues");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.venues = this.response;
            }
        }
    }

    http.send(JSON.stringify({ 'email': userProfile.email }));
}

function populateUsers() {
    let http = new XMLHttpRequest();
    http.open("POST", "/users");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.users = this.response;
            }
        }
    }

    http.send(JSON.stringify({ 'email': userProfile.email, 'password': userProfile.password }));
}

function populateVenues() {
    let http = new XMLHttpRequest();
    http.open("POST", "/venues");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.venues = this.response;
            }
        }
    }

    http.send(JSON.stringify({ 'email': userProfile.email, 'password': userProfile.password }));
}

function populateHotspots() {
    let http = new XMLHttpRequest();
    http.open("POST", "/hotspots");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                userProfile.hotspots = this.response;
                console.log(userProfile.hotspots);
            }
        }
    }

    http.send(JSON.stringify({ 'email': userProfile.email, 'password': userProfile.password }));
}

function saveUserInformation() {
    let fName = document.getElementById("firstName").value;
    let lName = document.getElementById("lastName").value;
    let oldPassword = document.getElementById("password").value;
    let newPassword = document.getElementById("newPassword").value;
    let email = document.getElementById("email").value;
    let accountType = document.getElementById("accountType").value;

    let http = new XMLHttpRequest();
    http.open("POST", "/save-user");
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
                nav.name = this.response.fName;

                document.getElementById("newPassword").value = "";
                postAlert("success", "Successfully saved your information!");
            }
        }
    }

    http.send(JSON.stringify({ 'fName': fName, 'lName': lName, 'oldPassword': oldPassword, 'newPassword': newPassword, 'email': email, 'accountType': accountType, 'authEmail': email, 'authPassword': oldPassword }));
}

function saveOtherUserInformation() {
    let fName = document.getElementById("firstName").value;
    let lName = document.getElementById("lastName").value;
    let oldPassword = document.getElementById("password").value;
    let newPassword = document.getElementById("newPassword").value;
    let email = document.getElementById("email").value;
    let accountType = document.getElementById("accountType").value;

    let http = new XMLHttpRequest();
    http.open("POST", "/save-user");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                document.getElementById("newPassword").value = "";
                populateUsers();
                postAlert("success", "Successfully saved!");
            }
        }
    }

    http.send(JSON.stringify({ 'fName': fName, 'lName': lName, 'oldPassword': oldPassword, 'newPassword': newPassword, 'email': email, 'accountType': accountType, 'authEmail': userProfile.email, 'authPassword': userProfile.password }));
}

function saveVenueInformation() {
    let code = document.getElementById("venueCode").value;
    let name = document.getElementById("venueName").value;
    let latitude = document.getElementById("venueLatitude").value;
    let longitude = document.getElementById("venueLongitude").value;

    let http = new XMLHttpRequest();
    http.open("POST", "/save-venue");
    http.responseType = "json";
    http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

    http.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status != 200) {
                console.log(this.response.error);
            }
            else {
                populateUserVenues();
                populateVenues();
                postAlert("success", "Successfully saved venue information!");
            }
        }
    }

    http.send(JSON.stringify({ 'code': code, 'name': name, 'latitude': latitude, 'longitude': longitude, 'userEmail': userProfile.email, 'userPassword': userProfile.password }));
}

function doCheckIn() {
    let code = document.getElementById("checkinCode").value;

    if (code != "") {
        let http = new XMLHttpRequest();
        http.open("POST", "/user/check-in");
        http.responseType = "json";
        http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status != 200) {
                    console.log(this.response.error);
                }
                else {
                    populateUserCheckins();
                    postAlert("success", "Successfully checked in to the venue!");
                }
            }
        }

        http.send(JSON.stringify({ 'venueCode': code, 'userEmail': userProfile.email, 'userPassword': userProfile.password }));
        document.getElementById("checkinCode").value = "";
    }
}





let currentTimeout = null;

function postAlert(type, message) {
    let wrapper = document.getElementById("alerts");
    wrapper.innerHTML = 
    '<div id="alert" class="alert alert-' + type + ' alert-dismissible fade show text-center w-100" role="alert" style="margin-top: 10px;">' + 
        message + 
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' + 
    '</div>';

    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }

    currentTimeout = setTimeout(() => {
        let alertNode = document.getElementById('alert');
        let alert = new bootstrap.Alert(alertNode);
        alert.close();
    }, 3000);
}