const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CharityApplication = mongoose.model('CharityApplication');

router.post('/charity_application',);

router.get('/charity_application',);

router.get('/charity_application/:id',);

router.put('/charity_application/:id',);

router.delete('/charity_application/:id',);

module.exports = router;