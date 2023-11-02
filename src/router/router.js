const express = require('express')
const router = express.Router()
const middleware = require("../middleware/auth");

// Controllers
const city = require('../controllers/cityController')
const user = require('../controllers/userController')
const report = require('../controllers/reportController')
const token = require('../controllers/tokenController')

// City routes
router.post('/city/register', middleware.complexAuth, city.cityRegister)
router.get('/city/list', middleware.complexAuth, city.cityList)

// Report routes
router.post('/report/register', middleware.complexAuth, report.reportRegister)
router.patch('/report/update/situation', middleware.complexAuth, report.reportUpdateSituation)
router.get('/report/list/city/:city', middleware.complexAuth, report.reportListByCity)
router.get('/report/details/:id', report.reportDetails)
router.get('/report/list/user/:user', middleware.simpleAuth, report.reportListByUser)
router.get('/report/list/info/:city', middleware.complexAuth, report.reportInfo)

// User routes
router.post('/user/recoverpassword', user.userRecoverPassword)
router.post('/user/login', user.userLogin)
router.post('/user/register', user.userRegister)
router.put('/user/update', middleware.simpleAuth, user.userUpdate)
router.delete('/user/delete/:id', middleware.simpleAuth, user.userDelete)
router.get('/user/details/:id', middleware.complexAuth, user.userDetails)
router.get('/user/admin/list/:city', middleware.complexAuth, user.userAdmList)

// Welcome router
router.get('/', (request, response) => { response.render('welcome') })
 
module.exports = router