const e = require('express');
var express = require('express');
var router = express.Router();
const mysql = require('mysql');

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
// var account = {'id': 0, 'fName': 'Person', 'lName': "Smith", 'email': 'chris@gmail.com', 'password': '12345', 'accountType': "normal"};
var loggedIn = [{}];
var venues = [ { 'id': 0, 'code': 'GVMkhjbd', "name": "Starbucks", "lat": -34.928, "long": 138.601 }, { 'id': 1, 'code': 'KJNi676d', "name": "Bunnings", "lat": -34.920, "long": 138.610 }, { 'id': 2, 'code': '87asgdyhD', "name": "Adelaide Uni", "lat": -34.931, "long": 138.596 } ];
var users = [ {'id': 0, 'fName': 'Chris', 'lName': "Bob", 'email': 'chris@gmail.com', 'password': '12345', 'accountType': "normal"}, {'id': 0, 'fName': 'Matt', 'lName': "Smith", 'email': 'matt@gmail.com', 'password': '12345', 'accountType': "normal"}, {'id': 0, 'fName': 'Chelsea', 'lName': "Smith", 'email': 'chelsea@gmail.com', 'password': '12345', 'accountType': "normal"}, {'id': 0, 'fName': 'Angel', 'lName': "Allen", 'email': 'angel@gmail.com', 'password': '12345', 'accountType': "normal"} ];

router.post("/login", function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;
	let cookie = req.body.cookie;

	getUserFromEmailDB(email, (err, users) => {
		if (err) {
			console.log(err);
			return res.status(203).json({"error": "Database error."});
		}
		else if (users.length <= 0) {
			return res.status(203).json({"error": "No user was found."});
		}
		else if (users[0].password != password) {
			res.status(203).json({"error": "Incorrect password."});
		}
		else {
			res.status(200).json(users[0]);
			loggedIn.push({ "cookie": cookie, "email": email });
		}
	});
});

router.post("/logout", function(req, res, next) {
	let cookie = req.body.cookie;

	getLoggedInUserIndex(cookie, (index) => {
		if (!index) {
			res.status(203).json({"error": "No user was found."});
		}
		else {
			loggedIn.splice(index, 1);
			res.sendStatus(200);
		}
	});
});

router.post("/loggedin", function(req, res, next) {
	let cookie = req.body.cookie;

	getLoggedInUser(cookie, (user) => {
		if (!user) {
			res.status(203).json({"error": "No user was found."});
		}
		else {
			res.status(200).json(user);
		}
	});
});

router.post("/venue", function(req, res, next) {
	let venueCode = req.body.venueCode;

	getVenueDB(venueCode, (err, venues) => {
		if (err) {
			console.log(err);
			res.status(203).json({"error": "Database error."});
		}
		else if (venues.length <= 0) {
			res.status(203).json({"error": "No venue was found."});
		}
		else {
			res.status(200).json(venues[0]);
		}
	});
});

router.post("/user", function(req, res, next) {
	let email = req.body.email;
	let authEmail = req.body.authEmail;
	let authPassword = req.body.authPassword;

	sensitiveInformationAuth(authEmail, authPassword, (authenticated) => {
		if (!authenticated) {
			res.status(203).json({"error": "Wrong permissions."});
		}
		else {
			getUserFromEmailDB(email, (err, users) => {
				if (err) {
					console.log(err);
					res.status(203).json({"error": "Database error."});
				}
				else if (users.length <= 0) {
					res.status(203).json({"error": "No user was found."});
				}
				else {
					res.status(200).json(users[0]);
				}
			});
		}
	});
});

router.post("/users", function(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;

	sensitiveInformationAuth(email, password, (authenticated) => {
		if (!authenticated) {
			res.status(203).json({"error": "Wrong permissions."});
		}
		else {
			getUsersDB((err, allUsers) => {
				if (err) {
					console.log(err);
					res.status(203).json({"error": "Database error."});
				}
				else {
					res.status(200).json(allUsers);
				}
			});
		}
	});
});

