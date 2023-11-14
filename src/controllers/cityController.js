const cityModel = require('../models/cityModel')
const log = require('./logController')

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
    let city = 0, status, address, lat = request.params.latitude, lng = request.params.longitude
    try {
        const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&location_type=ROOFTOP&result_type=street_address&key=' + process.env.GOOGLE_API_KEY);
        const data = await response.json();
        address = data.results[0].formatted_address

        let cities = await cityModel.findAll({ raw: true })

        for (let c = 0; c < Object.keys(cities).length; c++) {
            if (address.toLowerCase().indexOf(cities[c].name.toLowerCase()) !== -1) {
                city = cities[c].id
                status = cities[c].status
            }
        }
    }
    catch (e) { 
        address = "Not found"
    }

    log.register({
        type: 'LatLng',
        name: 'Lat: "' + lat + '" Lng: "' + lng + '"',
        description: address
    })

    if (city != 0 && status == 1) {
        return response.status(200).json([{
            message: 'City found based on your address.',
            city: city,
            status: status,
            address: address
        }])
    }
    else if (city != 0) {
        return response.status(200).json([{
            message: 'The city you currently reside in has temporarily disabled service',
            city: city,
            status: 0,
            address: address
        }])
    }
    return response.status(200).json([{
        message: 'The city in which you currently reside does not use the UrbanSOS service',
        city: 0,
        status: 0,
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
