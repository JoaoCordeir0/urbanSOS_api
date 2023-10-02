const userModel = require('../models/userModel')
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Função que insere um novo usuário 
const userRegister = (request, response) => {
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
            message: err.name == 'SequelizeUniqueConstraintError' ? 'Email alredy exists in database!' : err 
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
            [Op.or]: [{ cpf: request.body.user_username }, { email: request.body.user_username }],
            status: 1 
        }
    }).then(user => {
        if (user != undefined && bcrypt.compareSync(request.body.user_password, user.password))
        {     
            const token = jwt.sign(
                { user_id: user.id },
                process.env.TOKEN_KEY,
                { 
                    expiresIn: '2h',
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
        where: { id: request.body.user_id },
    })
      
    if (count)
    {
        await userModel.update({
            name: request.body.user_name,
            email: request.body.user_email,
            cpf: request.body.user_cpf,
            password: bcrypt.hashSync(request.body.user_password, 8),
            status: request.body.user_status,
            lvl: 1,
        }, {
            where: { id: request.body.user_id }
        }).then(user => {
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