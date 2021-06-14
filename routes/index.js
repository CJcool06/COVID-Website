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

/**
 * Logs a user into the server and stores their cookie for future page loads.
 */
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

/**
 * Logs a user out.
 */
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

/**
 * Checks whether a user is logged in.
 */
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

/**
 * Gets a venue from the database.
 */
router.post("/venue", function(req, res, next) {
	let venueCode = req.body.venueCode;

	getVenueFromCodeDB(venueCode, (err, venues) => {
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

/**
 * Gets a user from the database.
 */
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

/**
 * Gets all users in the database.
 */
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

/**
 * Gets all venues in the database.
 */
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

/**
 * Saves a user's information.
 */
router.post("/user/save", function(req, res) {
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

/**
 * Saves a venue's information.
 */
router.post("/venue/save", function(req, res) {
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
			getVenueFromCodeDB(code, (err, venues) => {
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
						let oldName = venues[0].name;
						updateVenueDB(code, name, latitude, longitude, (err, result) => {
							if (err) {
								res.status(203).json({"error": "No venue was found."});
							}
							else {
								updateVenueInCheckinsDB(code, name, (err, result) => {
									updateVenueInHotspotsDB(oldName, name, (err, result) => {
										res.sendStatus(200);
									});
								});
							}
						});
					}
				}
			});
		}
	});
});

/**
 * Gets all the check-ins a user has made.
 */
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

/**
 * Gets all venues owned by a user.
 */
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

/**
 * Gets all check-ins made at a venue.
 */
router.post("/venue/checkins", function(req, res, next) {
	let code = req.body.venueCode;

	getVenueCheckinsDB(code, (err, checkins) => {
		if (err) {
			console.log(err);
			return res.status(203).json({"error": "Database error."});
		}
		else if (checkins.length <= 0) {
			return res.status(200).json({});
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

/**
 * Get all hotspots.
 */
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
							getVenueFromCodeDB(allHotspots[index].venue, (err, venues) => {
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

/**
 * Submit a check-in for a user.
 */
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
			getVenueFromCodeDB(code, (err, venues) => {
				if (err) {
					return res.status(203).json({"error": "Problem getting user's venues."});
				}
				else if (venues.length <= 0) {
					return res.status(203).json({"error": "No venue found with that code."});
				}
				else {
					addCheckInDB(users[0].id, venues[0].name, venues[0].code, new Date().toISOString().slice(0, 19).replace('T', ' '), (err, result) => {
						if (err) {
							console.log(err);
							return res.status(203).json({"error": "Database error."});
						}
						else {
							return res.sendStatus(200);
						}
					});
				}
			});
		}
	});
});

/**
 * Add a new venue.
 */
router.post("/venue/new", function(req, res, next) {
	let ownerEmail = req.body.ownerEmail;
	let ownerPassword = req.body.ownerPassword;
	let code = req.body.code;
	let name = req.body.name;
	let latitude = req.body.latitude;
	let longitude = req.body.longitude;

	getUserFromEmailDB(ownerEmail, (err, users) => {
		if (err) {
			console.log(err);
			return res.status(203).json({"error": "Database error."});
		}
		else if (users.length <= 0) {
			return res.status(203).json({"error": "No user was found."});
		}
		else if (users[0].password != ownerPassword) {
			return res.status(203).json({"error": "Incorrect password."});
		}
		else {
			getVenueFromCodeDB(code, (err, venues) => {
				if (err) {
					return res.status(203).json({"error": "Problem getting user's venues."});
				}
				else if (venues.length > 0) {
					return res.status(203).json({"error": "A venue already exists with that code."});
				}
				else {
					addVenueDB(users[0].id, name, code, latitude, longitude, (err, result) => {
						if (err) {
							console.log(err);
							return res.status(203).json({"error": "Database error."});
						}
						else {
							return res.sendStatus(200);
						}
					});
				}
			});
		}
	});
});

/**
 * Remove an existing venue.
 */
router.post("/venue/remove", function(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;
	let code = req.body.venueCode;
	console.log(code);

	sensitiveInformationAuth(email, password, (authenticated) => {
		if (!authenticated) {
			res.status(203).json({"error": "Wrong permissions."});
		}
		else {
			getUserFromEmailDB(email, (err, users) => {
				if (err) {
					console.log(err);
					return res.status(203).json({"error": "Database error."});
				}
				else if (users.length <= 0) {
					return res.status(203).json({"error": "No user was found with that code."});
				}
				else {
					getVenueFromCodeDB(code, (err, venues) => {
						if (err) {
							return res.status(203).json({"error": "Problem getting user's venues."});
						}
						else if (venues.length <= 0) {
							return res.status(203).json({"error": "No venue found with that code."});
						}
						else {
							removeVenueDB(code, (err, result) => {
								if (err) {
									console.log(err);
									return res.status(203).json({"error": "Database error."});
								}
								else {
									removeVenueInHotspotsDB(code, (err, result) => {
										res.sendStatus(200);
									});
								}
							});
						}
					});
				}
			});
		}
	});
});

/**
 * Add a venue as a hotspot.
 */
router.post("/hotspots/add", function(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;
	let code = req.body.venueCode;

	sensitiveInformationAuth(email, password, (authenticated) => {
		if (!authenticated) {
			res.status(203).json({"error": "Wrong permissions."});
		}
		else {
			getHotspotFromCodeDB(code, (err, hotspots) => {
				if (err) {
					return res.status(203).json({"error": "Problem getting user's venues."});
				}
				else if (venues.length > 0) {
					return res.status(203).json({"error": "That hotspot already exists."});
				}
				else {
					getVenueFromCodeDB(code, (err, venues) => {
						if (err) {
							return res.status(203).json({"error": "Problem getting user's venues."});
						}
						else if (venues.length <= 0) {
							return res.status(203).json({"error": "No venue was found with that code."});
						}
						else {
							addHotspotDB(code, new Date().toISOString().slice(0, 19).replace('T', ' '), (err, result) => {
								if (err) {
									console.log(err);
									return res.status(203).json({"error": "Database error."});
								}
								else {
									return res.sendStatus(200);
								}
							});
						}
					});
				}
			})
		}
	});
});

/**
 * Remove a venue as a hotspot.
 */
router.post("/hotspots/remove", function(req, res, next) {
	let email = req.body.email;
	let password = req.body.password;
	let code = req.body.venueCode;

	sensitiveInformationAuth(email, password, (authenticated) => {
		if (!authenticated) {
			res.status(203).json({"error": "Wrong permissions."});
		}
		else {
			getVenueFromCodeDB(code, (err, venues) => {
				if (err) {
					return res.status(203).json({"error": "Problem getting user's venues."});
				}
				else if (venues.length <= 0) {
					return res.status(203).json({"error": "No venue was found with that code."});
				}
				else {
					removeVenueInHotspotsDB(code, (err, result) => {
						if (err) {
							console.log(err);
							return res.status(203).json({"error": "Database error."});
						}
						else {
							return res.sendStatus(200);
						}
					});
				}
			});
		}
	});
});

/**
 * Delete a user profile.
 */
router.post("/user/remove", function(req, res, next) {
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
					return res.status(203).json({"error": "Database error."});
				}
				else if (users.length <= 0) {
					return res.status(203).json({"error": "No user was found with that code."});
				}
				else {
					removeUsersVenuesDB(users[0].id, (err, result) => {
						removeUserDB(email, (err, result) => {
							res.sendStatus(200);
						});
					});
				}
			});
		}
	});
});

