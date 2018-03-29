const validator = require('validator');
const phantom = require('phantom');
const { URL, URLSearchParams } = require('url');
var instance, page;

exports.scrape = async function (req, res, next) {
	if(req.body.url) {
		var adr = req.body.url;
		var patt = /^http:\/\/(www\.)?tigerdirect\.com\/applications\/SearchTools\/item-details\.asp\?.*EdpNo=[0-9]+/i;
		if(patt.test(adr)) {
			var myURL = new URL(adr);
			
			// Initialize phantom and page instances
			instance = await phantom.create();
			page = await instance.createPage();

			// URL change listener
			await page.on('onUrlChanged', function (targetUrl) {
				console.log('New URL: ' + targetUrl);
			});

			try {

				//Check if reviews exist
				const status = await page.open(adr);
				var result = await page.evaluate(function () {
				  return document.querySelector('#reviewtab > a > span').textContent.trim();
				});

				if(result) {

					// Adding records per page query parameter
					var numReviews = req.query.limit || result.slice(10, result.length - 1);
					if(myURL.searchParams.get('recordsPerPage') != 'null') {
						myURL.searchParams.append('recordsPerPage', numReviews);
					}

					// Reload page with all reviews
					const status = await page.open(myURL.toString());
					
					// Inject Jquery for DOM Manipulation
					page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js")
					.then(async function() {
						var results = {};
						var reviews = await scrapePage();
						results.size = reviews.length;
						results.reviews = reviews;
						res.status(200).json(results);
						await instance.exit();
					});
				}
				else {
					console.log('No reviews');
					res.status(200).json({message: 'No reviews found'});
					await instance.exit();
				}
			} catch(err) {
				next(err);
				await instance.exit();
			}
		} else
			res.status(400).json({message: 'Not a valid Tigerdirect product link provided'})

	} else {
		res.status(400).json({message: 'No link provided'});
	}
};

function scrapePage() {
  return page.evaluate(function() {
	var results = [];

	$(".review").each(function () {
		// Parsing each review
		 var review = {};
		 
		 // Review title and text
		 review.title = $(this).children(".rightCol").find("h6").text();
		 review.comment = $(this).children(".rightCol").find("p").text();

		 //Reviewer Name
		 review.reviewer_name = $(this).find(".reviewer dd:first").text();

		 // Review rating
		 review.rating = parseFloat($(this).find("div.itemRating").text());
		 
		 //Review date
		 review.date = $(this).find(".reviewer dd:last").text();

		 results.push(review);
	  });
	  return results;
  });
}