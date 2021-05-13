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

module.exports = router;
