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
const cityList = (request, response) => {
    cityModel.findAll({
       raw: true,
       where: { status: 1 }
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
            type: 'Err',
            name: err.name + ' | cityList',
            description: err.message
        }) 
        response.status(500).json({ message: 'Internal error!' });
    })
}

const getCityIdByLatLng = async (lat, lng) => {
    let city = 0, address
    try
    {        
        const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&location_type=ROOFTOP&result_type=street_address&key=' + process.env.GOOGLE_API_KEY);
        const data = await response.json();       
        address = data.results[0].formatted_address        

        let cities = await cityModel.findAll({ raw: true, where: { status: 1 }})

        for (let c = 0; c < Object.keys(cities).length; c++)
        {
            if (address.toLowerCase().indexOf(cities[c].name.toLowerCase()) !== -1)
            {
                city = cities[c].id                                 
            }
        }                        
    }    
    catch(e) { }
    
    return {        
        city: city, 
        address: address
    }    
}

const cityConsultWithLatLng = async (request, response) => {

    const data = await getCityIdByLatLng(request.params.latitude, request.params.longitude)

    if (data.city != 0)
        return response.status(200).json([{ message: 'City found based on your address.', city: data.city, address: data.address }])    
    return response.status(200).json([{ message: 'Your city does not yet use the UrbanSOS service.', city: 0, address: data.address }])    
}

module.exports = {
    cityRegister,
    cityList,
    getCityIdByLatLng,
    cityConsultWithLatLng,
}
