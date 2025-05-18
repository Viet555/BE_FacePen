const jwt = require('jsonwebtoken');
const { CreateUSerService, handleLogin, handleUpdateUser, handleDeleteUser } = require('../services/UserService');
const CreateUSer = async (req, res) => {
    try {
        let response = await CreateUSerService(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: -1,
            Mes: 'err from server'
        }
        )
    }
}
const loginUser = async (req, res) => {
    try {
        let response = await handleLogin(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: -1,
            Mes: 'err from server'
        })
    }
}
const updateUser = async (req, res) => {
    try {
        let response = await handleUpdateUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: -1,
            Mes: 'err from server'
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        id = req.query.id
        console.log(id)
        let response = await handleDeleteUser(id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            Ec: -1,
            Mes: 'err from server'
        })
    }
}
module.exports = { CreateUSer, loginUser, updateUser, deleteUser }
