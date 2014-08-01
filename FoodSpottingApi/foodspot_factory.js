var request = require('request');
var cheerio = require('cheerio');
// var url = require('url');
var util = require('util');

var link = "http://www.foodspotting.com/api/v1/sightings.json?api_key=88jrlU7j4HsTnnVNciqhfZbXd6vgPmVU9gbu46Mh&query=%s&sort=best&filter=all&latitude=%s&longitude=%s&per_page=20";
// var locationLink = "http://www.foodspotting.com/places/%s/";
// var itemLink = "http://www.foodspotting.com/places/%s/items/%s/"
// var parsedUrl = url.parse(link, true);

var foodspotting = function() {
};

// foodspotting.searchLocation = function(locationId, callback) {
// 	var locationUrl = util.format(locationLink, locationId);
// 	callback(locationUrl);
// };

// function.searchItem = function(locationId, itemId, callback) {
// 	var itemUrl = util.format(itemLink, locationId, itemId);
// 	callback(itemUrl);
// };

foodspotting.search = function(food, lat, long, callback) {
	buildQueryUrl(food, lat, long, function(link) {
		request(link, function(err, response, body) {
			if (!err) {
				callback(JSON.parse(body).data.sightings);
			}
		});
	});
};

function buildQueryUrl (food, lat, long, callback) {
  var parsedUrl = util.format(link, food, lat, long);
	callback(parsedUrl); 
};


// function extractFoodSpotJSON(string, callback) {
//   callback(string.substring(string.indexOf("(") + 1, string.length - 1));
// };

module.exports = foodspotting;