router.post("/venues", function(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;

	sensitiveInformationAuth(email, password, (authenticated) => {
		if (!authenticated) {
			res.status(203).json({"error": "Wrong permissions."});
		}
		else {
			getVenuesDB((err, allVenues) => {
				if (err) {
					console.log(err);
					res.status(203).json({"error": "Database error."});
				}
				else {
					let changeNames = new Promise((resolve, reject) => {
						let count = 0;
						for (const index in allVenues) {
							getUserFromIDDB(allVenues[index].owner, (err, users) => {
								allVenues[index].owner = users[0].fName + " " + users[0].lName;
								count++;
								if (count == (allVenues.length)) {
									resolve();
								}
							});
						}
					});
		
					changeNames.then(() => {
						return res.status(200).json(allVenues);
					});
				}
			});
		}
	});
});

router.post("/save-user", function(req, res) {
	let fName = req.body.fName;
    let lName = req.body.lName;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
	let email = req.body.email;
	let accountType = req.body.accountType;
	let authEmail = req.body.authEmail;
	let authPassword = req.body.authPassword;

	// No auth needed, the user is submitting this request
	if ((authEmail === email) && (authPassword === oldPassword)) {
		getUserFromEmailDB(email, (err, users) => {
			if (err) {
				console.log(err);
				return res.status(203).json({"error": "Database error."});
			}
			else if (users.length <= 0) {
				return res.status(203).json({"error": "No user was found."});
			}
			else if (users[0].password != oldPassword) {
				return res.status(203).json({"error": "Wrong password."});
			}
			else {
				updateUserDB(fName, lName, email, (newPassword == "" ? oldPassword : newPassword), accountType, (err, result) => {
					if (err) {
						res.status(203).json({"error": "No user was found."});
					}
					else {
						getUserFromEmailDB(email, (err, users) => {
							res.status(200).json(users[0]);
						});
					}
				});
			}
		});
	}
	else {
		sensitiveInformationAuth(authEmail, authPassword, (authenticated) => {
			if (!authenticated) {
				res.status(203).json({"error": "Wrong permissions."});
			}
			else {
				updateUserDB(fName, lName, email, (newPassword == "" ? oldPassword : newPassword), accountType, (err, result) => {
					if (err) {
						res.status(203).json({"error": "No user was found."});
					}
					else {
						getUserFromEmailDB(email, (err, users) => {
							res.status(200).json(users[0]);
						});
					}
				});
			}
		});
	}
});

router.post("/save-venue", function(req, res) {
	let code = req.body.code;
    let name = req.body.name;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
	let userEmail = req.body.userEmail;
	let userPassword = req.body.userPassword;

	getUserFromEmailDB(userEmail, (err, users) => {
		if (err) {
			console.log(err);
			return res.status(203).json({"error": "Database error."});
		}
		else if (users.length <= 0) {
			return res.status(203).json({"error": "No user was found."});
		}
		else if (users[0].password != userPassword) {
			return res.status(203).json({"error": "Wrong password."});
		}
		else {
			getVenueDB(code, (err, venues) => {
				if (err) {
					console.log(err);
					res.status(203).json({"error": "Database error."});
				}
				else if (venues.length <= 0) {
					res.status(203).json({"error": "No venue was found."});
				}
				else {
					if (venues[0].owner != users[0].id && users[0].accountType != "officer") {
						res.status(203).json({"error": "Wrong permissions."});
					}
					else {
						updateVenueDB(code, name, latitude, longitude, (err, result) => {
							if (err) {
								res.status(203).json({"error": "No venue was found."});
							}
							else {
								updateVenueInCheckinsDB(code, name, (error, result) => {
									res.sendStatus(200);
								});
							}
						});
					}
				}
			});
		}
	});
});

