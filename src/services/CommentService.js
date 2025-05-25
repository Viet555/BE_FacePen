const connection = require("../config/configDB")

const createCommentService = async (data) => {
    try {
        let { post, author, content, parentComment, likes } = data
        if (!post || !author || !content) {
            return ({
                Ec: -1,
                Mes: 'Missing input post or author or content !!! '
            })
        }
        const checkPost = await connection.Post.findById(post)
        if (!checkPost) {
            return {
                Ec: -2,
                Mes: 'Post is not exsits'
            }
        }
        if (parentComment) {
            const checkParent = await connection.Comment.findById(parentComment);
            if (!checkParent) {
                return {
                    Ec: -3,
                    Mes: 'Parent comment not found.'
                };
            }
        }
        const comment = await connection.Comment.create({
            post: post,
            author,
            content,
            parentComment: parentComment || null,
            likes: likes || [],
        })
        return {
            Ec: 0,
            Mes: 'Comment created',
            data: comment
        };
    } catch (e) {
        console.log(e)
    }
}
const deleteCommentService = async (commentId, userId) => {
    try {
        if (!commentId || !userId) {
            return {
                Ec: -1,
                Mes: 'Missing CommentId or UserId '
            }
        }
        let comment = await connection.Comment.findById(commentId)
        if (!comment) {
            return {
                Ec: -2,
                Mes: 'comment is not exsits'
            }
        }
        if (comment.author.toString() !== userId) {
            return { Ec: -2, Mes: 'Not authorized' };
        }
        await connection.Comment.deleteOne({ _id: commentId });

        return {
            Ec: 0,
            Mes: 'Comment deleted'
        };

    } catch (e) {
        console.log(e)
    }
}
//
const getCommentsByPostService = async (postId) => {
    try {
        if (!postId) {
            return { Ec: -1, Mes: "Missing postId" };
        }

        const allComments = await connection.Comment.find({ post: postId })
            .populate('author', 'username avatar')
            .lean();

        const rootComments = [];
        const repliesMap = {};

        allComments.forEach(comment => {
            comment.children = []
            if (!comment.parentComment) {
                rootComments.push(comment);
            } else {
                const parentId = comment.parentComment.toString();
                if (!repliesMap[parentId]) repliesMap[parentId] = [];
                repliesMap[parentId].push(comment);
            }
        });
        const attachReplies = (comments) => {
            comments.forEach(comment => {
                const id = comment._id.toString();
                comment.children = repliesMap[id] || [];
                attachReplies(comment.children);
            });
        };
        attachReplies(rootComments);

        return {
            Ec: 0,
            Mes: "Fetched comments successfully",
            data: rootComments
        };

    } catch (e) {
        console.log(e);
        return { Ec: -2, Mes: "Internal server error" };
    }
};

module.exports = { createCommentService, deleteCommentService, getCommentsByPostService }