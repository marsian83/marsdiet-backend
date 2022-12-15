const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//GET REQUESTS

//POST REQUESTS
router.post("/new", (req, res) => {
  try {
    //code
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
