const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['like', 'comment', 'friend_request', 'friend_accept'], required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    isRead: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 864000,
    },
    relationShipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Relationship', default: null },

}, {
    timestamps: true
});
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification
