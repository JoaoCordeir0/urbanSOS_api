const sequelize = require('sequelize')
const conn = require('./database')
const User = require('./userModel')
const City = require('./cityModel')

const Admin = conn.define('admins', {
    status: {
        type: sequelize.INTEGER,
        allowNull: false,
    },  
})

// Relacionamentos

// ForeignKeys
Admin.belongsTo(User, { constraint: true, foreignKey: { allowNull: false }})
Admin.belongsTo(City, { constraint: true, foreignKey: { allowNull: false }})

// Um usuário pra um admin
User.hasOne(Admin)
// Uma cidade pra um admin
City.hasOne(Admin)

Admin.sync({force: false})

module.exports = Admin