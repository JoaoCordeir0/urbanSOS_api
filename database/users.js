const sequelize = require('sequelize')
const conn = require('./database')

const users = conn.define('users', {
    name: {
        type: sequelize.STRING,
        allowNull: false,        
    },
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    status: {
        type: sequelize.BOOLEAN,
        allowNull: false
    },
    lvl: {
        type: sequelize.INTEGER,
        allowNull: false
    }
})

users.sync({force: false})

module.exports = users