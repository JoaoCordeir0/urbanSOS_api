class Home {
    constructor(request, response) {
        this.request = request;
        this.response = response;
    }

    renderHome(){
        this.response.render('home', {
            pageTitle: 'UrbanSOS - Home'
        })
    }
}

module.exports = Home;