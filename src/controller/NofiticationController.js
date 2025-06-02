const connection = require("../config/configDB");
const { createNotificationService, getNotificationService, markAsReadService } = require("../services/NotificationService");
const { getIO } = require("../socket");

const createNotification = async (req, res,) => {
    try {

        const notification = await createNotificationService(req.body);
        console.log(req.body.receiverId)
        const receiverId = req.body.receiverId;
        if (receiverId) {
            getIO().to(receiverId).emit("new-notification", notification);
        }
        return res.status(200).json(notification);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            EC: -1,
            Mes: 'Server error'
        });
    }
}
const getNotifications = async (req, res) => {
    try {
        const userId = req.query.userId;
        const notifications = await getNotificationService(userId);
        return res.status(200).json(notifications);
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            EC: -1,
            EM: 'Server error'
        });
    }
}
const markAsRead = async (req, res) => {
    try {
        let notiId = req.query.notiId
        let response = await markAsReadService(notiId)
        res.status(200).json(response)
    } catch (e) {
        console.log(e)
        res.stauts(500).json({
            Ec: -1,
            Mes: 'err form server'
        })
    }
}
const deleteNotification = async (req, res) => {
    try {
        let notiId = req.query.notiId
        if (!notiId) return ({ Ec: -1, Mes: 'missing notifi Id' })
        let response = await connection.Notification.findByIdAndDelete(notiId)
        if (!response) {
            return {
                Ec: -2,
                Mes: 'notifi not found'
            }
        }
        res.status(200).json({ Ec: 0, Mes: 'Delete success' })
    } catch (e) {
        console.log(e)
        res.stauts(500).json({
            Ec: -1,
            Mes: 'err form server'
        })
    }
}
module.exports = { createNotification, getNotifications, markAsRead, deleteNotification }