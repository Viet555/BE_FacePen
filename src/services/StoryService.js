const connection = require("../config/configDB")
const createStoryService = async (data) => {
    try {
        if (!data.author || !data.media) {
            return ({
                Ec: -1,
                Mes: 'Missing author or media '
            })
        }
        const userExists = await connection.User.findById(data.author)
        if (!userExists) {
            return {
                Ec: -2,
                Mes: 'Author not found'
            }
        }
        const story = await connection.Story.create(
            {
                author: data.author,
                media: data.media,
                viewers: data.viewers || [],
                caption: data.caption || '',
                visibility: data.visibility || 'friends',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        )
        const storyArchive = await connection.StoryArchive.create(
            {
                author: data.author,
                media: data.media,
                viewers: data.viewers || [],
                caption: data.caption || '',
                visibility: data.visibility || 'friends',
                originalExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        )
        return {
            Ec: 0,
            Mes: 'Story created successfully',
        }
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
const deleteStoryService = async (storyId, action) => {
    try {
        if (!storyId || !action) {
            return ({
                Ec: -1,
                Mes: 'storyId or action is empty '
            })
        }
        let check = await connection.Story.findOne({ _id: storyId })
        if (!storyId) {
            return ({
                Ec: 2,
                Mes: 'Story not found'
            })
        }
        if (action === 'story') {
            let story = await connection.Story.deleteOne({ _id: storyId })
            return ({
                Ec: 0,
                Mes: 'delete story success',
                story
            })
        }
        if (action === 'storyArchive') {
            let story = await connection.StoryArchive.deleteOne({ _id: storyId })
            return ({
                Ec: 0,
                Mes: 'delete story Archive success',
                story
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
const getStoryActionService = async (userId) => {
    try {
        if (!userId) {
            return {
                Ec: -1,
                Mes: 'Missing userId'
            }
        }
        const friendsRel = await connection.RelationShip.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        })
        const friends = friendsRel.map(rel =>
            rel.requester.toString() === userId ? rel.recipient.toString() : rel.requester.toString()
        )
        const stories = await connection.Story.find({
            expiresAt: { $gt: new Date() },
            $or: [
                { visibility: 'public' },
                { visibility: 'friends', author: { $in: friends } },
                { author: userId }
            ]
        }).populate('author', 'firstName lastName')
            .sort({ createdAt: -1 })

        return {
            Ec: 0,
            Mes: 'Fetched stories',
            Data: stories
        }

    } catch (e) {
        console.log(e)
        return { Ec: -2, Mes: 'Internal server error' }
    }
}
const getAllstoryArchiveService = async (userId) => {
    try {
        if (!userId) {
            return {
                Ec: -1,
                Mes: 'Missing userId'
            }
        }
        const checkUser = await connection.User.findOne({ _id: userId })
        if (!checkUser) {
            return {
                Ec: -1,
                Mes: 'User not found '
            }
        }
        const storyArchive = await connection.StoryArchive.findOne({ author: userId })
        if (!storyArchive) {
            return {
                Ec: -1,
                Mes: 'story not found '
            }
        }
        return ({
            Ec: 0,
            Mes: ' get story success',
            data: storyArchive
        })
    } catch (error) {
        console.log(e)
        return { Ec: -2, Mes: 'Internal server error' }
    }
}
module.exports = { createStoryService, deleteStoryService, getStoryActionService, getAllstoryArchiveService }