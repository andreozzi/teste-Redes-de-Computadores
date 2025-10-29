const express = require('express');
const userController = require('../controller/favoriteController');


const router = express.Router();


router.post(`usuarioFav/:usuario`, 
    userController.inserirUsuario
)

module.exports = router

