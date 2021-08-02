
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
getLyrics();
