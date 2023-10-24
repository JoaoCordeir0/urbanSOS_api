const sequelize = require('sequelize')
const conn = require('./database')

const log = conn.define('logs', {
    type: {
        type: sequelize.STRING,
        allowNull: false,        
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,        
    },
    description: {
        type: sequelize.TEXT,
        allowNull: false,        
    },    
})

log.sync({force: false})

module.exports = log