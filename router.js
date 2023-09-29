const express = require('express')
const router = express.Router()
const auth = require("./middleware/auth");

// Controllers
const home = require('./controllers/homeController')
const user = require('./controllers/userController')
const report = require('./controllers/reportController')

// Report routes
router.post('/report/register', auth, report.reportRegister)
router.get('/report/list/all', auth, report.reportList)
router.get('/report/list/user/:user_id', auth, report.reportListById)

// User routes
router.post('/user/recoverpassword', user.userRecoverPassword)
router.post('/user/login', user.userLogin)
router.post('/user/register', auth, user.userRegister)
router.put('/user/update', auth, user.userUpdate)
router.delete('/user/delete/:id', auth, user.userDelete)
router.get('/user/details/:id', auth, user.userDetails)

router.get('/', home.welcome)
 
module.exports = router