const connection = require("../config/configDB")
const createNotificationService = async (dataNotification) => {
    try {
        const { senderId, receiverId, type, postId, commentId } = dataNotification
        if (!senderId || !receiverId || !type || !postId) {
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
const getNotificationService = async (userId) => {
    try {
        if (!userId) {
            return {
                Ec: -1,
                Mes: 'Missing user ID'
            }
        }
        let notification = await connection.Notification.find({ receiverId: userId }).sort({ createdAt: -1 }).limit(20)
        if (!notification) {
            return ({
                Ec: -2,
                Mes: 'Notification not found'
            })
        }
        return ({
            Ec: 0,
            Mes: 'get notification success',
            notification
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