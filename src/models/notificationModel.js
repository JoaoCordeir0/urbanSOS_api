const sequelize = require('sequelize')
const conn = require('./database')
const User = require('./userModel')

const Notification = conn.define('notifications', {
    title: {
        type: sequelize.STRING,
        allowNull: false,        
    },    
})

// ForeignKeys
Notification.belongsTo(User, { constraint: true, foreignKey: { allowNull: false }})

// Um usuário para varias notificações
User.hasMany(Notification)

Notification.sync({force: false})

module.exports = Notification