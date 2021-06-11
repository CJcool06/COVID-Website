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



module.exports = router;
