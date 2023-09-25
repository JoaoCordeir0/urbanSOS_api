const sequelize = require('sequelize')
const conn = require('./database')

const user = conn.define('users', {
    name: {
        type: sequelize.STRING,
        allowNull: false,        
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    cpf: {
        type: sequelize.STRING,
        allowNull: false,
        unique: true
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

user.sync({force: false})

module.exports = user