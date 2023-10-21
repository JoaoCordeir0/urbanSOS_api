const logModel = require('../models/logModel')

// Função que insere uma nova cidade 
const register = (data) => {
    logModel.create( data ).then()    
}

module.exports = {
    register,   
}
