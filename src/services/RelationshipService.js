const { default: mongoose, set } = require("mongoose")
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
const friendSuggestionService = async (userId) => {
    try {
        if (!userId) {
            return {
                Ec: -1,
                Mes: 'missing UserId'
            }
        }
        const User = await connection.User.findById(userId)
        if (!User) {
            return {
                Ec: -2,
                Mes: 'user not found'
            }
        }
        const relationShip = await connection.RelationShip.find({
            $or: [
                { requester: userId },
                { recipient: userId },
            ]
        })
        const excludedIds = new Set([userId.toString()])
        relationShip.forEach(rel => {
            if (rel.status === 'accepted' || rel.status === 'pending') {
                excludedIds.add(rel.requester.toString())
                excludedIds.add(rel.recipient.toString())
            }
        })
        const sameCitySuggestions = await connection.User.find({
            _id: { $nin: Array.from(excludedIds) },
            adderss: User.adderss,
            // status: 'acctive'
        }).limit(8)
        const friendOfFriendIds = await getFriendsOfFriends(userId)
        const friendOfFriendSuggestions = await connection.User.find({
            _id: {
                $in: friendOfFriendIds.filter(id => !excludedIds.has(id.toString()))
            },
            status: 'active'
        }).limit(8)
        return {
            Ec: 0,
            Mes: 'get suucess',
            sameCitySuggestions,
            friendOfFriendSuggestions
        };
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        }
    }
}
const getFriendsOfFriends = async (userId) => {
    try {
        const relationShips = await connection.RelationShip.find(
            {
                $or: [
                    { requester: userId, status: 'accepted' },
                    { recipient: userId, status: 'accepted' }
                ]
            })
        const friendIds = relationShips.map(rel => {
            return rel.requester.toString() === userId.toString() ? rel.recipient.toString() : rel.requester.toString()
        })
        const friendOfFriendSet = new Set()
        for (const friendId of friendIds) {
            const friendRelationships = await connection.RelationShip.find({
                status: 'accepted',
                $or: [
                    { recipient: friendId },
                    { requester: friendId }
                ]
            })
            friendRelationships.forEach(rel => {
                const otherId = rel.requester.toString() === friendId ? rel.recipient.toString() : rel.requester.toString()
                if (otherId !== userId && !friendIds.includes(otherId)) {
                    friendOfFriendSet.add(otherId);
                }
            })
        }
        return Array.from(friendOfFriendSet).map(id => new mongoose.Types.ObjectId(id));

    } catch (e) {
        console.log(e)
    }
}
module.exports = { SendFriendRequestService, AcceptFriendRequestService, rejectFriendRequestService, getListFriend, friendSuggestionService }