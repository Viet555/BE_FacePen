const express = require('express')
const { CreateUSer, loginUser, updateUser, deleteUser, getUserTable } = require('../controller/UserController')
const { authMiddleware, authorize } = require('../middleware/JWTAction')
const { CreatePost, UpdateSocialPost, DeletePost, getPost } = require('../controller/SocialPostController')
const { SendFriendRequest, AcceptFriendRequest, RejectFriendRequest, GetListFriend } = require('../controller/RelationshipController')
const { CreateStory, deleteStory, getAllstoryAction, getAllstoryArchive } = require('../controller/StoryController')
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
Router.get('/api/get-Post', getPost)
//RelationShip
Router.post('/api/friend-Request', SendFriendRequest)
Router.post('/api/friend-accept', AcceptFriendRequest)
Router.post('/api/friend-reject', RejectFriendRequest)
Router.get('/api/friend-list', GetListFriend)
//
Router.post('/api/Create-Story', CreateStory)
Router.delete('/api/Delete-Story', deleteStory)
Router.get('/api/get-Story-action', getAllstoryAction)
Router.get('/api/get-Story-archive', getAllstoryArchive)
module.exports = Router