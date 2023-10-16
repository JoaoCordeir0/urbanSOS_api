const reportModel = require('../models/reportModel')

// Função que insere um novo report 
const reportRegister = (request, response) => {
    reportModel.create(
        request.body
    ).then(() => {
        response.status(200).json({ message: 'Report insert success!' });
    }).catch((err) => {      
        response.status(500).json({ 
            message: err.name == 'SequelizeForeignKeyConstraintError' ? 'Error! User or City does not exist!' : 'Internal error!'
         })
    })
}

// Função que retorna os reports de um usuário
const reportListByUser = (request, response) => {
    reportModel.findAll({
        raw: true, where: { user_id: request.params.user_id }
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
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que retorna os reports de uma cidade
const reportListByCity = (request, response) => {
    reportModel.findAll({
        raw: true, where: { city_id: request.params.city_id }
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
            response.status(500).json({ message: 'Internal error!' });
        })
    }
    else
    {
        response.status(200).json({ message: 'Report not found!' })
    }
    
}

module.exports = {
    reportRegister,
    reportListByUser,
    reportListByCity,
    reportUpdateSituation,
}