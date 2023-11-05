const log = require("../controllers/logController")
const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next, lvlAuth) => {
    const token = request.body.token || request.query.token || request.headers["x-access-token"]

    if (!token)     
        return response.status(403).json({ message: "A token is required for authentication" })    
    
    try 
    {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)           

        if (lvlAuth == 'complex' && decoded.admin != 1) 
            throw new Error("Permission Denied")

        if (!decoded.name || !decoded.email || !decoded.cpf)        
            throw new Error("Invalid token params ")                                           

        return next()
    } 
    catch (err) 
    {
        log.register({             
            type: 'Err',
            name: err.message,   
            description: token,                                
        }) 

        return response.status(401).json({ message: 'Invalid or expired Token' })
    }    
}

const simpleAuth = (request, response, next) => {
    verifyToken(request, response, next, 'simple')
}

const complexAuth = (request, response, next) => {
    verifyToken(request, response, next, 'complex')
}

module.exports = {
    simpleAuth,
    complexAuth,
}