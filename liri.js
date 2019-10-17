// code to read and set any environment variables with the dotenv package
require("dotenv").config();
// code required to import the key.js file and store it in a variable
var keys = require("./keys.js");
// access keys information
// var spotify = new spotify(keys.spotify);

var Spotify = require('node-spotify-api');
var Axios = require("axios");
var Moment = require("moment");
// var Dotenv = require("dotenv");
// var requests = require('requests');

var operation = process.argv[2];
var value = process.argv.slice(3);


switch (operation){
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
}
// ===========================================================================
// if the "concert-this" function is called...

function concertThis() {
  // set value to artist for search
  var bitSearch = value;
  // bit search variable
  var bitURL = "https://rest.bandsintown.com/artists/" + bitSearch + "/events?app_id=codingbootcamp";
  // performing an AJAX request with the bitURL
  Axios.get(bitURL)
    // after data comes back from the request
    .then(function(response){
      // console.log(bitURL);
      
      // console.log(response.data);
      // storing the data from the AJAX request in the results variable
      var results = response.data;

      // looping through each result item
      for (var i = 0; i < results.length; i++) {
        console.log("==============================================");
        console.log("");
        console.log("Venue:  " + results[i].venue.name);
        console.log("Location:  " + results[i].venue.city);
        console.log("Date:   " + Moment(response.datetime).format('MM/DD/YYYY'));
        console.log("");
        console.log("==============================================");
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

// ===========================================================================
// if the "spotify-this-song" function is called...

function spotifyThisSong() {
  // set the value to song for search
  var spotifyThis = value;
  // pick up spotify key info from .env via keys.js
  var spotify = new Spotify(keys.spotify);
 
  spotify.search({ type: 'track', query: spotifyThis }, function(err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
    // console.log(data);
    for (var i = 0; i<10; i++) {
      console.log("==============================================");
      console.log("");
      console.log("Artist(s):  " + data.tracks.items[i].album.artists[0].name);
      console.log("Song:  " + data.tracks.items[i].name);
      console.log("URL:  " + data.tracks.items[i].album.external_urls.spotify);
      console.log("Album:  " + data.tracks.items[i].album.name);
      console.log("");
      console.log("----------------------------------------------");
    }
  })
};

// ===========================================================================
// if the "movie-this" function is called...

function movieThis() {
  // set value to movie for search and format with "+" for spaces
  var movieName = value.join("+");
  
  console.log("Searching for " + movieName);
 
  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=264929f7";

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  Axios.get(queryUrl).then(
    function(response) {
      
      console.log("==============================================");
      console.log("");
      // console.log(response.data);      
      console.log("Title:  " + response.data.Title);
      console.log("Release Year:  " + response.data.Year);
      console.log("IMDB Rating:  " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating:  " + response.data.Ratings);
      console.log("Country:  " + response.data.Country);
      console.log("Language:  " + response.data.Language);
      console.log("\nPlot:  " + response.data.Plot);
      console.log("\nActors:  " + response.data.Actors);
      console.log("");
      console.log("----------------------------------------------");
    }
  )
  .catch(function(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an object that comes back with details pertaining to the error that occurred.
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });

}


// ===========================================================================
// if the "do-what-it-says" function is called...

function doWhatItSays() {
  // Includes the FS package for reading and writing packages
  var fs = require("fs");
  
  // Running the readFile module that's inside of fs.
  // Stores the read information into the variable "data"
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
  
    // Break the string down by comma separation and store the contents into the output array.
    var output = data.split(",");
  
    // Loop Through the newly created output array
    for (var i = 0; i < output.length; i++) {
  
      // Print each element (item) of the array/
      console.log(output[i]);
      console.log('"'+output[0]+'"');
      // var doThis = output[0];
 
      if ('"'+output[0]+'"' === "concert-this") {
        concertThis();
      }else if ('"'+output[0]+'"' === "spotify-this-song") {
        spotifyThisSong();
      }else {
        movieThis()
      }
    }
  });

}






