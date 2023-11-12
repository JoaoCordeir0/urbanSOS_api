const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')
const recoverpassModel = require('../models/recoverPassModel')
const log = require("./logController")
const token = require("./tokenController")
const Op = require('sequelize').Op;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Função que insere um novo usuário 
const register = (request, response) => {
    // Criptografa a senha usando Bcrypt 
    request.body.password = bcrypt.hashSync(request.body.password)

    userModel.create(
        request.body
    ).then(() => {
        response.status(200).json({ message: 'User registered successfully!' });
    }).catch((err) => {
        if (err.name == 'SequelizeUniqueConstraintError') {
            response.status(200).json({ message: 'Email alredy exists in database!' });
        }
        else {
            log.register({
                type: 'Err',
                name: err.name + ' | userRegister',
                description: err.message
            })
            response.status(500).json({ message: 'Internal error!' });
        }
    })
}

// Função que lista os usuário administradores
const admList = async (request, response) => {
    try {
        const admins = await userModel.findAll({
            include: [
                { model: adminModel, required: true, where: { status: 1, cityId: request.params.city } }
            ]
        })
        response.status(200).json(admins)
    } catch (err) {
        log.register({
            type: 'Err',
            name: err.name + ' | userAdmList',
            description: err.message
        })
        response.status(500).json({ message: 'Internal error!' });
    }
}

// Função que retorna as informações de um usuário especifico
const details = async (request, response) => {
    const count = await userModel.count({
        where: { id: request.params.id },
    })

    if (count) {
        userModel.findOne({
            raw: true, where: { id: request.params.id }
        }).then(user => {
            response.status(200).json(user)
        }).catch((err) => {
            log.register({
                type: 'Err',
                name: err.name + ' | userDetails',
                description: err.message
            })
            response.status(500).json({ message: 'Internal error!' });
        })
    }
    else {
        response.status(200).json({ message: 'User not found!' });
    }
}

// Função que deleta um usuário especifico
const del = async (request, response) => {
    await userModel.destroy({
        where: { id: request.params.id }
    }).then(() => {
        response.status(200).json({ message: 'User deleted success!' });
    }).catch((err) => {
        log.register({
            type: 'Err',
            name: err.name + ' | userDelete',
            description: err.message
        })
        response.status(500).json({ message: 'Internal error!' });
    })
}

// Função que valida um Login podendo ser utilizado cpf ou email como username
const login = (request, response) => {
    userModel.findOne({
        raw: true, where: {
            [Op.or]: [{ cpf: request.body.username }, { email: request.body.username }]
        }
    }).then(async user => {
        if (user != undefined && bcrypt.compareSync(request.body.password, user.password)) 
        {
            if (user.status != 1) {
                response.status(200).json({ message: 'User not activated!' })
                return
            }

            // Verifica se é um admin
            const isAdmin = await adminModel.findOne({ raw:true, where: { userId: user.id } })

            if (isAdmin != undefined)
            {                
                return response.status(200).json({ message: 'Login success!', access_token: token.generateAdminToken(user), admin: isAdmin, user: user })
            }
            
            response.status(200).json({ message: 'Login success!', access_token: token.generateUserToken(user), user: user })
        }
        else 
        {
            response.status(200).json({ message: 'Username or password incorrect!' })
        }
    }).catch((err) => {
        log.register({
            type: 'Err',
            name: err.name + ' | userLogin',
            description: err.message
        })
        response.status(500).json({ message: 'Internal error!' })
    })
}

// Função que atualiza um usuário
const update = async (request, response) => {
    const count = await userModel.count({
        where: { id: request.body.id },
    })

    if (count) {
        await userModel.update(request.body, {
            where: { id: request.body.id }
        }).then(() => {
            response.status(200).json({ message: 'User updated success!' })
        }).catch((err) => {
            log.register({
                type: 'Err',
                name: err.name + ' | userUpdate',
                description: err.message
            })
            response.status(500).json({ message: 'Internal error!' });
        })
    }
    else {
        response.status(200).json({ message: 'User not found.' })
    }
}

// Função que recupera a senha
const recoverPassword = async (request, response) => {
    await userModel.findOne({
        raw: true, where: { email: request.body.email, status: 1 }
    }).then(user => {
        if (user != undefined) {            
            const transporter = nodemailer.createTransport({
                host: "smtp.zoho.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_DOMAIN,
                    pass: process.env.EMAIL_PASS
                },
                tls: { rejectUnauthorized: false }
            });

            let email_html = require('fs').readFileSync('./public/templates/emailRecoverPassword.html', 'utf8')

            email_html = email_html.replace('{{name}}', user.name).replaceAll('{{link}}', 'https://urbansos.com.br/recoverpassword/' + btoa(user.id + "-" + user.name))            

            const mailOptions = {
                from: process.env.EMAIL_DOMAIN,
                to: request.body.email,
                subject: 'Recover password - UrbanSOS',
                html: email_html
            }

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    response.status(500).json({ message: err })
                } else {
                    response.status(200).json({ message: 'Email send!' })                    
                }
            });            
        }
        else {
            response.status(200).json({ message: 'Email not found!' });
        }
    }).catch((err) => {
        log.register({
            type: 'Err',
            name: err.name + ' | userRecoverPassword',
            description: err.message
        })
        response.status(500).json({ message: 'Internal error!', err: err });
    })
}

module.exports = {
    admList,
    register,
    details,
    del,
    login,
    recoverPassword,
    update,
}