const express = require('express')
const router = express.Router()
const axios = require('axios')


//GET REQUESTS
router.get('/search',(req,res)=>{
    res.send('hi')
})


module.exports = router