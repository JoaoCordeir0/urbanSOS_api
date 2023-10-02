const cityModel = require('../models/cityModel')

// Função que insere uma nova cidade 
const cityRegister = (request, response) => {
    cityModel.create({
        name: request.body.city_name,
        state: request.body.city_state,
        email: request.body.city_email,
    }).then(() => {
        response.status(200).json({ message: 'City insert success!' });
    }).catch((err) => {      
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que lista as cidades disponíveis 
const cityList = (request, response) => {
    cityModel.findAll({
       raw: true
    }).then((cities) => {
        if (cities != undefined)
        {     
            response.status(200).json(cities)               
        }
        else
        {
            response.status(200).json({ message: 'Cities not found!' });
        }
    }).catch((err) => {      
        response.status(500).json({ message: 'Internal error!' });
    })
}


module.exports = {
    cityRegister,
    cityList,
}
