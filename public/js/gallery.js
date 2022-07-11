window.onload = function() {
    
var prevButton = document.getElementById('prev-button');
var nextButton = document.getElementById('next-button');
var lat = document.getElementById('lat').value;
var long = document.getElementById('long').value;
var page = document.getElementById('page').value;

prevButton.addEventListener("click", Prev);
nextButton.addEventListener("click", Next);

function Next() {
    console.log("Next");
    var nextPage = parseInt(page) + 1;
    window.location.href = `/wallpapers?lat=${lat}&long=${long}&page=${nextPage}`;
}

function Prev() {
    console.log("Prev");
    var prevPage = parseInt(page) - 1;
    if (prevPage <= 0) return
    window.location.href = `/wallpapers?lat=${lat}&long=${long}&page=${prevPage}`;
}

}