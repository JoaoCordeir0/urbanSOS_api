const express = require('express')
const bodyParser = require('body-parser')

// Class
const Home = require('./class/Home')   

const app = express()

// Lib body-parse
app.use(bodyParser.urlencoded({extend:false}))
app.use(bodyParser.json())

// Use EJS with view enginer
app.set('view engine', 'ejs')

// Use 
app.use(express.static('public'))

app.get('/', (request, response) => {             
    (new Home(request, response)).renderHome()    
})
 
module.exports = app