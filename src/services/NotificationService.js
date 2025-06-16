const connection = require("../config/configDB")
const { getIO } = require("../socket")
const createNotificationService = async (dataNotification) => {
    try {

        const { senderId, receiverId, type, postId, commentId, relationShipId } = dataNotification
        if (!senderId || !receiverId || !type) {
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
            commentId,
            relationShipId
        })
        if (receiverId) {
            getIO().to(receiverId.toString()).emit("new-notification", notification);
        }
        return {
            Ec: 0,
            Mes: 'Success',
            notification
        };
    } catch (e) {
        console.log(e)
    }
}
const getNotificationService = async (userId) => {
    try {
        if (!userId) {
            return {
                Ec: -1,
                Mes: 'Missing user ID'
            }
        }
        let notification = await connection.Notification.find({ receiverId: userId }).sort({ createdAt: -1 }).limit(20).populate('senderId').populate('relationShipId', 'status')
        if (!notification) {
            return ({
                Ec: -2,
                Mes: 'Notification not found'
            })
        }
        return ({
            Ec: 0,
            Mes: 'get notification success',
            data: notification
        })
    } catch (e) {
        console.log(e)
    }
}
const markAsReadService = async (notiId) => {
    try {
        if (!notiId) {
            return {
                Ec: -1,
                Mes: 'Missing notification ID'
            }
        }
        let updateNoti = await connection.Notification.findByIdAndUpdate(notiId, { isRead: true })
        if (!updateNoti) {
            return ({
                Ec: -2,
                Mes: 'Notification not found'
            })
        }
        return ({
            Ec: 0,
            Mes: 'success',
        })
    } catch (e) {
        console.log(e)
    }
}
module.exports = { createNotificationService, getNotificationService, markAsReadService }