const app = require('./controllers/routes')

app.listen('9090', (err) => {
    err ? console.log('Error') : console.log('Server on in port 9090')
})