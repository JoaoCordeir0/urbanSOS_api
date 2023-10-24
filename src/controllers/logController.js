const logModel = require('../models/logModel')

// Função que registra log de acessos e erros
const register = (data) => {
    logModel.create( data ).then()    
}

module.exports = {
    register,
}
