
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

$(document).ready(function () {
    $('select').formSelect();
});

//selects saves
$('select').on('change', function () {
    genre = this;
    console.log(genre);
})




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
        console.log(response)
        console.log(response.mus[0].text)
        //return response.mus[0].text
        let lyricData = response.mus[0].text
        let lyrics = document.createTextNode(lyricData);
        let lyricsText = document.getElementById("lyricsText");
        lyricsText.appendChild(lyrics);
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
        console.log("running getToken")
        var result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientID + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        var data = await result.json();
        console.log(data)
        accessToken = data.access_token;
        // console.log(getGenres(accessToken))
        // console.log(getPlaylistByGenre(token, genreId))
        // var genre = data.categories
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


        // console.log(genreName)


        // genreId = data.categories.items[2].id
        // console.log(genreId)
        return;
    }


    // function takes token and genreId as pars and returns a playlist
    var getPlaylistByGenre = async () => {
        await getToken();
        console.log("running getplaylistbygenre")
        console.log(genreId)
        var limit = 1;

        var result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        var data = await result.json();
        console.log(data);
        playlistId = data.playlists.items[0].id;
        console.log(playlistId);
        // Randomize and select one playlist?
        return data.playlists.items;
    }

    //gets tracks from playlist ID and returns preview url
    //also returns song name
    var getTracks = async (tracksEndPoint) => {

        var limit = 1;

        var result = await fetch(`	https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        var data = await result.json();

        console.log(data);

        //saves song preview url to variable
        preview_url = data.items[0].track.preview_url;

        //saves song to title variable
        title = data.items[0].track.name;
        console.log(title);

        //saves artist to artist variable
        artist = data.items[0].track.artists[0].name;
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
