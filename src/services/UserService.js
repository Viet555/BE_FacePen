const connection = require('../config/configDB');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

//CreateUser
const CreateUSerService = async (dataCreate) => {
    console.log(dataCreate)
    try {
        if (!dataCreate.firstName || !dataCreate.lastName || !dataCreate.email || !dataCreate.password) {
            return ({
                Ec: -1,
                Mes: 'Missing input , please check again '
            })
        }
        let checkEmail = await checkUserEmail(dataCreate.email)
        if (checkEmail === true) {
            return ({
                Ec: 1,
                Mes: 'email already isExist '
            })
        } else {
            let hashPasswordUser = await hashUserPassword(dataCreate.password)
            if (!dataCreate.RoleId) {
                dataCreate.RoleId = 'User'
            }
            let data = await connection.User.create({

                firstName: dataCreate.firstName,
                lastName: dataCreate.lastName,
                password: hashPasswordUser,
                email: dataCreate.email,
                roleId: dataCreate.roleId,
                avatar: dataCreate.avatar,
                gender: dataCreate.gender,

            })
            return ({
                Ec: 0,
                Mes: 'Create User Success'
            })
        }
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        };
    }
}
const checkUserEmail = async (Useremail) => {
    try {
        let user = await connection.User.findOne(
            { email: Useremail }
        )

        if (user) {
            return (true)

        } else {
            return (false)
        }
    } catch (e) {
        console.log(e)
    }
}
const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}
//login
const handleLogin = async (DataLogin) => {
    try {
        if (!DataLogin.email || !DataLogin.password) {
            return ({
                Ec: -1,
                Mes: 'Missing email or password please check again !'
            })
        }
        let CheckExist = await checkUserEmail(DataLogin.email)
        if (CheckExist) {
            let user = await connection.User.findOne(
                { email: DataLogin.email },
            )
            if (user) {
                let checkPass = await bcrypt.compareSync(DataLogin.password, user.password)
                if (checkPass) {
                    let userData = user.toObject();
                    delete userData.password;


                    let payload = ({
                        email: user.email,
                        role: user.roleId
                    })
                    let key = process.env.JWT_SECRET
                    user.status = 'active'
                    let token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRE })
                    // let refreshToken = jwt.sign(payload, key, { expiresIn: '7d' });
                    return ({
                        EC: 0,
                        MES: ' Login Sucess',
                        payloadToken: {
                            // refreshToken: refreshToken,
                            accessToken: token,
                        },
                        data: userData,

                    })

                }
                else {
                    return ({
                        Ec: 3,
                        Mes: `password wrong`
                    })
                }
            }
        } else {
            return ({
                Ec: 2,
                Mes: `Email don't exist `
            })
        }
    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        };
    }
}
//Update-user
const handleUpdateUser = async (dataUpdate) => {
    try {
        if (!dataUpdate._id) {
            return ({
                Ec: -1,
                Mes: 'missing input params'
            })
        }
        let user = await connection.User.findById(dataUpdate._id)
        if (!user) {
            return ({
                Ec: -2,
                Mes: 'user not found'
            })
        }
        let Update = {
            firstName: dataUpdate.firstName,
            lastName: dataUpdate.lastName,
            email: dataUpdate.email,
            roleId: dataUpdate.roleId,
            avatar: dataUpdate.avatar,
            gender: dataUpdate.gender,
        }
        if (dataUpdate.currentPassword) {
            //ss
            let isMatch = await bcrypt.compare(dataUpdate.currentPassword, user.password)
            if (!isMatch) {
                return ({
                    EC: -1,
                    MES: 'Mật khẩu hiện tại không chính xác'
                })
            } else {
                Update.password = await hashUserPassword(dataUpdate.newPassword)
            }
        }
        let User = await connection.User.findOneAndUpdate({
            _id: dataUpdate._id
        },
            Update,
        )
        if (!User) {
            return ({
                Ec: 3,
                Mes: 'User not found'
            })
        }
        return ({
            EC: 0,
            MES: 'User updated successfully',
            data: User
        });

    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        };
    }
}
const handleDeleteUser = async (UserId) => {
    try {
        if (!UserId) {
            return ({
                Ec: -1,
                Mes: 'Missing Id'
            })
        }
        let user = await connection.User.deleteOne({ _id: UserId })
        if (!user) {
            return ({
                Ec: 2,
                Mes: 'user not found'
            })
        }
        return ({
            Ec: 0,
            Mes: 'Delete User success'
        })

    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        };
    }
}
//get Table
const getTableUserService = async (limit, page) => {
    try {
        if (!limit || !page) {
            return {
                Ec: -1,
                Mes: 'Missing limit or page',
            };
        } else {
            let totalUsers = await connection.User.countDocuments()
            let totalPages = Math.ceil(totalUsers / limit)
            let dataUsers = await connection.User.find().sort({ createdAt: -1 }).limit(limit).select('-password').skip((page - 1) * limit)
            return (
                {
                    Ec: 0,
                    Mes: 'get tabel user Success',
                    data: dataUsers,
                    totalPages: totalPages,
                    currentPage: page
                }
            )
        }

    } catch (e) {
        console.log(e)
        return {
            Ec: -2,
            Mes: 'Internal server error',
        };
    }
}
module.exports = { CreateUSerService, handleLogin, handleUpdateUser, handleDeleteUser, getTableUserService }