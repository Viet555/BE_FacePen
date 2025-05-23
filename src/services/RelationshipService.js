const connection = require("../config/configDB")

const SendFriendRequestService = async (requesterId, recipientId) => {
    try {
        if (!requesterId || !recipientId) {
            return ({
                Ec: -1,
                Mes: "Missing user ID"
            })
        }
        const Exsiting = await connection.RelationShip.findOne({
            requester: requesterId,
            recipient: recipientId
        })
        if (Exsiting) {
            return { Ec: 1, Mes: "Friend request already sent or exists" }
        }
        await connection.RelationShip.create({ requester: requesterId, recipient: recipientId })
        return {
            Ec: 0, Mes: "Friend request sent"
        }
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
const AcceptFriendRequestService = async (requesterId, recipientId) => {
    try {
        if (!requesterId || !recipientId) {
            return ({
                Ec: -1,
                Mes: "Missing user ID"
            })
        }

        const data = await connection.RelationShip.findOneAndUpdate(
            { requester: requesterId, recipient: recipientId, },
            { status: 'accepted' },
            { new: true }
        )
        if (!data) {
            return { Ec: 1, Mes: "No pending request found" }
        }
        // await connection.User.findByIdAndUpdate(requesterId, {
        //     $addToSet: { friends: recipientId }
        // });
        // await connection.User.findByIdAndUpdate(recipientId, {
        //     $addToSet: { friends: requesterId }
        // });
        return { Ec: 0, Mes: "Friend request accepted" }

    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
const rejectFriendRequestService = async (requesterId, recipientId) => {
    try {
        if (!requesterId || !recipientId) {
            return ({
                Ec: -1,
                Mes: "Missing user ID"
            })
        }
        const data = await connection.RelationShip.findOneAndUpdate(
            { requester: requesterId, recipient: recipientId, },
            { status: 'rejected' },
            { new: true }
        )
        if (!data) {
            return { Ec: 1, Mes: "No pending request found" }
        }
        return { Ec: 0, Mes: "Friend request rejected" }

    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
const getListFriend = async (userId) => {
    try {
        if (!userId) {
            return { Ec: -1, Mes: "Missing UserId" }
        }
        let data = await connection.User.findById(userId)
        if (data) {
            const accepted = await connection.RelationShip.find({
                $or: [
                    { requester: userId, status: 'accepted' },
                    { recipient: userId, status: 'accepted' }
                ]
            }).populate('requester recipient', 'firstName lastName avatar')
            const friends = accepted.map(rel =>
                rel.requester._id.toString() === userId ? rel.recipient : rel.requester)
            return { Ec: 0, Mes: "Friend list fetched", Data: friends }
        }
        else {
            return { Ec: -2, Mes: "User not found", }
        }

    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
module.exports = { SendFriendRequestService, AcceptFriendRequestService, rejectFriendRequestService, getListFriend }