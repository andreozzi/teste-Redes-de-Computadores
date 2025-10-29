const express = require('express');
const favoriteController = require('../controller/favoriteController');
const userController = require('../controller/userController');


const router = express.Router();


router.post(`/api/favorites/:username`, 
    favoriteController.inserirUsuario
)

router.get(`/api/favorites`, 
    favoriteController.listarUsuarios
)

router.delete(`/api/favorites/:username`, 
    favoriteController.removerUsuario
)

router.put(`/api/favorites/:username/toggle`, 
    favoriteController.toggleFavorito
)

router.get(`/api/favorites/sort`, 
    favoriteController.ordenarUsuarios
)

router.get(`/api/users/:username`, 
    userController.getUserByUsername
)

module.exports = router

