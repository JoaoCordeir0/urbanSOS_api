const sequelize = require('sequelize')
const conn = require('./database')

const city = conn.define('cities', {
    name: {
        type: sequelize.STRING,
        allowNull: false,        
    },
    state: {
        type: sequelize.STRING,
        allowNull: false,
    },    
    email: {
        type: sequelize.STRING,
        allowNull: false,
    },
})

city.sync({force: false})

module.exports = city