router.post("/user/checkins", function(req, res, next) {
	let email = req.body.email;

	getUserFromEmailDB(email, (err, users) => {
		if (err) {
			console.log(err);
			return res.status(203).json({"error": "Database error."});
		}
		else if (users.length <= 0) {
			return res.status(203).json({"error": "No user was found."});
		}
		else {
			getUserCheckinsDB(users[0].id, (err, checkins) => {
				if (err) {
					return res.status(203).json({"error": "Problem getting user's checkins."})
				}
				else {
					let changeNames = new Promise((resolve, reject) => {
						let count = 0;
						for (const index in checkins) {
							getUserFromIDDB(checkins[index].user, (err, users) => {
								checkins[index].user = users[0].fName + " " + users[0].lName;
								checkins[index].time = new Date(checkins[index].time).toISOString().replace("T", " ").replace(".000Z", "");
								count++;
								if (count == (checkins.length)) {
									resolve();
								}
							});
						}
					});
		
					changeNames.then(() => {
						return res.status(200).json(checkins);
					});
				}
			})
		}
	});
});

router.post("/user/venues", function(req, res, next) {
	let email = req.body.email;

	getUserFromEmailDB(email, (err, users) => {
		if (err) {
			console.log(err);
			return res.status(203).json({"error": "Database error."});
		}
		else if (users.length <= 0) {
			return res.status(203).json({"error": "No user was found."});
		}
		else {
			getUserVenuesDB(users[0].id, (err, venues) => {
				if (err) {
					return res.status(203).json({"error": "Problem getting user's venues."})
				}
				else {
					return res.status(200).json(venues);
				}
			})
		}
	});
});

router.post("/venue/checkins", function(req, res, next) {
	let code = req.body.venueCode;

	getVenueCheckinsDB(code, (err, checkins) => {
		if (err) {
			console.log(err);
			return res.status(203).json({"error": "Database error."});
		}
		else if (users.length <= 0) {
			return res.status(203).json({"error": "No checkins were found."});
		}
		else {
			let changeNames = new Promise((resolve, reject) => {
				let count = 0;
				for (const index in checkins) {
					getUserFromIDDB(checkins[index].user, (err, users) => {
						checkins[index].user = users[0].fName + " " + users[0].lName;
						checkins[index].time = new Date(checkins[index].time).toISOString().replace("T", " ").replace(".000Z", "");
						count++;
						if (count == (checkins.length)) {
							resolve();
						}
					});
				}
			});

			changeNames.then(() => {
				return res.status(200).json(checkins);
			});
		}
	});
});

router.post("/hotspots", function(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;

	sensitiveInformationAuth(email, password, (authenticated) => {
		if (!authenticated) {
			res.status(203).json({"error": "Wrong permissions."});
		}
		else {
			getHotspotsDB((err, allHotspots) => {
				if (err) {
					console.log(err);
					res.status(203).json({"error": "Database error."});
				}
				else {
					let changeNames = new Promise((resolve, reject) => {
						let count = 0;
						for (const index in allHotspots) {
							getVenueDB(allHotspots[index].venue, (err, venues) => {
								allHotspots[index].venue = venues[0];
								allHotspots[index].since = new Date(allHotspots[index].since).toISOString().replace("T", " ").replace(".000Z", "");
								count++;
								if (count == (allHotspots.length)) {
									resolve();
								}
							});
						}
					});
		
					changeNames.then(() => {
						return res.status(200).json(allHotspots);
					});
				}
			});
		}
	});
});

router.post("/user/check-in", function(req, res, next) {
	let code = req.body.venueCode;
	let email = req.body.userEmail;
	let password = req.body.userPassword;

	getUserFromEmailDB(email, (err, users) => {
		if (err) {
			console.log(err);
			return res.status(203).json({"error": "Database error."});
		}
		else if (users.length <= 0) {
			return res.status(203).json({"error": "No user was found."});
		}
		else if (users[0].password != password) {
			return res.status(203).json({"error": "Incorrect password."});
		}
		else {
			getVenueDB(code, (err, venues) => {
				if (err) {
					return res.status(203).json({"error": "Problem getting user's venues."})
				}
				else if (venues.length <= 0) {
					return res.status(203).json({"error": "No venue found with that code."})
				}
				else {
					addCheckin(users[0].id, venues[0].name, venues[0].code, new Date().toISOString().slice(0, 19).replace('T', ' '), (err, result) => {
						if (err) {
							console.log(err);
							return res.status(203).json({"error": "Database error."});
						}
						else {
							return res.sendStatus(200);
						}
					});
				}
			})
		}
	});
});


