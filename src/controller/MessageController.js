const { sendMessageService, getConversationService } = require("../services/MessageService")
const { getIO } = require("../socket")

const sendMessage = async (req, res) => {
    try {
        let newMessage = await sendMessageService(req.body)
        let receiverId = req.body.receiverId
        if (receiverId) {
            getIO().to(receiverId).emit('receive_message', newMessage)
        }
        return res.status(200).json(newMessage)
    } catch (e) {
        console.log(e)
        return res.status(400).json({ Ec: -1, Mes: 'err form sv' })
    }
}
const getConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query;
        const conversation = await getConversationService(senderId, receiverId);
        return res.status(200).json(conversation);
    } catch (e) {
        console.log(e)
        return res.status(500).json(
            { Ec: -1, Mes: 'err form sv' }
        )
    }
}
module.exports = { sendMessage, getConversation }