const sequelize = require('sequelize')
const conn = require('./database')

const City = conn.define('cities', {
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
        unique: true,
    },
    status: {
        type: sequelize.BOOLEAN,
        allowNull: false
    },
})

City.sync({force: false})

module.exports = City