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
        console.log(decoded)
    } 
    catch (err) 
    {
        return response.status(401).json({ message: "Invalid Token" })
    }
    return next()
};

module.exports = verifyToken