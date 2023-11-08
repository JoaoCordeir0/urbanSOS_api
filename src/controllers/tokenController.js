const jwt = require("jsonwebtoken");

// Função que gera token para usuários
const generateUserToken = (user) => {
    const token = jwt.sign(
        { 
            user: user.id, 
            name: user.name, 
            email: user.email, 
            cpf: user.cpf 
        },
        process.env.TOKEN_KEY,
        { 
            expiresIn: process.env.TOKEN_EXP,
        }
    )
    return token
}

// Função que gera token para administradores
const generateAdminToken = (user) => {
    const token = jwt.sign(
        { 
            user: user.id, 
            name: user.name, 
            email: user.email, 
            cpf: user.cpf, 
            admin: 1 
        },
        process.env.TOKEN_KEY,
        { 
            expiresIn: process.env.TOKEN_EXP,
        }
    )
    return token
}

module.exports = {
    generateUserToken,
    generateAdminToken,
}
