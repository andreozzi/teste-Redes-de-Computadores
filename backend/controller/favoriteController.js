const axios = require('axios');
const userController = require('./userController'); // Import userController
let usuariosFavoritos = []; // Use let to allow reassigning for sorting

const inserirUsuario = async (req, res) => {
    const { username } = req.params;

    if (usuariosFavoritos.some((perfil) => perfil.login === username)) {
        return res.status(400).json({
            msg: "Usuário já está na lista"
        });
    }

    try {
        // Use the getUserByUsername from userController to fetch user data
        const userResponse = await userController.getUserByUsernameInternal(username);
        if (userResponse.status !== 200) {
            return res.status(userResponse.status).json({ msg: userResponse.message });
        }
        const userData = userResponse.user;
        const user = {
            id: userData.id,
            login: userData.login,
            avatar_url: userData.avatar_url,
            html_url: userData.html_url,
            name: userData.name || userData.login,
            isFavorite: true // Mark as favorite by default when added
        };
        
        usuariosFavoritos.push(user);
        
        console.log(user);
        return res.status(201).json({
            msg: "Usuário inserido com sucesso!",
            user
        });
    } catch (err) {
        console.error("Error in inserirUsuario:", err);
        return res.status(500).json({ msg: "Internal Server Error", error: err.message });
    }
};

const listarUsuarios = (req, res) => {
    return res.status(200).json(usuariosFavoritos);
};

const removerUsuario = (req, res) => {
    const { username } = req.params;
    const initialLength = usuariosFavoritos.length;
    usuariosFavoritos = usuariosFavoritos.filter(user => user.login !== username);

    if (usuariosFavoritos.length < initialLength) {
        return res.status(200).json({ msg: "Usuário removido com sucesso!" });
    } else {
        return res.status(404).json({ msg: "Usuário não encontrado na lista de favoritos." });
    }
};

const toggleFavorito = (req, res) => {
    const { username } = req.params;
    const userIndex = usuariosFavoritos.findIndex(user => user.login === username);

    if (userIndex > -1) {
        usuariosFavoritos[userIndex].isFavorite = !usuariosFavoritos[userIndex].isFavorite;
        return res.status(200).json({
            msg: "Status de favorito atualizado com sucesso!",
            user: usuariosFavoritos[userIndex]
        });
    } else {
        return res.status(404).json({ msg: "Usuário não encontrado na lista de favoritos." });
    }
};

const ordenarUsuarios = (req, res) => {
    usuariosFavoritos.sort((a, b) => a.login.localeCompare(b.login));
    return res.status(200).json({
        msg: "Usuários ordenados com sucesso!",
        users: usuariosFavoritos
    });
};

module.exports = {
    inserirUsuario,
    listarUsuarios,
    removerUsuario,
    toggleFavorito,
    ordenarUsuarios
};