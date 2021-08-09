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

    if (songCheck) {
        song = data.mus[0]
        return song
    } else {
        error = true;
        return error;
    } 
}

//use to print lyrics to html
function printLyrics(song){

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

    //variable for selected genre
    var genreId = $(".selected")[0].innerText.toLowerCase();

    //token used for api requests
    var accessToken = ""

    //playlist id for api
    var playlistId = ""
    var trackId = ""
    var preview_url = ""

    //gets spotify api token
    var getToken = async () => {
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
        var result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        var data = await result.json();

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
        var limit = 10;

        var result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });

        //list of playlists
        var data = await result.json();

        //saves playlist length
        //this prevents error if there are less playlists than Limit
        var playlistLength = data.playlists.items.length;
        
        //selects playlist from list
        playlistId = data.playlists.items[getRandom(playlistLength)].id;

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

        //saves track list length
        //prevents error when track list is less than limit
        var trackListLength = data.items.length;

        var selectedTrack = data.items[getRandom(trackListLength)].track

        //saves song preview url to variable
        preview_url = selectedTrack.preview_url;

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

        if(!preview_url){
            // error = true;
        }

        //runs spotifyAPI again if there was an error
        //prints song if no error
        if(error || !preview_url){
            spotifyAPI();
        } else {
            printSong();
            printLyrics(song);
        };
    }

    //takes song found by spotifyAPI and adds to html
    function printSong(){
        $('#cover-spin').hide(0);
        getLyrics();
        $('#current-song-title').text(title);
        $('#current-artist').text(artist);
        $('#music-player-div').html('<iframe class="" id = "music-player" frameborder="0" allowtransparency="true" autoplay allow="encrypted-media" src = ' + preview_url + '></iframe>');
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
    // Add current song / artist to previous section
    if (artist) {
        $('#previous-song-title').text(title);
        $('#previous-artist').text(artist);
    } else {
    }

    genreId = $('.selected')[0].innerText;
    if (genreId !== 'Select...') {
        $('#cover-spin').show(0);
    } else {
        window.alert('Try again')
        // var modal = document.querySelector(button.dataset.modalTarget);
        // openModal(modal);
    }
    spotifyAPI();

});


//initiate favorites modal
$(document).ready(function(){
    $('.modal').modal();
  });

var favoriteSongs = [];

//loads previous favorites
function loadPreviousFavorites(){
        //gets favorites from local storage
        var str = localStorage.getItem('favorites')
        favoriteSongs = JSON.parse(str);

        if (favoriteSongs){
            printFavorites();
        }
}

loadPreviousFavorites();

//saves to favorites
function saveFavorite(songArtist, songTitle){

    if(!favoriteSongs){
        favoriteSongs = [];
    }

    //song info object
    let songInfo = {};
    songInfo.songArtist = songArtist;
    songInfo.songTitle = songTitle;

    //pushes song object to favorites array
    favoriteSongs.push(songInfo);

    //saves favoriteSongs to localstorage
    var jsonArray = JSON.stringify(favoriteSongs);
    localStorage.setItem('favorites',jsonArray);

    //prints to html once saved
    printFavorites();

}

//writes favorites to modal
function printFavorites(){
    let favoritesListEl = $(".favorites-list");
    favoritesListEl[0].innerHTML = "";
    
    //loop to add each favorite to favorites list html
    for (var i = 0; i < favoriteSongs.length; i++){

        //variables to pass into HTML
        songArtistEl = favoriteSongs[i].songArtist;
        songTitleEl = favoriteSongs[i].songTitle;

        //innerHTML to be added
        let favoritesHTML =`<li class="favorites-item" id = "favorites-item${i}"><div class="container previous-song-container"><div class="previous-song-info"><div class="song-title" id= "previous-song-title">${songTitleEl}</div><div class="artist" id= "previous-artist">${songArtistEl}</div></div></li>`

        //adds each song to list
        favoritesListEl.append(favoritesHTML);
    }
};
//checks if song exists in favorites already
//runs saveFavorite() if it does not exist in favorites
function checkFavorite(songTitle, songArtist){

    //checks that songtitle and artist exist
    if(songArtist && songTitle){
        if (!favoriteSongs){
            saveFavorite(songArtist, songTitle);
        } else {
            var songInArray = false;

            //changes song in array to true 
            //if song is already in the favorites list
            for (var i = 0; i < favoriteSongs.length; i++){
                if (favoriteSongs[i].songArtist === songArtist && favoriteSongs[i].songTitle === songTitle){
                    songInArray = true;
                };
            };

            //will run saveFavorite if songInArray is false
            if (!songInArray){
                saveFavorite(songArtist, songTitle);
            }
        };
    };
}

//starts saving progress when save button is clicked
$("#save-prev-song-btn").click(function(){
    var songTitle = $("#previous-song-title")[0].innerText;
    var songArtist = $("#previous-artist")[0].innerText
    checkFavorite(songTitle, songArtist);
})

//starts saving progress when save button is clicked
$("#save-current-song-btn").click(function(){
    var songTitle = $("#current-song-title")[0].innerText;
    var songArtist = $("#current-artist")[0].innerText
    checkFavorite(songTitle, songArtist);
})