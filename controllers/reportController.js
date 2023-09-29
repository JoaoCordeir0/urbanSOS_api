const reportModel = require('../models/reportModel')

// Função que insere um novo report 
const reportRegister = (request, response) => {
    reportModel.create({
        title: request.body.report_title,
        description: request.body.report_description,
        image: request.body.report_image,
        latitude: request.body.report_latitude,
        longitude: request.body.report_longitude,
        situation: request.body.report_situation,
        user_id: request.body.report_user_id
    }).then(() => {
        response.status(200).json({ message: 'Report insert success!' });
    }).catch((err) => {      
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que retorna os reports de um usuário
const reportListById = (request, response) => {
    reportModel.findAll({
        raw: true, where: { user_id: request.params.user_id }
    }).then(report => {
        if (report != undefined)
        {     
            response.status(200).json(report)               
        }
        else
        {
            response.status(200).json({ message: 'No reports available!' });
        }
    }).catch((err) => {
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que lista todos os reports
const reportList = (request, response) => {
    reportModel.findAll({
        raw: true
    }).then(report => {
        if (report != undefined)
        {     
            response.status(200).json(report)               
        }
        else
        {
            response.status(200).json({ message: 'Report not found!' });
        }
    }).catch((err) => {
        response.status(500).json({ message: 'Internal error!' });
    })
}

module.exports = {
    reportRegister,
    reportListById,
    reportList,
}