const express = require("express");
const router = express.Router();
const axios = require("axios");

//GET REQUESTS
router.get("/search", async (req, res) => {
  try {
    //make call to calorieninjas api
    const results = await axios.get(
      "https://api.calorieninjas.com/v1/nutrition",
      {
        params: {
          query: req.body.query,
        },
        headers: {
          "X-Api-Key": process.env.CALORIENINJAS_API_KEY,
        },
      }
    );

    //send the response
    return res.status(200).send(results.data);
  } catch (err) {
    //in case of any error
    res.status(500).send({
      message: "Something went wrong",
      error: err.message,
    });
    console.log(err);
  }
});

router.get("/search/calories", async (req, res) => {
  try {
    //make call to the calorieninjas api
    const results = (
      await axios.get("https://api.calorieninjas.com/v1/nutrition", {
        params: {
          query: req.body.query,
        },
        headers: {
          "X-Api-Key": process.env.CALORIENINJAS_API_KEY,
        },
      })
    ).data;

    //format response for calories
    const response = {};

    Object.entries(results.items).forEach((entry) => {
      response[entry[1].name] = entry[1].calories;
    });

    //Send response
    return res.status(200).send(response);
  } catch (err) {
    //in case of any error
    res.status(500).send({
      message: "Something went wrong",
      error: err.message,
    });
    console.log(err);
  }
});

//export the router
module.exports = router;
