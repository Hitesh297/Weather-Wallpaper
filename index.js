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


app.get("/", (request, response) => {
    response.render("index", {
        title: "Home"
    });
});

app.get("/wallpapers", (req, res) => {
    var lat = req.query.lat;
    var long = req.query.long;
    var page = req.query.page;
    console.log(lat, long);
    GetWeatherInfoByCoordinates(res, lat, long, page);
    // console.log(weatherData);
    // response.render("wallpapers", { title: "Wallpapers" });
});

// app.get("/buyproduct", (request, response) => {
//     response.render("buyproduct", { title: "Buy Product" });
// });

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
})

function GetWeatherInfoByCoordinates(res,lat, long, page) {
    axios(
        //config options
        {
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${process.env.OPEN_WEATHER_KEY}&units=metric`,
            method: "get",
            headers: {}
        }
    ).then(function (response) {
        response.data.sys.sunset = GetDate(response.data.sys.sunset);
        response.data.sys.sunrise = GetDate(response.data.sys.sunrise);
        var params = {
            page: page,
            query: response.data.weather[0].main,
            orientation: "landscape"
          };
          let formattedParams = qs.stringify(params);
          console.log(page);
        axios(
            //config options
            {
              url: `https://api.unsplash.com/search/photos?${formattedParams}`,
              method: "get",
              headers: {
                "Authorization": `Client-ID ${process.env.UNSPLASH_CLIENT_ID}`
              }
            }
            ).then(function (photoresponse) {
                // console.log(photoresponse.data.results);
                res.render("wallpapers", {
                    title: "Wallpapers",
                    weatherData: response.data,
                    photoResults: photoresponse.data.results,
                    page: page
                });
            }).catch(function (error) {
              //Put what to do on error here.
              console.log(error);
          });

    }).catch(function (error) {
        console.log(error);
    });
}

function GetDate(unixutcseconds) {
    var date = new Date(unixutcseconds * 1000);
    return (date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
}