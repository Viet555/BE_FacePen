const connection = require("../config/configDB")


const createNotificationService = async (dataNotification) => {
    try {
        const { senderId, receiverId, type, postId, commentId } = dataNotification
        if (!senderId || !receiverId || !type || !postId || !commentId) {
            return (
                {
                    Ec: -1,
                    Mes: 'Missing params'
                }
            )
        }
        const notification = await connection.Notification.create({
            senderId,
            receiverId,
            type,
            postId,
            commentId
        })
        return {
            Ec: 0,
            Mes: 'Success',
            notification
        };
    } catch (e) {
        console.log(e)
    }
}
const getNotificationService = async () => {
    try {

    } catch (e) {
        console.log(e)
    }
}
module.exports = { createNotificationService, getNotificationService }