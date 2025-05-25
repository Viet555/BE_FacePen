const { createCommentService, deleteCommentService, getCommentsByPostService } = require("../services/CommentService")

const createComment = async (req, res) => {
    try {
        const response = await createCommentService(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: -1,
            Mes: 'err from sv'
        })
    }
}
const deleteComment = async (req, res) => {
    try {
        let commentId = req.query.commentId
        let userId = req.query.userId
        let response = await deleteCommentService(commentId, userId)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: -1,
            Mes: 'err from sv'
        })
    }
}
const getComment = async (req, res) => {
    try {
        let postId = req.query.postId
        let response = await getCommentsByPostService(postId)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: -1,
            Mes: 'err from sv'
        })
    }
}
module.exports = { createComment, deleteComment, getComment }