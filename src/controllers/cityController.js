const cityModel = require('../models/cityModel')
const log = require('./logController')

// Função que insere uma nova cidade 
const cityRegister = (request, response) => {
    cityModel.create(
        request.body
    ).then(() => {
        response.status(200).json({ message: 'City insert success!' });
    }).catch((err) => {      
        log.register({
            requester: 'API - Error',
            token: err.name,
            action: err.message
        }) 
        response.status(500).json({ 
            message: err.name == 'SequelizeUniqueConstraintError' ? 'Email alredy exists in database!' : 'Internal error!' 
        });
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
        log.register({
            requester: 'API - Error',
            token: err.name,
            action: err.message
        }) 
        response.status(500).json({ message: 'Internal error!' });
    })
}

module.exports = {
    cityRegister,
    cityList,
}
