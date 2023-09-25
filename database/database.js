const Sequelize = require('sequelize') 

const conn = new Sequelize(process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
})

// Authenticate with database
conn.authenticate().then(() => {
    console.log('Database connected!')
}).catch((err) => {
    console.log(err)
})

module.exports = conn