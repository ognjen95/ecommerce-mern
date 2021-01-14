const asyncHandler = require('express-async-handler')
const generateToken = require('../utils/generateToken')
const User = require('../models/userModel')

// @description auth user & get token (valitede, email and pass) return user 
// @router POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body

    const user = await User.findOne({email:email})

    if (user && (await user.matchPassword(password))){
        res.json({
            _id:user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error ('Invalid email or password')
    }
}) 

// @description Register new user
// @router POST /api/users
// @access Public
const registerUser = asyncHandler(async (req,res)=>{
    const {name, email, password} = req.body

    const userExists = await User.findOne({email:email})

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }
    
    const user = await User.create({
        name,
        email,
        password
    })

    // hashovan password u user.Schema, ne mora se importovati kao middleware

    if (user){
        res.status(201).json({  
            _id:user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)})
    } else {
        res.status(404)
        throw new Error ('Invalid user data')
    }
}) 


// @description Get user proflile
// @router POST /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req,res)=>{

  const user = await User.findById(req.user._id)// dolazi iz authMidldleware
   
  if (user){
    res.json({
        _id:user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    })
  } else {
      res.status(404)
      throw new Error('User not found')
  }

}) 

// @description Update user proflile
// @router PUT /api/users/profile
// @access Private

    const updateUserProfile = asyncHandler(async (req,res)=>{

    const user = await User.findById(req.user._id)// dolazi iz authMidldleware
   
    if (user) {
      
          user.name = req.body.name || user.name
          user.email = req.body.email || user.email
      

          if (req.body.password){
              user.password = req.body.password
          }

          const updatedUser = await user.save()

          res.json({
            _id:updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
  
  }) 

// @description Get all users
// @router GET /api/users
// @access Private/Admin

const getUsers = asyncHandler(async (req,res)=>{
    const users = await User.find({})
    res.json(users)
  }) 


// @description Delete user
// @router DELETE /api/users/:id
// @access Private/Admin

const deleteUser = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({message:'User removed'})
    }else{
        res.status(404)
        throw new Error ('User not found')
    }
  }) 

// @description Get user by ID
// @router GET /api/users/:id
// @access Private/Admin

const getUserById = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.params.id).select('-password')
    if(user){
        res.json(user)
    }else{
        res.status(404)
        throw new Error ('User not found')
    }

  }) 

// @description Update user 
// @router PUT /api/users/:id
// @access Private/Admin

const updateUser = asyncHandler(async (req,res)=>{

    const user = await User.findById(req.params.id)

    if (user) {
      
          user.name = req.body.name || user.name
          user.email = req.body.email || user.email
          user.isAdmin = req.body.isAdmin 

          const updatedUser = await user.save()

          res.json({
            _id:updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
  
  }) 

  

module.exports = {authUser,
    getUserProfile,
    registerUser,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser}