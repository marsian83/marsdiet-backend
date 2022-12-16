const express = require("express");
const router = express.Router();
const { auth } = require("../firebase");
const User = require("../models/User");

//GET REQUESTS
router.get("/info/:uid", async (req, res) => {
  try {
    //check if the given uid does not exist in database
    if (!(await User.exists({ uid: req.params.uid }))) {
      //return a response and stop any further execution if given uid is invalid
      return res.status(404).send({
        message: "Something went wrong",
        error: "The uid is not registered on the database",
      });
    }

    //get User's info from mongoDB database
    const userInfo = (await User.findOne({ uid: req.params.uid })).toJSON();

    //send the response
    res.status(200).send({
      complete: !Object.values(userInfo).includes(null), //check if info is complete or not by checking if any value in userInfo is null
      ...userInfo,
    });
  } catch (err) {
    //in case of any error
    res.status(500).send({
      message: "Something went wrong",
      error: err.message,
    });
    console.log(err);
  }
});

router.get("/auth/info/:uid", async (req, res) => {
  try {
    //get User's info from firebase
    const userInfo = await auth.getUser(req.params.uid);

    //send the response
    res.status(200).send(userInfo);
  } catch (err) {
    //in case of any error
    res.status(500).send({
      message: "Something went wrong",
      error: err.message,
    });
    console.log(err);
  }
});

//POST REQUESTS
router.post("/new/:uid", async (req, res) => {
  try {
    //check if the given uid is already registered
    if (await User.exists({ uid: req.params.uid })) {
      //return a response and stop any further execution if given uid is invalid
      return res.status(400).send({
        message: "Something went wrong",
        error: "The uid is already registered on the database",
      });
    }

    //Create an empty object to hold new user's data
    newUser = { uid: req.params.uid };

    //get User's info from firebase to pre-fill as much as possible
    const userInfo = await (await auth.getUser(req.params.uid)).toJSON();

    //check what info is available in userInfo and assign to newUser object
    userInfo.displayName && (newUser.name = userInfo.displayName);
    userInfo.photoURL && (newUser.photoUrl = userInfo.photoURL);

    //create new user in mongoDB database
    const user = await User.create(newUser);

    //send response with new user as result
    res.status(200).send({
      message: "Success",
      result: user,
    });
  } catch (err) {
    //in case of any error
    res.status(500).send({
      message: "Something went wrong",
      error: err.message,
    });
    console.log(err);
  }
});

module.exports = router;
