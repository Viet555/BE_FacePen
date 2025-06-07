const connection = require("../config/configDB")

const sendMessageService = async (dataMes) => {
    try {
        const { senderId, receiverId, message, image } = dataMes
        if (!senderId || !receiverId || !message) {
            return ({
                Ec: -1,
                Mes: 'missing data'
            })
        }
        const newMes = await connection.Message.create({
            senderId,
            receiverId,
            message,
            image
        })
        return ({
            Ec: 0,
            Mes: 'send Message Success',
        })
    } catch (e) {
        console.log(e)
    }
}
const getConversationService = async (senderId, receiverId) => {
    try {
        if (!senderId || !receiverId) {
            return ({
                Ec: -1,
                Mes: 'missing senderId or receiverId'
            })
        }
        const dataMes = await connection.Message.find({
            $or: [
                { senderId: receiverId, receiverId: senderId },
                { senderId: senderId, receiverId: receiverId }
            ]
        }).sort({ createdAt: -1 })
        if (!dataMes || dataMes.length === 0) {
            return {
                Ec: -2,
                Mes: 'conservation not found'
            }
        }
        return {
            Ec: 0,
            Mes: 'success',
            dataMes
        }
    } catch (e) {
        console.log(e)
    }
}
module.exports = { sendMessageService, getConversationService }