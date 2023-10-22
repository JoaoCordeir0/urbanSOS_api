const userModel = require('../models/userModel')
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Função que insere um novo usuário 
const userRegister = (request, response) => {
    // Criptografa a senha usando Bcrypt 
    request.body.password = bcrypt.hashSync(request.body.password)
    
    userModel.create(
        request.body 
    ).then(() => {
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
        raw: true, where: { id: request.params.id }
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
const userDelete = async (request, response) => {
    await userModel.destroy({
        where: { id: request.params.id }
    }).then(() => {
        response.status(200).json({ message: 'User deleted success!' });
    }).catch((err) => {
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que valida um Login podendo ser utilizado cpf ou email como username
const userLogin = (request, response) => {
    userModel.findOne({
        raw: true, where: { 
            [Op.or]: [{ cpf: request.body.username }, { email: request.body.username }]            
        }
    }).then(user => {                            
        if (user != undefined && bcrypt.compareSync(request.body.password, user.password))
        {            
            if (user.status != 1)
            {
                response.status(200).json({ message: 'User not activated!' })
                return
            }   

            const token = jwt.sign(
                { user: user.id },
                process.env.TOKEN_KEY,
                { 
                    expiresIn: '5h',
                }
            )
            response.status(200).json({ message: 'Login success!', access_token: token })
        }
        else
        {
            response.status(200).json({ message: 'Username or password incorrect!' });
        }
    }).catch((err) => {
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que atualiza um usuário
const userUpdate = async (request, response) => {
    const count = await userModel.count({
        where: { id: request.body.id },
    })
      
    if (count)
    {
        await userModel.update( request.body, {
            where: { id: request.body.id }
        }).then(() => {
            response.status(200).json({ message: 'User updated success!' })
        }).catch((err) => {
            response.status(500).json({ message: 'Internal error!' });
        })
    }
    else
    {
        response.status(200).json({ message: 'User not found.' })
    }
}

// Função que recupera a senha
const userRecoverPassword = async (request, response) => {
    await userModel.findOne({
        raw: true, where: { email: request.body.email, status: 1 }
    }).then(user => {
        if (user != undefined)
        {     
            response.status(200).json({ message: 'Email send!' })
        }
        else
        {
            response.status(200).json({ message: 'Email not found!' });
        }
    }).catch((err) => {
        response.status(500).json({ message: 'Internal error!', err: err });
    })
}

module.exports = {
    userRegister,
    userDetails,
    userDelete,
    userLogin,
    userRecoverPassword,
    userUpdate,
}