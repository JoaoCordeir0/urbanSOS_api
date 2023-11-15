const cityModel = require('../models/cityModel')
const log = require('./logController')
const googleMaps = require('../services/googleMaps')
const openCage = require('../services/openCage')

// Função que insere uma nova cidade 
const register = (request, response) => {
    cityModel.create(
        request.body
    ).then(() => {
        response.status(200).json({ message: 'City insert success!' });
    }).catch((err) => {
        log.register({
            type: 'Err',
            name: err.name + ' | cityRegister',
            description: err.message
        })
        response.status(500).json({
            message: err.name == 'SequelizeUniqueConstraintError' ? 'Email alredy exists in database!' : 'Internal error!'
        });
    })
}

// Função que lista as cidades disponíveis 
const list = (request, response) => {
    cityModel.findAll({
        raw: true,
        where: { status: 1 }
    }).then((cities) => {
        if (cities != undefined) {
            response.status(200).json(cities)
        }
        else {
            response.status(200).json({ message: 'Cities not found!' });
        }
    }).catch((err) => {
        log.register({
            type: 'Err',
            name: err.name + ' | cityList',
            description: err.message
        })
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que lista as informações de uma cidade
const details = (request, response) => {
    cityModel.findAll({
        raw: true,
        where: { id: request.params.id }
    }).then((city) => {
        if (city != undefined) {
            response.status(200).json(city)
        }
        else {
            response.status(200).json({ message: 'City not found!' });
        }
    }).catch((err) => {
        log.register({
            type: 'Err',
            name: err.name + ' | cityDetails',
            description: err.message
        })
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que atualiza as informações de uma cidade
const update = async (request, response) => {
    const count = await cityModel.count({
        where: { id: request.body.city },
    })

    if (count) {
        await cityModel.update({
            email: request.body.email,
            status: request.body.status,
        }, {
            where: { id: request.body.city }
        }).then(() => {
            response.status(200).json({ message: 'City updated success!' })
        }).catch((err) => {
            log.register({
                type: 'Err',
                name: err.name + ' | cityUpdate',
                description: err.message
            })
            response.status(500).json({ message: 'Internal error!' });
        })
    }
    else {
        response.status(200).json({ message: 'City not found!' })
    }
}

// Função que retorna o id da cidade com base na latite e longitude
const idByLatLng = async (request, response) => {
    let api = 'googleMaps', city = 0, status = 0, address, message, lat = request.params.latitude, lng = request.params.longitude
    
    address = await googleMaps.getAddress(lat, lng)

    // Faz uma segunda request caso o address foi igual a "not_found"
    if (address == 'not_found') {
        api = 'openCage'
        address = await openCage.getAddress(lat, lng)
    }
        
    let cities = await cityModel.findAll({ raw: true })
    for (let c = 0; c < Object.keys(cities).length; c++) {
        if (address.toLowerCase().indexOf(cities[c].name.toLowerCase()) !== -1) {
            city = cities[c].id
            status = cities[c].status
        }
    }

    if (city != 0 && status == 1) {
        message = 'City found based on your address.'
    } else if (city != 0) {
        message = 'The city you currently reside in has temporarily disabled service'
    } else {
        message = 'The city in which you currently reside does not use the UrbanSOS service'
    }

    log.register({
        type: 'Location',
        name: `Api="${api} Lat="${lat}" Lng="${lng}"`,
        description: address
    })

    response.status(200).json([{
        message: message,
        city: city,
        status: status,
        address: address
    }])
}

module.exports = {
    register,
    list,
    update,
    idByLatLng,
    details,
}
