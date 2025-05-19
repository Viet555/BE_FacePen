const { createPostService, updateSocialPostService, deletePostService } = require("../services/SocialPostService")

const CreatePost = async (req, res) => {
    try {
        let data = await createPostService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
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
module.exports = { CreatePost, UpdateSocialPost, DeletePost }