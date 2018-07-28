//declare require variables 

require("dotenv").config();

var keys = require("./keys.js");
var fs = require("fs");
var request = require ("request");

var Twitter = require ("twitter");
var Spotify = require ("node-spotify-api")

// node variables
var action = process.argv[2];
var input = process.argv[3];

//API variables
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// var searchInput = "";

////////////// Switch Case //////////////

var switchFunction = function (action, data){
    switch(action) {
        case "my-tweets":
        searchTwitter();
        break;

        case "spotify-this-song":
        searchSpotify(data);
        break;

        case "movie-this":
        searchMovie(data);
        break;

        case "do-what-it-says":
        testTuring();
        break; 

        default:
        console.log("Make a selection.")
    }
}



////////////// Log //////////////

var appendLog = function(data){
    fs.appendFile('log.txt', data, function(err) {
        if (err){
        console.log (err)
    }
    } ) ;
};



////////////// Twitter functionality //////////////

var searchTwitter = function (){

    var twitterLimit = {
        q: "#nojusticenopeace",
        count: 20
    }
    client.get("statuses/user_timeline", twitterLimit, function(err, tweetCount, response){
        if(!err && response.statusCode === 200){
            for(var i =0; i<tweetCount.length[i];i++){
                console.log (tweetCount[i].created_at);
                console.log("");
                console.log(tweets[i].text);
            }
        }
    })
}


////////////// Spotify Functionality //////////////

function searchSpotify (songSearch){
if (songSearch === undefined){
    
    songSearch = "Tubthumbing";
spotify.search(
    {type: "track", 
    query: songSearch
}, 
    function (err, data){
    if (err) {
         console.log (`${err}`);
         return;
    }

    var artist = JSON.stringify(data.artists[0].name);
    var song = JSON.stringify(data.name);
    var url = JSON.stringify(data.preview_url);
    var album = JSON.stringify(data.album.name);
    var logSpotify = `Artist(s): ${artist} \n Song: ${song} \n ${url} \n ${album}`

    console.log(logSpotify)
    appendLog(logSpotify)

})
}
else {
    spotify.search({type:"track", query: "Tubthumping"},function (err, data){
      if (err) {
          return console.log (`${err}`)
      }  

      var artist = JSON.stringify(data.artists[0].name);
      var song = JSON.stringify(data.name);
      var url = JSON.stringify(data.preview_url);
      var album = JSON.stringify(data.album.name);
      var logSpotify = `Artist(s): ${artist} \n Song: ${song} \n ${url} \n ${album}`
  
      console.log(logSpotify)
      appendLog(logSpotify)
    });


}

////////////// Movie //////////////


var searchMovie = function(input) {
    if (input === undefined){
        input = "Fight Club";
        console.log(`The first rule is: Nobody talks about it`)
    }

    var queryURL = "https://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    request (queryURL, function(error, response, body){
        if (!error && response.statusCode === 200){
       
            var movieData = JSON.parse(body);
            var title = movieData.Title;
            var year = movieData.Year;
            var imdb = movieData.Ratings[0].Value;
            var rotten = movieData.Ratings[1].Value;
            var country = movieData.Country;
            var language = movieData.language;
            var plot = movieData.Plot;
            var actors = movieData.Actors;

            var logMovie = (`Movie: ${title} \n Year: ${year} \n IMDb Rating: ${imdb} \n Rotten Tomatoes: ${rotten} \n Country: ${country} \n Language: ${language} \n Plot: ${plot} \n Actors: ${actors}`)

            console.log(logMovie)
            appendFile(logMovie)
        }
    });

};

////////////// Just Do It //////////////

function testTuring(){
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err) throw err;
        var random = data.split(",");
        action = random[0];
        input = random[1];
        playSong(turingSong);
        switchFunction();
    })
}
}

////////////// user input //////////////
var liri = function (service, userInput){
    switchFunction (service, userInput)
};

////////////// call node function //////////////
liri(action, input);

