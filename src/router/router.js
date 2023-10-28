const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth");

// Controllers
const user = require('../controllers/userController')
const city = require('../controllers/cityController')
const report = require('../controllers/reportController')

// City routes
router.post('/city/register', auth, city.cityRegister)
router.get('/city/list', auth, city.cityList)

// Report routes
router.post('/report/register', auth, report.reportRegister)
router.patch('/report/update/situation', auth, report.reportUpdateSituation)
router.get('/report/list/city/:city', auth, report.reportListByCity)
router.get('/report/list/user/:user', auth, report.reportListByUser)
router.get('/report/list/info/:city', auth, report.reportInfo)

// User routes
router.post('/user/validtoken', auth, user.userValidToken)
router.post('/user/recoverpassword', user.userRecoverPassword)
router.post('/user/login', user.userLogin)
router.post('/user/register', auth, user.userRegister)
router.put('/user/update', auth, user.userUpdate)
router.delete('/user/delete/:id', auth, user.userDelete)
router.get('/user/details/:id', auth, user.userDetails)
router.get('/user/admin/list/:city', auth, user.userAdmList)

// Welcome router
router.get('/', (request, response) => { response.render('welcome') })
 
module.exports = router