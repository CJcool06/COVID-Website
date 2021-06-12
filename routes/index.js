var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.sendFile('homepage.html', { root: __dirname + '/../public/' } );
});

/* GET map page. */
router.get('/map', function(req, res, next) {
  	res.sendFile('map.html', { root: __dirname + '/../public/' } );
});

/* GET information page. */
router.get('/information', function(req, res, next) {
  	res.sendFile('information.html', { root: __dirname + '/../public/' } );
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  	res.sendFile('about.html', { root: __dirname + '/../public/' } );
});

/* GET profiile page. */
router.get('/profile', function(req, res, next) {
	res.sendFile('profile.html', { root: __dirname + '/../public/' } );
});

/* GET privacy policy page. */
router.get('/privacy_policy', function(req, res, next) {
	res.sendFile('privacy_policy.html', { root: __dirname + '/../public/' } );
});


/* LOGIN HANDLING */

// For testing
var account = {'id': 0, 'fName': 'Person', 'lName': "Smith", 'email': 'person.smith@fakemail.com', 'password': '12345', 'accountType': "normal"};
var loggedIn = false;
var venues = [ { 'id': 0, 'code': 'GVMkhjbd', "name": "Starbucks", "lat": -34.928, "long": 138.601 }, { 'id': 1, 'code': 'KJNi676d', "name": "Bunnings", "lat": -34.920, "long": 138.610 }, { 'id': 2, 'code': '87asgdyhD', "name": "Adelaide Uni", "lat": -34.931, "long": 138.596 } ];
var users = [ {'id': 0, 'fName': 'Chris', 'lName': "Bob", 'email': 'chris@gmail.com', 'password': '12345', 'accountType': "normal"}, {'id': 0, 'fName': 'Matt', 'lName': "Smith", 'email': 'matt@gmail.com', 'password': '12345', 'accountType': "normal"}, {'id': 0, 'fName': 'Chelsea', 'lName': "Smith", 'email': 'chelsea@gmail.com', 'password': '12345', 'accountType': "normal"}, {'id': 0, 'fName': 'Angel', 'lName': "Allen", 'email': 'angel@gmail.com', 'password': '12345', 'accountType': "normal"} ];

router.post("/login", function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

	if (account.email != email) {
		res.status(203).json({"error": "Incorrect email."});
	}
	else if (account.password != password) {
		res.status(203).json({"error": "Incorrect password."});
	}
	else {
		res.status(200).json(account);
		loggedIn = true;
	}
});

router.post("/logout", function(req, res, next) {
	loggedIn = false;
	res.sendStatus(200);
});

router.get("/loggedin", function(req, res, next) {
	if (loggedIn) {
		res.status(200).json(account);
	}
	else {
		res.status(203).json({"error": "Not logged in."});
	}
});

router.post("/venue", function(req, res, next) {
	let venueCode = req.body.venueCode;

	for (index in venues) {
		if (venues[index].code === venueCode) {
			res.status(200).json(venues[index]);
			return;
		}
	}

	res.status(203).json({ "error": "No venue found."});
});

router.post("/user", function(req, res, next) {
	let email = req.body.email;

	for (index in users) {
		if (users[index].email === email) {
			res.status(200).json(users[index]);
			return;
		}
	}

	res.status(203).json({ "error": "No user found."});
});


module.exports = router;
