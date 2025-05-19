const express = require('express')
const { CreateUSer, loginUser, updateUser, deleteUser, getUserTable } = require('../controller/UserController')
const { authMiddleware, authorize } = require('../middleware/JWTAction')
const { CreatePost, UpdateSocialPost, DeletePost } = require('../controller/SocialPostController')
const Router = express.Router()

Router.post('/api/CreateUser', CreateUSer)
Router.post('/api/login-user', loginUser)
Router.put('/api/update-user', updateUser)
Router.get('/api/get-table-user', getUserTable)
Router.delete('/api/DeleteUser', authMiddleware, authorize(['Admin']), deleteUser)
//SocialPost
Router.post('/api/Create-Post', CreatePost)
Router.put('/api/Update-Post', UpdateSocialPost)
Router.delete('/api/Delete-Post', DeletePost)
module.exports = Router