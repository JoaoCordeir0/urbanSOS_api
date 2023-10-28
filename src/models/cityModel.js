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
})

City.sync({force: false})

module.exports = City