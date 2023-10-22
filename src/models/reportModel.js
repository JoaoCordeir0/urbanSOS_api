const sequelize = require('sequelize')
const conn = require('./database')

const report = conn.define('reports', {
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
        type: sequelize.INTEGER,
        allowNull: false,       
    },   
    user: {
        type: sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id' ,
        }                
    },    
    city: {
        type: sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id' ,
        }  
    }   
})

report.sync({force: false})

module.exports = report