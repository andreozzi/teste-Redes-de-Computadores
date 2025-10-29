const express = require('express');
const userController = require('../controller/userController');


const router = express.Router();


router.get(`/api/users/:username`, 
    userController.getUserByUsername
)

module.exports = router