function getLoggedInUser(cookie, callback) {
	let found = false;
	for (const index in loggedIn) {
		if (loggedIn[index].cookie == cookie) {
			found  = true;
			getUserFromEmailDB(loggedIn[index].email, (err, users) => {
				if (err) {
					console.log(err);
					return callback(null);
				}
				else if (users.length <= 0) {
					return callback(null);
				}
				else {
					return callback(users[0]);
				}
			});
		}
	}

	if (!found) {
		return callback(null);
	}
}

function getLoggedInUserIndex(cookie, callback) {
	let found = false;
	for (const index in loggedIn) {
		if (loggedIn[index].cookie == cookie) {
			found  = true;
			getUserFromEmailDB(loggedIn[index].email, (err, users) => {
				if (err) {
					console.log(err);
					return callback(null);
				}
				else if (users.length <= 0) {
					return callback(null);
				}
				return callback(index);
			});
		}
	}

	if (!found) {
		return callback(null);
	}
}

function sensitiveInformationAuth(email, password, callback) {
	getUserFromEmailDB(email, (err, users) => {
		if (err) {
			console.log(err);
			callback(false);
		}
		else if (users.length <= 0) {
			callback(false);
		}
		else if (users[0].password != password) {
			callback(false);
		}
		else {
			if (users[0].accountType != "official") {
				callback(false);
			}
			else {
				callback(true);
			}
		}
	});
}


/* DATABASE QUERIES */

const pool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "root",
	password: "Cocoplop2",
	database: "covidw"
});

function getUsersDB(callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM users", (err, users) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, users);
		});
		con.release();
	});
}

function getUserFromEmailDB(email, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM users WHERE email = '" + email + "'", (err, users) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, users);
		});
		con.release();
	});
}

function getUserFromIDDB(id, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM users WHERE id = '" + id + "'", (err, users) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, users);
		});
		con.release();
	});
}

function getVenuesDB(callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM venues", (err, venues) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, venues);
		});
		con.release();
	});
}

function getVenueDB(code, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM venues WHERE code = '" + code + "'", (err, venues) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, venues);
		});
		con.release();
	});
}

function updateUserDB(fName, lName, email, password, accountType, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("UPDATE users SET fName = '" + fName + "', lName = '" + lName + "', password = '" + password + "', accountType = '" + accountType + "' WHERE email = '" + email + "'", (err, result) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, result);
		});
		con.release();
	});
}

function updateVenueDB(code, name, latitude, longitude, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("UPDATE venues SET name = '" + name + "', latitude = '" + latitude + "', longitude = '" + longitude + "' WHERE code = '" + code + "'", (err, result) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, result);
		});
		con.release();
	});
}

function updateVenueInCheckinsDB(code, name, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("UPDATE checkins SET venue = '" + name + "' WHERE code = '" + code + "'", (err, result) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, result);
		});
		con.release();
	});
}

function getUserCheckinsDB(id, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM checkins WHERE user = '" + id + "'", (err, checkins) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, checkins);
		});
		con.release();
	});
}

function getUserVenuesDB(id, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM venues WHERE owner = '" + id + "'", (err, venues) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, venues);
		});
		con.release();
	});
}

function getVenueCheckinsDB(code, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM checkins WHERE code = '" + code + "'", (err, checkins) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, checkins);
		});
		con.release();
	});
}

function getHotspotsDB(callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM hotspots", (err, hotspots) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, hotspots);
		});
		con.release();
	});
}

function addCheckin(userID, venueName, venueCode, time, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query('SELECT MAX(id) as maxID FROM checkins', (err, maxQ) => {
            if (err) {
                callback(err, null);
            }
            else {
                con.query('INSERT INTO checkins VALUES(' + (maxQ[0].maxID + 1) + ',' + userID + ',\'' + venueName + '\',\'' + venueCode + '\',\'' + time + '\')', (err, result) => {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    }
                    else {
                        console.log(result);
                        callback(null, result);
                    }
                });
            }
        });
        con.release();
	});
}

module.exports = router;
