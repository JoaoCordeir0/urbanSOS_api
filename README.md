# urbansos_web
Repósitorio para armazenar o Front-end e api da aplicação UrbanSOS

```
// JWT Example
const jwt = require("jsonwebtoken");
require('dotenv').config()     

var date = new Date();
var day = String(date.getDate()).padStart(2, '0');
var month = String(date.getMonth() + 1).padStart(2, '0');
var year = date.getFullYear(); 

const token = jwt.sign(
    { date: `${year}-${month}-${day}` },
    process.env.TOKEN_KEY,
    {
        expiresIn: "1h",
    }
);

console.log(token)
```
