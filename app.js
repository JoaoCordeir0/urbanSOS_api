require('dotenv').config()     
   
const express = require('express')
const router = require('./router')

const app = express()

// Lib body-parse
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extend:false}))
app.use(bodyParser.json())

// Use EJS with view enginer
app.set('view engine', 'ejs')

// Use public directory
app.use(express.static('public'))

// API routes 
app.use(router)

app.listen(process.env.PORT , (err) => {
    err ? console.log('Error') : console.log(`Server on in port ${process.env.PORT}`)
})