const accountType = Object.freeze({"normal": "normal", "venueOwner": "venueOwner", "official": "official"});

/**
 * Main user profile object.
 * 
 * This is used to display data on the profile page, as well as control the navigation of the page.
 */
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

/**
 * Constrols the unclicking of a button. Bootstrap's native button clicking looks terrible!
 * 
 * @param {*} id - Button id
 */
function unclickButton(id) {
    document.getElementById(id).blur();
}

/**
 * Populate the profile's venue data.
 * 
 * @param {*} venueCode - Code
 */
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

/**
 * Populate the profile's venue checkins.
 * 
 * @param {*} venueCode - Code
 */
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
                console.log(this.response);
                userProfile.venueCheckins = this.response;
            }
        }
    }

    http.send(JSON.stringify({'venueCode': venueCode}));
}

/**
 * Populate the user's information data.
 * 
 * @param {*} email - User's email
 */
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

/**
 * Populates the user's check-ins.
 */
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

/**
 * Populates the user's owned venues.
 */
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

/**
 * Populate all users.
 */
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

/**
 * Populate all venues.
 */
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

/**
 * Populate all hotspots.
 */
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

/**
 * Save the user's information.
 */
function saveUserInformation() {
    let fName = document.getElementById("firstName").value;
    let lName = document.getElementById("lastName").value;
    let oldPassword = document.getElementById("password").value;
    let newPassword = document.getElementById("newPassword").value;
    let email = document.getElementById("email").value;
    let accountType = document.getElementById("accountType").value;

    let http = new XMLHttpRequest();
    http.open("POST", "/user/save");
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
                nav.accountType = this.response.accountType;

                document.getElementById("newPassword").value = "";
                postAlert("success", "Successfully saved your information!");
            }
        }
    }

    http.send(JSON.stringify({ 'fName': fName, 'lName': lName, 'oldPassword': oldPassword, 'newPassword': newPassword, 'email': email, 'accountType': accountType, 'authEmail': email, 'authPassword': oldPassword }));
}

/**
 * Save another user's information.
 */
function saveOtherUserInformation() {
    let fName = document.getElementById("firstName").value;
    let lName = document.getElementById("lastName").value;
    let oldPassword = document.getElementById("password").value;
    let newPassword = document.getElementById("newPassword").value;
    let email = document.getElementById("email").value;
    let accountType = document.getElementById("accountType").value;

    let http = new XMLHttpRequest();
    http.open("POST", "/user/save");
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
                if (email == userProfile.email) {
                    nav.name = fName;
                    nav.accountType = userProfile.accountType;
                }
                postAlert("success", "Successfully saved!");
            }
        }
    }

    http.send(JSON.stringify({ 'fName': fName, 'lName': lName, 'oldPassword': oldPassword, 'newPassword': newPassword, 'email': email, 'accountType': accountType, 'authEmail': userProfile.email, 'authPassword': userProfile.password }));
}

/**
 * Save a venue's information.
 */
function saveVenueInformation() {
    let code = document.getElementById("venueCode").value;
    let name = document.getElementById("venueName").value;
    let latitude = document.getElementById("venueLatitude").value;
    let longitude = document.getElementById("venueLongitude").value;

    let http = new XMLHttpRequest();
    http.open("POST", "/venue/save");
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

/**
 * Process a user checking-in to a venue.
 */
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

/**
 * Process the creation of a new venue.
 */
function createNewVenue() {
    let name = document.getElementById("venueName").value;

    if (name != "") {
        let code = genRandom10DigitCode();
        let http = new XMLHttpRequest();
        http.open("POST", "/venue/new");
        http.responseType = "json";
        http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status != 200) {
                    console.log(this.response.error);
                }
                else {
                    populateUserVenues();
                    postAlert("success", "Successfully created a new venue!");
                }
            }
        }

        http.send(JSON.stringify({ 'ownerEmail': userProfile.email, 'ownerPassword': userProfile.password, 'name': name, 'code': code, 'latitude': 0, 'longitude': 0 }));
        document.getElementById("venueName").value = "";
    }
}

/**
 * Process the removal of an existing venue.
 */
function removeVenue() {
    let code = document.getElementById("venuesVenueCode").value;

    if (code != "") {
        let http = new XMLHttpRequest();
        http.open("POST", "/venue/remove");
        http.responseType = "json";
        http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status != 200) {
                    console.log(this.response.error);
                }
                else {
                    populateUserVenues();
                    postAlert("success", "Successfully removed the venue!");
                }
            }
        }

        http.send(JSON.stringify({ 'email': userProfile.email, 'password': userProfile.password, 'venueCode': code }));
        document.getElementById("venuesVenueCode").value = "";
    }
}

/**
 * Process the addition of a new hotspot.
 */
function addHotspot() {
    let code = document.getElementById("venueCode").value;

    if (code != "") {
        let http = new XMLHttpRequest();
        http.open("POST", "/hotspots/add");
        http.responseType = "json";
        http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status != 200) {
                    console.log(this.response.error);
                }
                else {
                    populateHotspots();
                    postAlert("success", "Successfully added the hotspot!");
                }
            }
        }

        http.send(JSON.stringify({ 'email': userProfile.email, 'password': userProfile.password, 'venueCode': code }));
        document.getElementById("venueCode").value = "";
    }
}

/**
 * Process the removal of an existing hotspot.
 */
function removeHotspot() {
    let code = document.getElementById("venueCode").value;

    if (code != "") {
        let http = new XMLHttpRequest();
        http.open("POST", "/hotspots/remove");
        http.responseType = "json";
        http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status != 200) {
                    console.log(this.response.error);
                }
                else {
                    populateHotspots();
                    postAlert("success", "Successfully removed the hotspot!");
                }
            }
        }

        http.send(JSON.stringify({ 'email': userProfile.email, 'password': userProfile.password, 'venueCode': code }));
        document.getElementById("venueCode").value = "";
    }
}

/**
 * Processes the removal of a user.
 */
function removeUser() {
    let email = document.getElementById("usersEmail").value;

    if (email != "") {
        let http = new XMLHttpRequest();
        http.open("POST", "/user/remove");
        http.responseType = "json";
        http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");

        http.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status != 200) {
                    console.log(this.response.error);
                }
                else {
                    populateUsers();
                    postAlert("success", "Successfully removed the user!");
                }
            }
        }

        http.send(JSON.stringify({ 'email': email, 'authEmail': userProfile.email, 'authPassword': userProfile.password }));
        document.getElementById("usersEmail").value = "";
    }
}

/**
 * Processes a dummy invite as I ran out of time to implement a proper email service.
 */
function dummyInvite() {
    let email = document.getElementById("inviteEmail").value;

    if (email != "") {
        postAlert("success", "Invite sent!");
        document.getElementById("inviteEmail").value = "";
    }
}


/**
 * UTILITY FUNCTIONS
 */

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

function genRandom10DigitCode() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}