const express = require("express");
const path = require("path");
const axios = require("axios");
const qs = require("querystring");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// root call will redirect to wallapers page of location access is allowed
app.get("/", (request, response) => {
    response.render("index", {
        title: "Home"
    });
});


app.get("/wallpapers", (req, res) => {
    var lat = req.query.lat;
    var long = req.query.long;
    var page = req.query.page;

    // method will make api calls to weather and unsplash to get data
    DisplayPicturesByLocation(res, lat, long, page);
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})

function DisplayPicturesByLocation(res,lat, long, page) {
    // first we call the weather api by passing coordiates as parameters to get weather details
    axios(
        {
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric`,
            method: "get",
            headers: {}
        }
    ).then(function (response) {

        // call unsplash api by passing weather condition as query string
        var params = {
            page: page,
            query: response.data.weather[0].main,
            orientation: "landscape"
          };
          let formattedParams = qs.stringify(params);
          console.log(page);
        axios(
            {
              url: `https://api.unsplash.com/search/photos?${formattedParams}`,
              method: "get",
              headers: {
                "Authorization": `Client-ID ${process.env.UNSPLASH_CLIENT_ID}`
              }
            }
            ).then(function (photoresponse) {
                res.render("wallpapers", {
                    title: "Wallpapers",
                    weatherData: response.data,
                    photoResults: photoresponse.data.results,
                    page: page
                });
            }).catch(function (error) {
              console.log(error);
          });

    }).catch(function (error) {
        console.log(error);
    });
}
