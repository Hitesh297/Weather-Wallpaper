window.onload = () => {
    var x = document.getElementById("demo");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    function showPosition(position) {
        var x = document.getElementById("demo");
        x.innerHTML = "Latitude: " + position.coords.latitude +
            "<br>Longitude: " + position.coords.longitude;
        window.location.href = `/wallpapers?lat=${position.coords.latitude}&long=${position.coords.longitude}`;
    }
}

