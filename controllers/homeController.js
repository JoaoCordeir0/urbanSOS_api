const welcome = (request, response) => {
    return response.render('home', {
        appName: 'UrbanSOS'
    })
}

module.exports = {
    welcome
}