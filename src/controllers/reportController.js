const reportModel = require('../models/reportModel')
const log = require("./logController")
const notification = require('./notificationController')

// Função que insere um novo report 
const register = async (request, response) => {          
    reportModel.create(
        request.body
    ).then(() => {        
        response.status(200).json({ message: 'Report insert success!' });
    }).catch((err) => {      
        log.register({
            type: 'Err',
            name: err.name = ' | reportRegister',
            description: err.message
        }) 
        response.status(500).json({ 
            message: err.name == 'SequelizeForeignKeyConstraintError' ? 'Error! User or City does not exist!' : 'Internal error!'
        })
    })
}

// Função que retorna os reports de um usuário
const listByUser = (request, response) => {
    reportModel.findAll({
        raw: true, 
        order: [['id','DESC']],
        limit: 25,
        where: { userId: request.params.user },             
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
            type: 'Err',
            name: err.name = ' | reportListByUser',
            description: err.message
        }) 
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que retorna os reports de uma cidade
const listByCity = (request, response) => {
    reportModel.findAll({
        raw: true, 
        order: [['id','DESC']],
        where: { cityId: request.params.city },       
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
            type: 'reportListByCity',
            name: err.name,
            description: err.message
        }) 
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que atualiza o status de um report
const updateStatus = async (request, response) => {
    const count = await reportModel.count({
        where: { id: request.body.report },
    })
      
    if (count)
    {
        await reportModel.update({
            status: request.body.status,
        }, {
            where: { id: request.body.report }
        }).then(() => {
            // Chama função responsável por gerar uma notificação
            notification.register(request.body.report)

            response.status(200).json({ message: 'Report status updated success!' })
        }).catch((err) => {
            log.register({
                type: 'Err',
                name: err.name + ' | reportUpdateSituation',
                description: err.message
            }) 
            response.status(500).json({ message: 'Internal error!' });
        })
    }
    else
    {
        response.status(200).json({ message: 'Report not found!' })
    }
}

// Função que coleta todas as informações de um chamado (Usuário e Cidade)
const details = async (request, response) => {    
    try {
        const report = await reportModel.findOne({ where: { id: request.params.id }, include: [
            { model: require('../models/userModel'), attributes: ['name', 'email', 'cpf', 'status']}, 
            { model: require('../models/cityModel') }
        ]})
        response.status(200).json([report])
    } catch (err) {
        log.register({
            type: 'Err',
            name: err.name + ' | reportDetails' ,
            description: err.message
        }) 
        response.status(500).json({ message: 'Internal error!' });
    }    
}

// Função que coleta métricas que são usadas na dashboard do UrbanSOS Web
const info = async (request, response) => {
    try 
    {
        const count_total = await reportModel.count({
            where: { cityId: request.params.city },
        })
        const count_opened = await reportModel.count({
            where: { cityId: request.params.city, status: 0 },
        })
        const count_resolved = await reportModel.count({
            where: { cityId: request.params.city, status: 1 },
        })

        const data = {
            count_total: count_total,
            count_opened: count_opened,
            count_resolved: count_resolved,
        }

        response.status(200).json(data)
    }
    catch(err)
    {
        log.register({
            type: 'Err',
            name: err.name = ' | reportInfo',
            description: err.message
        }) 
        response.status(500).json({ message: 'Internal error!' });
    }
}

module.exports = {
    register,
    listByUser,
    listByCity,
    updateStatus,
    details,
    info,
}