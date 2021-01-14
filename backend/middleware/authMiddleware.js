const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
 
const protect = asyncHandler(async (req,res,next) =>{
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        console.log('token found');    
        
        try {
            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)

          //   console.log(decoded) { id: '5f96c972528bdc14549f836b', iat: 1604331220, exp: 1606923220 }

            req.user = await User.findById(decoded.id).select('-password')

            next()

        } catch (error) {
            console.error(error)
            res.status(401)
            throw new Error('Not authorized, token failed')
        }
    } else {
        if (!token) {
            res.status(401)
            throw new Error ('Not authorized, no token')
        }
        next()
    }
})

const admin = (req,res,next) => {
    if ( req.user && req.user.isAdmin ) {
        next()
    } else {
        res.status(401)
        throw new Error('Not authorized as an admin')
    }
}

module.exports = { protect, admin}