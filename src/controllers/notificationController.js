const notificationModel = require('../models/notificationModel')
const reportModel = require('../models/reportModel')
const log = require('./logController')
const Op = require('sequelize').Op;

const register = (report) => {
    reportModel.findOne({
        raw: true, where: { id: report }
    }).then(report => {
        notificationModel.create({
            title: '"' + report.title + '" updated status to "' + report.status + '"',
            userId: report.userId
        }).then().catch((err) => {
            log.register({
                type: 'Err',
                name: err.name = ' | notificationRegister',
                description: err.message
            })
        })
    })
}

const listByUser = (request, response) => {
    notificationModel.findAll({
        raw: true,
        order: [['id','DESC']],
        limit: 25,
        where: { 
            userId: request.params.user,
            createdAt: {
                [Op.gte]: require('sequelize').literal(`DATE_SUB(NOW(), INTERVAL 1 WEEK)`),
            }
        }
    }).then((notifications) => {
        if (notifications != undefined) {
            response.status(200).json(notifications)
        }
        else {
            response.status(200).json({ message: 'Notifications not found!' });
        }
    }).catch((err) => {
        log.register({
            type: 'Err',
            name: err.name + ' | notificationListByUser',
            description: err.message
        })
        response.status(500).json({ message: 'Internal error!' });
    })
}

module.exports = {
    register,
    listByUser,
}