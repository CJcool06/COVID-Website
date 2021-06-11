const accountType = Object.freeze({"normal": "normal", "venueOwner": "venueOwner", "official": "official"});

var userProfile = new Vue({
    el: "#user",
    data: {
        id: -1,
        fName: "",
        lName: "",
        email: "",
        password: "",
        accountType: ""
    }
});