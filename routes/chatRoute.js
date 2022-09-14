const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ChatRelation = mongoose.model('ChatRelation');
const ChatRecord = mongoose.model('ChatRecord');
const requiredLogin = require('../middlewares/requiredLogin');

module.exports = router;