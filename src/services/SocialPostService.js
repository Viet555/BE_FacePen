const { default: mongoose } = require("mongoose")
const connection = require("../config/configDB")
const { createNotificationService } = require("./NotificationService")

const createPostService = async (dataCreate) => {
    try {
        const { author, caption, media, visibility } = dataCreate
        if (!author || !media || !media.length === 0) {
            return ({
                Ec: -1,
                Mes: "missing input "
            })
        }
        let checkAuthor = await connection.User.findById(author)
        if (checkAuthor) {
            const data = await connection.Post.create({
                author,
                media,
                caption: caption || '',
                visibility: visibility || 'public',
            })
            return ({
                Ec: 0,
                Mes: 'Create post success'
            })
        } else {
            return ({
                Ec: -1,
                Mes: 'author is not esxits'
            })
        }
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
//update
const updateSocialPostService = async (dataUpdate) => {
    try {
        // if (!dataUpdate) {
        //     return ({
        //         Ec: -1,
        //         Mes: 'Missing '
        //     })
        // }
        const { _id, author, caption, media, visibility, } = dataUpdate
        if (!_id) {
            return ({
                Ec: -1,
                Mes: 'Missing Id'
            })
        }
        const existingPost = await connection.Post.findById(_id)
        if (!existingPost) {
            return {
                Ec: -1,
                Mes: 'Post not found'
            }
        }
        let dataUp = await connection.Post.findByIdAndUpdate(
            _id,
            {
                author,
                caption: caption || existingPost.caption,
                media: media || existingPost.media,
                visibility: visibility || existingPost.visibility,
            }, { new: true }
        )
        return {
            Ec: 0,
            Mes: 'Update post success',
            Data: dataUp
        }

    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
//dele
const deletePostService = async (idPost) => {
    try {
        if (!idPost || !mongoose.Types.ObjectId.isValid(idPost)) {
            return {
                Ec: -1,
                Mes: 'Invalid or missing post ID'
            }
        }
        let post = await connection.Post.deleteOne({ _id: idPost })
        if (!post) {
            return ({
                Ec: 2,
                Mes: 'post not found'
            })
        }
        return ({
            Ec: 0,
            Mes: 'Delete post success'
        })
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
//get post
const getPostsService = async (userId) => {
    try {
        if (!userId) {
            return {
                Ec: -1,
                Mes: 'Missing userId'
            }
        }
        const friendRel = await connection.RelationShip.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        })

        const friends = friendRel.map(rel =>
            rel.requester.toString() === userId ? rel.recipient : rel.requester
        )

        const posts = await connection.Post.find({
            $or: [
                {
                    author: { $in: friends },
                    visibility: { $in: ['friends', 'public'] }
                },
                { visibility: 'public' }
            ]
        })
            .populate('author', 'firstName lastName avatar roleId')
            .sort({ createdAt: -1 })
            .limit(30)

        return {
            Ec: 0,
            Mes: 'Fetched posts',
            Data: posts
        }
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error'
        }
    }
}
const likePostService = async (postId, userId) => {
    try {
        if (!postId || !userId) {
            return {
                Ec: -1,
                Mes: 'missing postId or UserId'
            }
        }
        const post = await connection.Post.findById(postId)
        if (!post) {
            return {
                Ec: -2,
                Mes: 'Post not found'
            }
        }
        hasLike = post.likes.includes(userId)
        if (hasLike) {
            await connection.Post.updateOne(
                { _id: postId },
                { $pull: { likes: userId } }
            );
            return ({
                Ec: 0,
                Mes: 'unLike Success'
            })
        } else {
            await connection.Post.updateOne(
                { _id: postId },
                { $push: { likes: userId } }
            )
            if (post.author.toString() !== userId.toString()) {
                const notification = await createNotificationService({
                    senderId: userId,
                    receiverId: post.author.toString(),
                    type: 'like',
                    postId,
                    content: 'đã thích bài viết của bạn'
                })
            }
            return ({
                Ec: 0,
                Mes: 'Like Success'
            })
        }
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error'
        }
    }
}
module.exports = { createPostService, updateSocialPostService, deletePostService, getPostsService, likePostService }