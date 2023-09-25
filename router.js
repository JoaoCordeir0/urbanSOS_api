const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth");

// Controllers
const home = require('./controllers/homeController')

router.get('/', auth, home.renderHome)
 
module.exports = router