/**
 * Utility function for checking if a user is logged in from their cookie.
*/
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

/**
 * Utility function for getting the id of a logged in user from their cookie.
*/
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

/**
 * Authenticates the password and account type for sensitive information.
 * Only official accounts pass this authentication with a correct password.
 */
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

/**
 * The database pool.
 */
const pool = mysql.createPool({
	connectionLimit: 10,
	host: "localhost",
	user: "root",
	password: "Cocoplop2",
	database: "covidw"
});

/**
 * Gets all users in the database.
 * 
 * @param {*} callback - (error, users)
 */
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

/**
 * Gets a user in the database from their email.
 * 
 * @param {*} email - The user's email
 * @param {*} callback - (error, users)
 */
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

/**
 * Gets a user in the database from their ID.
 * 
 * @param {*} id - The user's id
 * @param {*} callback - (error, users)
 */
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

/**
 * Gets all venues in the database.
 * 
 * @param {*} callback - (error, venues)
 */
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

/**
 * Gets a venue in the database from it's code.
 * 
 * @param {*} code - The venue's code
 * @param {*} callback - (error, venues)
 */
function getVenueFromCodeDB(code, callback) {
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

/**
 * Gets a hotspot in the database from the venue's code.
 * 
 * @param {*} code - The venue's code
 * @param {*} callback - (error, hotspots)
 */
 function getHotspotFromCodeDB(code, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("SELECT * FROM hotspots WHERE venue = '" + code + "'", (err, hotspots) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, hotspots);
		});
		con.release();
	});
}

/**
 * Updates a user in the database using their email.
 * 
 * @param {*} fName - First name
 * @param {*} lName - Last name
 * @param {*} email - Email
 * @param {*} password - Password
 * @param {*} accountType - Account type
 * @param {*} callback (error, result)
 */
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

/**
 * Updates a venue in the database using it's code.
 * 
 * @param {*} code - Code
 * @param {*} name - Name
 * @param {*} latitude - Latitude coordinate
 * @param {*} longitude - Longitude coordinate
 * @param {*} callback (error, result)
 */
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

/**
 * Updates the venues in the checkins database with a new name.
 * 
 * @param {*} code - Code
 * @param {*} name - Name
 * @param {*} callback  - (error, result)
 */
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

