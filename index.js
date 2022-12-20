require("dotenv").config();

const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

//Import mongoose and set strictQuery to true (depracated warning)
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

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

app.use((req, res, next) => {
  next();
});

const {auth} = require('./firebase')

// Define a middleware function to verify the Firebase ID token
function verifyFirebaseIdToken(req, res, next) {
  // Extract the token from the `Authorization` header
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).send('Unauthorized: No `Authorization` header found');
    return;
  }
  const token = header.split('Bearer ')[1];
  if (!token) {
    res.status(401).send('Unauthorized: No token found in `Authorization` header');
    return;
  }

  // Verify the token using the Firebase Admin SDK
  auth.verifyIdToken(token)
    .then(decodedToken => {
      req.user = decodedToken;
      next();
    })
    .catch(error => {
      console.error(error);
      res.status(401).send('Unauthorized: Invalid token');
    });
}

// Use the middleware function in your routes
app.get('/protected', verifyFirebaseIdToken, (req, res) => {
  // The request is authenticated at this point, so you can access the user's ID using req.user.uid
  res.send('Hello, authenticated user with ID: ' + req.user.uid);
});


//Connect to MongoDB and Start the server
mongoose.connect(
  process.env.MONGODB_CONNECTION_URI,
  () => {
    console.log("Connected to mongoDB database");

    //Start the server after mongoose client is connected for serverless
    app.listen(PORT, () => {
      console.log(`Server up and listening on port ${PORT}`);
    });
  },
  (err) => {
    "Could not connect to mongoDB database";
    console.log(err);
  }
);
