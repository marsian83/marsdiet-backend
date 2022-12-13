require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
app = express();

//Constants
PORT = process.env.PORT || 8000;
NUTRITION_API = "trackapi.nutritionix.com/v2";

//Middleware
app.use(express.json());
// app.use(express.urlencoded());

//Dynamically import and use all routes
const routesPath = path.join(__dirname, "routes");
const dirents = fs.readdirSync(routesPath, { withFileTypes: true });
const filesNames = dirents
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name);

filesNames.forEach((filename) => {
  var route = path.join(routesPath, filename);
  var router = require(route);
  app.use(`/${path.parse(route).name}`, router);
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server up and listening on port ${PORT}`);
});
