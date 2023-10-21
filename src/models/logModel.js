const sequelize = require('sequelize')
const conn = require('./database')

const log = conn.define('logs', {
    requester: {
        type: sequelize.STRING,
        allowNull: false,        
    },
    token: {
        type: sequelize.STRING,
        allowNull: false,        
    },
    action: {
        type: sequelize.STRING,
        allowNull: false,        
    },    
})

log.sync({force: false})

module.exports = log