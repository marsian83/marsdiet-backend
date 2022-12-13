const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

//Dynamically import and use all routes
const routesPath = path.join(__dirname, "api");
const dirents = fs.readdirSync(routesPath, { withFileTypes: true });
const filesNames = dirents
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name);

filesNames.forEach((filename) => {
  var route = path.join(routesPath, filename);
  var endpointrouter = require(route);
  router.use(`/${path.parse(route).name}`, endpointrouter);
});

//export the router
module.exports = router