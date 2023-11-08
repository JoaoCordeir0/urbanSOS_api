const sequelize = require('sequelize')
const conn = require('./database')
const User = require('./userModel')
const City = require('./cityModel')

const Report = conn.define('reports', {
    title: {
        type: sequelize.STRING,
        allowNull: false,        
    },
    description: {
        type: sequelize.STRING,
        allowNull: false,
    },
    image: {
        type: sequelize.STRING,
        allowNull: false,
    },
    latitude: {
        type: sequelize.STRING,
        allowNull: false
    },
    longitude: {
        type: sequelize.STRING,
        allowNull: false
    },
    situation: {
        type: sequelize.ENUM('Tolerable', 'Serious', 'Urgent'),
        allowNull: false,       
    },  
    status: {
        type: sequelize.ENUM('Opened', 'In progress', 'Resolved'),
        allowNull: false,       
    },       
})

// Relacionamentos

// ForeignKeys
Report.belongsTo(User, { constraint: true, foreignKey: { allowNull: false }})
Report.belongsTo(City, { constraint: true, foreignKey: { allowNull: false }})

// Um usuário para varios chamados
User.hasMany(Report)
// Uma cidade para vários chamados
City.hasMany(Report)

Report.sync({force: true})

module.exports = Report