const sequelize = require('sequelize')
const conn = require('./database')

const Log = conn.define('logs', {
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

Log.sync({force: false})

module.exports = Log