const reportModel = require('../models/reportModel')
const log = require("./logController")

// Função que insere um novo report 
const reportRegister = (request, response) => {
    reportModel.create(
        request.body
    ).then(() => {
        response.status(200).json({ message: 'Report insert success!' });
    }).catch((err) => {      
        log.register({
            requester: 'API - Error',
            token: err.name,
            action: err.message
        }) 
        response.status(500).json({ 
            message: err.name == 'SequelizeForeignKeyConstraintError' ? 'Error! User or City does not exist!' : 'Internal error!'
        })
    })
}

// Função que retorna os reports de um usuário
const reportListByUser = (request, response) => {
    reportModel.findAll({
        raw: true, where: { user: request.params.user }
    }).then(reports => {
        if (reports != undefined)
        {     
            response.status(200).json(reports)               
        }
        else
        {
            response.status(200).json({ message: 'No reports available!' });
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

// Função que retorna os reports de uma cidade
const reportListByCity = (request, response) => {
    reportModel.findAll({
        raw: true, where: { city: request.params.city }
    }).then(reports => {
        if (reports != undefined)
        {     
            response.status(200).json(reports)               
        }
        else
        {
            response.status(200).json({ message: 'Report not found!' });
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

// Função que atualiza o status de um report
const reportUpdateSituation = async (request, response) => {
    const count = await reportModel.count({
        where: { id: request.body.report_id },
    })
      
    if (count)
    {
        await reportModel.update({
            situation: request.body.situation_id,
        }, {
            where: { id: request.body.report_id }
        }).then(() => {
            response.status(200).json({ message: 'Report situation updated success!' })
        }).catch((err) => {
            log.register({
                requester: 'API - Error',
                token: err.name,
                action: err.message
            }) 
            response.status(500).json({ message: 'Internal error!' });
        })
    }
    else
    {
        response.status(200).json({ message: 'Report not found!' })
    }
    
}

// Função que coleta métricas que são usadas na dashboard do UrbanSOS Web
const reportInfo = async (request, response) => {
    try 
    {
        const count_total = await reportModel.count({
            where: { city: request.params.city },
        })
        const count_opened = await reportModel.count({
            where: { city: request.params.city, status: 0 },
        })
        const count_resolved = await reportModel.count({
            where: { city: request.params.city, status: 1 },
        })

        const data = {
            count_total: count_total,
            count_opened: count_opened,
            count_resolved: count_resolved,
        }

        response.status(200).json(data)
    }
    catch(e)
    {
        response.status(500).json({ message: 'Internal error!' });
    }
}

module.exports = {
    reportRegister,
    reportListByUser,
    reportListByCity,
    reportUpdateSituation,
    reportInfo,
}