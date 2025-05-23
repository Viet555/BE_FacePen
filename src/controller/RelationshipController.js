const { SendFriendRequestService, AcceptFriendRequestService, rejectFriendRequestService, getListFriend } = require("../services/RelationshipService")

const SendFriendRequest = async (req, res) => {
    try {
        const { requesterId, recipientId } = req.body
        const response = await SendFriendRequestService(requesterId, recipientId)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const AcceptFriendRequest = async (req, res) => {
    try {
        const { requesterId, recipientId } = req.body;
        let response = await AcceptFriendRequestService(requesterId, recipientId)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const RejectFriendRequest = async (req, res) => {
    try {
        const { requesterId, recipientId } = req.body;
        const response = await rejectFriendRequestService(requesterId, recipientId);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
const GetListFriend = async (req, res) => {
    try {
        const id = req.query.id
        const response = await getListFriend(id);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: 1,
            Mes: 'err from server'
        })
    }
}
module.exports = { SendFriendRequest, AcceptFriendRequest, RejectFriendRequest, GetListFriend }