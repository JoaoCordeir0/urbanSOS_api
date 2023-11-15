const express = require('express')
const router = express.Router()
const middleware = require("../middleware/auth");

// Controllers
const city = require('../controllers/cityController')
const user = require('../controllers/userController')
const report = require('../controllers/reportController')
const notification = require('../controllers/notificationController')

// Notification routes
router.get('/notification/list/:user', middleware.simpleAuth, notification.listByUser)
router.get('/notification/count/:user', middleware.simpleAuth, notification.countByUser)

// City routes
router.put('/city/register', middleware.complexAuth, city.register)
router.put('/city/update', middleware.complexAuth, city.update)
router.get('/city/list', middleware.simpleAuth, city.list)
router.get('/city/details/:id', middleware.complexAuth, city.details)
router.get('/city/latlng/:latitude/:longitude', middleware.simpleAuth, city.idByLatLng)

// Report routes
router.put('/report/register', report.register)
router.patch('/report/update/status', middleware.complexAuth, report.updateStatus)
router.get('/report/list/city/:city', middleware.complexAuth, report.listByCity)
router.get('/report/details/:id', middleware.simpleAuth, report.details)
router.get('/report/list/user/:user', middleware.simpleAuth, report.listByUser)
router.get('/report/list/info/:city', middleware.complexAuth, report.info)

// User routes
router.post('/user/recoverpassword', user.recoverPassword)
router.post('/user/login', user.login)
router.post('/user/register', user.register)
router.put('/user/update', middleware.simpleAuth, user.update)
router.delete('/user/delete/:id', middleware.simpleAuth, user.del)
router.get('/user/details/:id', middleware.complexAuth, user.details)
router.get('/user/admin/list/:city', middleware.complexAuth, user.admList)

// Welcome router
router.get('/', (request, response) => { response.render('welcome') })
 
module.exports = router