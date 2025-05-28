const { createPostService, updateSocialPostService, deletePostService, getPostsService, likePostService } = require("../services/SocialPostService")
require('dotenv').config()
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8888';
const CreatePost = async (req, res) => {
    try {
        const { author, caption, visibility } = req.body
        const media = req.files.map((file) => ({
            url: `${backendUrl}/uploads/${file.filename}`,
            type: file.mimetype,
        }))

        const data = await createPostService({ author, caption, visibility, media })
        return res.status(200).json(data)
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server',
        })
    }
}
const UpdateSocialPost = async (req, res) => {
    try {
        let data = await updateSocialPostService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const DeletePost = async (req, res) => {
    try {
        id = req.query.id
        let data = await deletePostService(id)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const getPost = async (req, res) => {
    try {
        id = req.query.id
        let data = await getPostsService(id)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const likePost = async (req, res) => {
    try {
        postId = req.query.postId
        userId = req.query.userId
        let data = await likePostService(postId, userId)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
module.exports = { CreatePost, UpdateSocialPost, DeletePost, getPost, likePost }