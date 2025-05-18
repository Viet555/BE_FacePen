const express = require('express');
const mongoose = require('mongoose');
const User = require('../model/User');

connection = mongoose.connect('mongodb://localhost:27017/FacePen', {

})
    .then(() => console.log('Connected to MongoDB Success'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


module.exports = { connection, User };
