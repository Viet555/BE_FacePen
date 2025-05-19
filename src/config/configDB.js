const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/User');
const Post = require('../model/SocialPost');

connection = mongoose.connect('mongodb://localhost:27017/FacePen', {

})
    .then(() => console.log('Connected to MongoDB Success'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


module.exports = { connection, User, Post };
