const log = require("../controllers/logController")
const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
    const token = request.body.token || request.query.token || request.headers["x-access-token"]

    if (!token) 
    {
        return response.status(403).json({ message: "A token is required for authentication" })
    }
    
    try 
    {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY)           

        if (!decoded.name)        
            throw new Error("Invalid Token");  
        
        if (decoded.exp <= Math.round(new Date().getTime() / 1000))
            throw new Error("Expired Token");  
                      
        log.register({             
            type: 'Access',
            name: 'User ' + decoded.name + ' access',   
            description: token,                                
        }) 

        return next()
    } 
    catch (err) 
    {
        log.register({             
            type: 'Err',
            name: err.message,   
            description: token,                                
        }) 

        return response.status(401).json({ message: err.message })
    }    
};

module.exports = verifyToken