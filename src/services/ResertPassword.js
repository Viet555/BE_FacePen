import connection from '../config/configDB';

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const routerPass = express.Router()
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    }
});
routerPass.post('/forgot-password', async (req, res) => {

    try {
        const { email } = req.body;
        const user = await connection.User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại!" });
        }


        const resetToken = uuidv4();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600;
        await user.save();


        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: '"FACEPEN 🥳🎉" <ngoqviet1011@gmail.com>',
            to: user.email,
            subject: "Đặt lại mật khẩu",
            text: `Nhấp vào liên kết để đặt lại mật khẩu: ${resetLink}`
        });

        res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửii!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});
routerPass.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await connection.User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ message: "Mật khẩu đã được đặt lại thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
});