//testing variable
//replace with song title/artist pulled from song in spotify
var artist = "";
var title = "";
var genre = '';
var error = false;

//drop down script
$(document).ready(function () {
    $('select').formSelect();
});

//utility randomizer
function getRandom(length){
    var randomNumber = Math.floor(Math.random() * length)
    return randomNumber;
}

//grabs lyrics and returns error if no lyrics found
var getLyrics = async() =>{
    //resets error to false
    error = false
    var result = await fetch("https://api.vagalume.com.br/search.php"
    + "?art=" + artist
    + "&mus=" + title
    + "&apikey={896e5346faeb02410b155bee7c8b998f}");

    var data = await result.json();

    var songCheck = data.mus
    console.log(songCheck)

    if (songCheck) {
        song = data.mus[0]
        // console.log(song)
        return song
    } else {
        error = true;
        console.log("getLyrics error: " + error)
        return error;
    } 
}

//use to print lyrics to html
function printLyrics(song){

    // console.log(song);

    //gets info for lyrics
    let lyricData = song.text;
    let lyrics = document.createTextNode(lyricData);
    let lyricsText = document.getElementById("lyricsText");

    //clears previous lyrics
    lyricsText.innerHTML = "";

    //prints new lyrics
    lyricsText.appendChild(lyrics);
}

// Spotify code starts here --------------------
// Variables
var clientID = '13e6f9bcfc184ddc8f5e03328ccbb045';
var clientSecret = 'fa24c366468a420c8c795b9ec4a3ef23';

//
function spotifyAPI(token) {
    console.log("runing spotifyAPI")

    //variable for selected genre
    var genreId = $(".selected")[0].innerText

    //token used for api requests
    var accessToken = ""

    //playlist id for api
    var playlistId = ""
    var trackId = ""
    var preview_url = ""

    //gets spotify api token
    var getToken = async () => {
        // console.log("running getToken")
        var result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        var data = await result.json();
        accessToken = data.access_token;
        return accessToken;
    }

    // function takes token as par and returns genre categories
    var getGenres = async () => {
        await getToken();
        console.log("runningGetGenre")
        var result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        var data = await result.json();
        // console.log(data)
        // console.log(data.categories.items)

        //finds if genre matches one selected and saves id
        for (var i = 0; i < data.categories.items.length; i++) {
            var genreName = data.categories.items[i].name

            //compares dropdown selection with genre name to find the id
            if (genre == genreName) {
                genreId = data.categories.items[i].id
            };
        }
    return;
    }

    // function takes token and genreId as pars and returns a playlist
    var getPlaylistByGenre = async () => {
        await getToken();
        console.log("running getplaylistbygenre")
        // console.log(genreId)
        var limit = 10;

        var result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        //list of playlists
        var data = await result.json();
        // console.log(data);

        //saves playlist length
        //this prevents error if there are less playlists than Limit
        var playlistLength = data.playlists.items.length;
        // console.log(playlistLength);
        
        //selects playlist from list
        playlistId = data.playlists.items[getRandom(playlistLength)].id;
        // console.log(playlistId);

        return data.playlists.items;
    }

    //gets tracks from playlist ID and returns preview url
    //also returns song name
    var getTracks = async (tracksEndPoint) => {

        var limit = 15;

        var result = await fetch(`	https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });


        var data = await result.json();

        // console.log(data);

        //saves track list length
        //prevents error when track list is less than limit
        var trackListLength = data.items.length;

        var selectedTrack = data.items[getRandom(trackListLength)].track

        //saves song preview url to variable
        preview_url = selectedTrack.preview_url;
        console.log(preview_url);

        //saves song to title variable
        title = selectedTrack.name;

        //saves artist to artist variable
        artist = selectedTrack.artists[0].name;
        return preview_url;
    }

    //not needed for MVP
    var getTrack = async (accessToken, trackEndPoint) => {

        var result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        var data = await result.json();
        return data;
    }

    //checks for errors
    async function errorCheck(){
        await getLyrics();
        console.log("Lyrics error: " + error);

        if(!preview_url){
            console.log('no preview url available')
            // error = true;
        }

        //runs spotifyAPI again if there was an error
        //prints song if no error
        if(error || !preview_url){
            console.log('submit again')
            spotifyAPI();
        } else {
            console.log("printing")
            printSong();
            printLyrics(song);
        };
    }

    //takes song found by spotifyAPI and adds to html
    function printSong(){
        getLyrics();
        $('#current-song-title').text(title);
        $('#current-artist').text(artist);
        $('#music-player-div').html('<iframe class="" id = "music-player" frameborder="0" allowtransparency="true" allow="encrypted-media" src = ' + preview_url + '></iframe>');
    };

    //runs functions to get title, artist, preview_url
    var getSong = async () => {
        await getGenres(accessToken);
        await getPlaylistByGenre(accessToken, genreId);
        await getTracks(accessToken)
        // $('#current-song-title').text(title)
        // $('#current-artist').text(artist)
        // $('#music-player-div').html('<iframe class="" id = "music-player" height = 80 width = 400 src = ' + preview_url + '></iframe>')
        // getLyrics();
        errorCheck();
    }

    getSong();
};

$('#songSubmit').click(function () {

    // console.log('click')


    genreId = $('.selected')[0].innerText
    console.log(genreId)
    spotifyAPI();

});

//spotifyAPI();
