const bcryptjs = require('bcryptjs')
const users = [
    {
        name:'Admin user',
        email: 'admin@example.com',
        password: bcryptjs.hashSync('123456', 10),
        isAdmin: true 
    },
    {
        name:'Ognjen',
        email: 'Ognjen@example.com',
        password: bcryptjs.hashSync('123456', 10),
        isAdmin: false 
    },
    {
        name:'Isidora',
        email: 'isidora @example.com',
        password: bcryptjs.hashSync('123456', 10),
        isAdmin: false
    },
]

module.exports = users