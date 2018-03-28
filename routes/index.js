const express = require('express');
const router = express.Router();
const validator = require('validator');
const phantom = require('phantom');
var reviewController = require('../controllers/reviewController');
const { URL, URLSearchParams } = require('url');
var instance, page;

router.get('/', function(req, res, next) {
	res.send('REST API for extracting Tiger Direct product reviews');
});

router.post('/', reviewController.scrape);

module.exports = router;