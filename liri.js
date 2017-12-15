var command = process.argv[2];
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require("request");
var fs = require("fs");


switch (command) {
	case "my-tweets":
	lastTwentyTweets();
	break;

	case "spotify-this-song":
	songSearch();
	break;

	case "movie-this":
	movieSearch();
	break;

	case "do-what-it-says":
	textSearch();
	break;
}

function lastTwentyTweets () {

	var params = {screen_name: 'Liribot0203', count: 20};
	var client = new Twitter(keys);

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			
			for (var i = 0; i < tweets.length; i++) {
				console.log('On ' + tweets[i].created_at + ', you stupidly tweeted "' + tweets[i].text + '."')

			}

		}else {
			console.log(error)
		}
	});



}

function songSearch(yourSearch) {
	var spotify = new Spotify({
		id: "226e962a26524456bbb6c528a3ba3409",
		secret: "4478869348c249a6a6bb8c6b8adb10ec"
	});

	var yourSearch = process.argv[3];

	spotify.search({type: 'track', query: yourSearch}, function(err, data) {

		if (err) {
			return console.log('Error occurred: ' + err);
		}else{
			var song = data.tracks.items;

			for(var i = 0; i < song.length; i++){
				var results  = 
				"Artists: " + song[i].artists[0].name + 
				"\nSong: " + song[i].name +
				"\nAlbum: " + song[i].album.name + 
				"\nURL: " + song[i].href;
			}

			console.log(results);
		}

	});
}

function movieSearch() {

	var movieName = process.argv[3];

	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";


	request(queryUrl, function(error, response, body) {


		if (!error && response.statusCode === 200) {

			body = JSON.parse(body);

			console.log("Title: " + body.Title);
			console.log("Year: " + body.Year);
			console.log("IMDB Rating: " + body.Ratings[0].Value);
			console.log("Tomatoes Rating: " + body.Ratings[1].Value)
			console.log("Country Produced: " + body.Country);
			console.log("Language: " + body.Language);
			console.log("Plot: " + body.Plot);
			console.log("Actors: " + body.Actors);


		}
	});

}

function textSearch(){
	fs.readFile("random.txt", "utf8", function(error, data) {

		if (error) {
			return console.log(error);
		}else{

			var dataArr = data.split(",");

			songSearch(dataArr[1]);
		}
	});
}

