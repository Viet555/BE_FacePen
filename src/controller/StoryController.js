const { createStoryService, deleteStoryService, getStoryActionService, getAllstoryArchiveService } = require("../services/StoryService")

const CreateStory = async (req, res) => {
    try {
        let result = await createStoryService(req.body)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const deleteStory = async (req, res) => {
    try {
        storyId = req.query.id
        let result = await deleteStoryService(storyId)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const getAllstoryAction = async (req, res) => {
    try {
        let id = req.query.id
        let result = await getStoryActionService(id)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const getAllstoryArchive = async (req, res) => {
    try {
        let id = req.query.id
        let result = await getAllstoryArchiveService(id)
        return res.status(200).json(result)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
module.exports = { CreateStory, deleteStory, getAllstoryAction, getAllstoryArchive }