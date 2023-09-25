const jwt = require("jsonwebtoken");

const verifyToken = (request, response, next) => {
    const token = request.body.token || request.query.token || request.headers["x-access-token"];

    if (!token) 
    {
        return response.status(403).send("A token is required for authentication");
    }
    
    try 
    {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        request.user = decoded;
    } 
    catch (err) 
    {
        return response.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;