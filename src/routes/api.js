const express = require('express')
const { CreateUSer, loginUser, updateUser, deleteUser, getUserTable } = require('../controller/UserController')
const { authMiddleware, authorize } = require('../middleware/JWTAction')
const { CreatePost, UpdateSocialPost, DeletePost, getPost, likePost } = require('../controller/SocialPostController')
const { SendFriendRequest, AcceptFriendRequest, RejectFriendRequest, GetListFriend, friendSuggestion } = require('../controller/RelationshipController')
const { CreateStory, deleteStory, getAllstoryAction, getAllstoryArchive } = require('../controller/StoryController')
const { createComment, deleteComment, getComment } = require('../controller/CommentController')
const { createNotification, getNotifications, markAsRead, deleteNotification } = require('../controller/NofiticationController')
const upload = require('../middleware/upload')
const { sendMessage, getConversation } = require('../controller/MessageController')

const Router = express.Router()

Router.post('/api/CreateUser', CreateUSer)
Router.post('/api/login-user', loginUser)
Router.put('/api/update-user', updateUser)
Router.get('/api/get-table-user', getUserTable)
Router.delete('/api/DeleteUser', authMiddleware, authorize(['Admin']), deleteUser)
//SocialPost
// Router.post('/api/Create-Post', CreatePost)
Router.post('/api/Create-Post', upload.array('media', 10), CreatePost);
Router.put('/api/Update-Post', UpdateSocialPost)
Router.delete('/api/Delete-Post', DeletePost)
Router.get('/api/get-Post', getPost)
Router.post('/api/like-post', likePost)
//RelationShip
Router.post('/api/friend-Request', SendFriendRequest)
Router.post('/api/friend-accept', AcceptFriendRequest)
Router.post('/api/friend-reject', RejectFriendRequest)
Router.get('/api/friend-list', GetListFriend)
Router.get('/api/friend-suggestion', friendSuggestion)

//Story
Router.post('/api/Create-Story', CreateStory)
Router.delete('/api/Delete-Story', deleteStory)
Router.get('/api/get-Story-action', getAllstoryAction)
Router.get('/api/get-Story-archive', getAllstoryArchive)
//comment
Router.post('/api/Create-comment', createComment)
Router.get('/api/get-comment', getComment)
Router.delete('/api/delete-comment', deleteComment)
//Notifi
Router.post('/api/Create-notification', createNotification)
Router.get('/api/get-notification-user', getNotifications)
Router.post('/api/markAsRead-notification', markAsRead)
Router.delete('/api/delete-notification', deleteNotification)
//message
Router.post('/api/send-message', sendMessage)
Router.get('/api/get-conservation', getConversation)
module.exports = Router