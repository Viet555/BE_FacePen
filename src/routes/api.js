const express = require('express')
const { CreateUSer, loginUser, updateUser, deleteUser } = require('../controller/UserController')
const { authMiddleware, authorize } = require('../middleware/JWTAction')
const Router = express.Router()

Router.post('/api/CreateUser', CreateUSer)
Router.post('/api/login-user', loginUser)
Router.put('/api/update-user', updateUser)

Router.delete('/api/DeleteUser', authMiddleware, authorize(['Admin']), deleteUser)
module.exports = Router