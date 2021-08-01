var artist = "Maroon 5";
var title = "Misery";

console.log("hello there");

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
    })
}
getLyrics();