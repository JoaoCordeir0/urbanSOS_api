const sequelize = require('sequelize')
const conn = require('./database')
const User = require('./userModel')

const RecoverPass = conn.define('recover_password', {
    token: {
        type: sequelize.INTEGER,
        allowNull: false,
    },  
})

// Relacionamentos

// ForeignKeys
RecoverPass.belongsTo(User, { constraint: true, foreignKey: { allowNull: false }})

// Um usuário pra varios token
User.hasMany(RecoverPass)

RecoverPass.sync({force: false})

module.exports = RecoverPass