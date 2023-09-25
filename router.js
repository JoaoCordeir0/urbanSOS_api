const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth");

// Controllers
const home = require('./controllers/homeController')
const user = require('./controllers/userController')

// User routes
router.post('/user/register', auth, user.insertUser)
router.get('/user/details/:id', auth, user.userDetails)
router.delete('user/delete/:id', auth, user.userDelete)

router.get('/', home.renderHome)
 
module.exports = router