/**
 * Updates the venues in the hotspots database with a new name.
 * 
 * @param {*} oldName - Old name
 * @param {*} newName - New name
 * @param {*} callback - (error, result)
 */
function updateVenueInHotspotsDB(oldName, newName, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query("UPDATE hotspots SET venue = '" + newName + "' WHERE venue = '" + oldName + "'", (err, result) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, result);
		});
		con.release();
	});
}

/**
 * Gets the checkins made by the user.
 * 
 * @param {*} id - User's id
 * @param {*} callback - (error, checkins)
 */
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

/**
 * Gets the venues owned by the user.
 * 
 * @param {*} id - User id
 * @param {*} callback - (error, venues)
 */
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

/**
 * Gets the checkins that were made at the venue.
 * 
 * @param {*} code - Venue code
 * @param {*} callback - (error, checkins)
 */
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

/**
 * Gets all hotspots in the database.
 * 
 * @param {*} callback - (error, hotspots)
 */
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

/**
 * Adds a new check-in to the database.
 * 
 * @param {*} userID - User making the checkin
 * @param {*} venueName - Venue name
 * @param {*} venueCode - Venue code
 * @param {*} time - The time of the check-in
 * @param {*} callback - (error, result)
 */
function addCheckInDB(userID, venueName, venueCode, time, callback) {
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
                        callback(null, result);
                    }
                });
            }
        });
        con.release();
	});
}

/**
 * Adds a venue to the database.
 * 
 * @param {*} ownerID - Venue owner's id
 * @param {*} venueName - Name
 * @param {*} venueCode - Code
 * @param {*} latitude - Latitude coordinates
 * @param {*} longitude - Longitude coordinates
 * @param {*} callback - (error, result)
 */
function addVenueDB(ownerID, venueName, venueCode, latitude, longitude, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query('SELECT MAX(id) as maxID FROM venues', (err, maxQ) => {
            if (err) {
                callback(err, null);
            }
            else {
                con.query('INSERT INTO venues VALUES(' + (maxQ[0].maxID + 1) + ',' + ownerID + ',\'' + venueName + '\',\'' + venueCode + '\',\'' + latitude + '\',\'' + longitude + '\')', (err, result) => {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    }
                    else {
                        callback(null, result);
                    }
                });
            }
        });
        con.release();
	});
}

/**
 * Remove a venue from the database.
 * 
 * @param {*} code - Venue code
 * @param {*} callback - (error, result)
 */
function removeVenueDB(code, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query('DELETE FROM venues WHERE code = \'' + code + '\'', (err, result) => {
			if (err) {
				console.log(err);
				callback(err, null);
			}
			else {
				callback(null, result);
			}
		});
        con.release();
	});
}

/**
 * Remove a hotspot from the hotspots database given the venue.
 * 
 * @param {*} code - Venue code
 * @param {*} callback - (error, result)
 */
function removeVenueInHotspotsDB(code, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query('DELETE FROM hotspots WHERE venue = \'' + code + '\'', (err, result) => {
			if (err) {
				console.log(err);
				callback(err, null);
			}
			else {
				callback(null, result);
			}
		});
        con.release();
	});
}

/**
 * Add a hotspot to the database.
 * 
 * @param {*} code - Venue code
 * @param {*} time - Time of becoming a hotspot
 * @param {*} callback - (error, result)
 */
function addHotspotDB(code, time, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query('SELECT MAX(id) as maxID FROM hotspots', (err, maxQ) => {
            if (err) {
                callback(err, null);
            }
            else {
                con.query('INSERT INTO hotspots VALUES(' + (maxQ[0].maxID + 1) + ',\'' + code + '\',\'' + time + '\')', (err, result) => {
                    if (err) {
                        console.log(err);
                        callback(err, null);
                    }
                    else {
                        callback(null, result);
                    }
                });
            }
        });
        con.release();
	});
}

/**
 * Remove a user from the database.
 * 
 * @param {*} email - User's email
 * @param {*} callback - (user, result)
 */
function removeUserDB(email, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query('DELETE FROM users WHERE email = \'' + email + '\'', (err, result) => {
			if (err) {
				console.log(err);
				callback(err, null);
			}
			else {
				callback(null, result);
			}
		});
        con.release();
	});
}

/**
 * Remove venues that are owned by the user.
 * 
 * @param {*} userID - User's id
 * @param {*} callback - (error, result)
 */
function removeUsersVenuesDB(userID, callback) {
	pool.getConnection((err, con) => {
		if (err) {
			return callback(err, null);
		}
		con.query('DELETE FROM venues WHERE owner = ' + userID + '', (err, result) => {
			if (err) {
				console.log(err);
				callback(err, null);
			}
			else {
				callback(null, result);
			}
		});
        con.release();
	});
}

module.exports = router;
