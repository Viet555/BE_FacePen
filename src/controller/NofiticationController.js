const { createNotificationService } = require("../services/NotificationService");
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
module.exports = { createNotification, getNotifications }