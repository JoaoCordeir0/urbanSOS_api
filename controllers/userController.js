const userModel = require('../models/users')
const bcrypt = require('bcryptjs');

// Função que insere um novo usuário 
const insertUser = (request, response) => {
    userModel.create({
        name: request.body.user_name,
        email: request.body.user_email,
        cpf: request.body.user_cpf,
        password: bcrypt.hashSync(request.body.user_password, 8),
        status: 0,
        lvl: 1,
    }).then(() => {
        response.status(200).json({ message: 'User insert success!' });
    }).catch((err) => {      
        response.status(500).json({ 
            message: err.name == 'SequelizeUniqueConstraintError' ? 'Email alredy exists in database!' : 'Internal error!' 
        });
    })
}

// Função que retorna as informações de um usuário especifico
const userDetails = (request, response) => {
    userModel.findOne({
        raw: true, where: {id: request.params.id}
    }).then(user => {
        if (user != undefined)
        {     
            response.status(200).json(user)               
        }
        else
        {
            response.status(200).json({ message: 'User not found!' });
        }
    }).catch((err) => {

        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que deleta um usuário especifico
const userDelete = (request, response) => {
    response.status(500).json({ message: 'In dev!' });
}

// Função que valida um Login
const userLogin = (request, responde) => {
    bcrypt.compareSync("senha", hash); // true
}

module.exports = {
    insertUser,
    userDetails,
    userDelete,
    userLogin,
}