# urbansos_web
Repósitorio para armazenar o Front-end e api da aplicação UrbanSOS

```
// JWT Example
const jwt = require("jsonwebtoken");
require('dotenv').config()     

const token = jwt.sign(
    { requester: 'Teste', action: 'Teste' },
    process.env.TOKEN_KEY,
    {
        expiresIn: "5h",
    }
);

console.log(token)
```
