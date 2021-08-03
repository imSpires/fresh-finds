
// function to utilize dropdown menu 
// (reference from materialize)
function dropDown() {
    var dropDownEl = document.querySelectorAll('.dropdown-trigger');
    var dropDownOptions = M.Dropdown.init(dropDownEl, {
                hover: false, // Activate on hover
                gutter: 0, // Spacing from edge
                stopPropagation: false // Stops event propagation
    });
};

document.addEventListener('DOMContentLoaded', dropDown);

//testing variable
//replace with song title/artist pulled from song in spotify
var artist = "Maroon 5";
var title = "Misery";


// Takes artist and song title to return lyrics for the song
function getLyrics(){
    fetch("https://api.vagalume.com.br/search.php"
        + "?art=" + artist
        + "&mus=" + title
        + "&apikey={896e5346faeb02410b155bee7c8b998f}"
    ).then(function(response){
        return response.json()
        }
    ).then(function(response) {
        console.log(response)
        console.log(response.mus[0].text)
        //return response.mus[0].text
    })
    //add lyrics to HTML
}
// Function is greyed out to avoid console.log clutter
// getLyrics();

// Spotify code starts here --------------------
// Variables
var clientID = '13e6f9bcfc184ddc8f5e03328ccbb045';
var clientSecret = 'fa24c366468a420c8c795b9ec4a3ef23';

//
function spotifyAPI() {
    var getToken = async () => {

        var result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa( clientID + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        var data = await result.json();
        console.log(data);
        return data.access_token;
    }

    // function takes token as par and returns genre categories
    var getGenres = async (token) => {

        var result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        var data = await result.json();
        return data.categories.items;
    }

    // function takes token and genreId as pars and returns a playlist
    var getPlaylistByGenre = async (token, genreId) => {

        var limit = 1;
        
        var result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        var data = await result.json();
        // Randomize and select one playlist?
        return data.playlists.items;
    }
    
    var getTracks = async (token, tracksEndPoint) => {

        var limit = 1;

        var result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        var data = await result.json();
        return data.items;
    }

    var getTrack = async (token, trackEndPoint) => {

        var result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        var data = await result.json();
        return data;
    }

    return {
        getToken() {
            return getToken();
        },
        getGenres(token) {
            return getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return getTrack(token, trackEndPoint);
        }
    }
};

spotifyAPI();
