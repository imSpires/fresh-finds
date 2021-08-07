
// // function to utilize dropdown menu 
// // (reference from materialize)
// function dropDown() {
//     var dropDownEl = document.querySelectorAll('.dropdown-trigger');
//     var dropDownOptions = M.Dropdown.init(dropDownEl, {
//         hover: false, // Activate on hover
//         gutter: 0, // Spacing from edge
//         stopPropagation: false // Stops event propagation
//     });
// };

// document.addEventListener('DOMContentLoaded', dropDown);

//testing variable
//replace with song title/artist pulled from song in spotify
var artist = "";
var title = "";
var genre = '';

//drop down script
$(document).ready(function () {
    $('select').formSelect();
});

//utility randomizer
function getRandom(length){
    var randomNumber = Math.floor(Math.random() * length)
    return randomNumber;
}

// Takes artist and song title to return lyrics for the song
function getLyrics() {
    fetch("https://api.vagalume.com.br/search.php"
        + "?art=" + artist
        + "&mus=" + title
        + "&apikey={896e5346faeb02410b155bee7c8b998f}"
    ).then(function (response) {
        return response.json()
    }
    ).then(function (response) {

        let song = response.mus
        if (song) {
            let lyricData = song[0].text
            let lyrics = document.createTextNode(lyricData);
            let lyricsText = document.getElementById("lyricsText");
            lyricsText.appendChild(lyrics);
        } else {
            spotifyAPI();
        } 

    })

}
// Function is greyed out to avoid console.log clutter
// getLyrics();

// Spotify code starts here --------------------
// Variables
var clientID = '13e6f9bcfc184ddc8f5e03328ccbb045';
var clientSecret = 'fa24c366468a420c8c795b9ec4a3ef23';

//
function spotifyAPI(token) {
    console.log("Hello there")

    var genreId = $(".selected")[0].innerText
    var accessToken = ""
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
        console.log(data)
        console.log(data.categories.items)

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
        console.log(genreId)
        var limit = 10;

        var result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        //list of playlists
        var data = await result.json();
        console.log(data);
        
        //selects playlist from list
        playlistId = data.playlists.items[getRandom(limit)].id;
        console.log(playlistId);

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

        console.log(data);

        var selectedTrack = data.items[getRandom(limit)].track

        //saves song preview url to variable
        preview_url = selectedTrack.preview_url;

        //saves song to title variable
        title = selectedTrack.name;
        console.log(title);

        //saves artist to artist variable
        artist = selectedTrack.artists[0].name;
        console.log(artist);
        console.log(preview_url);
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


    var runAll = async () => {
        await getGenres(accessToken);
        await getPlaylistByGenre(accessToken, genreId);
        await getTracks(accessToken)
        $('#current-song-title').text(title)
        $('#current-artist').text(artist)
        $('#music-player-div').html('<iframe class="" id = "music-player" height = 80 width = 400 src = ' + preview_url + '></iframe>')
        getLyrics();
    }

    runAll();
};

$('#songSubmit').click(function () {
    lyricsText.innerHTML = "";
    console.log('click')
    genreId = $('.selected')[0].innerText
    console.log(genreId)
    spotifyAPI();

});

//spotifyAPI();
