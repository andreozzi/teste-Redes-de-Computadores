const favoriteRepository = require('../repository/favoriteRepository');
const axios = require('axios');

const GITHUB_API_BASE_URL = 'https://api.github.com';

exports.inserirUsuario = async (req, res) => {
    const { username } = req.params;

    try {
        const githubResponse = await axios.get(`${GITHUB_API_BASE_URL}/users/${username}`);
        const userData = githubResponse.data;

        const newUser = {
            id: userData.id,
            login: userData.login,
            name: userData.name,
            avatar_url: userData.avatar_url,
            html_url: userData.html_url,
            isFavorite: false, // Default to not favorite when added
        };

        const addedUser = favoriteRepository.addUser(newUser);
        res.status(201).json({ msg: "User added to favorites", user: addedUser });
    } catch (error) {
        if (error.message.includes("You can only add up to 5 favorite users.") || error.message.includes("User is already in your favorites.")) {
            return res.status(400).json({ msg: error.message });
        }
        console.error("Error adding user to favorites:", error);
        res.status(500).json({ msg: "Failed to add user to favorites." });
    }
};

exports.listarUsuarios = (req, res) => {
    try {
        const users = favoriteRepository.getUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error listing favorite users:", error);
        res.status(500).json({ msg: "Failed to list favorite users." });
    }
};

exports.removerUsuario = (req, res) => {
    const { username } = req.params;
    try {
        const removed = favoriteRepository.removeUser(username);
        if (removed) {
            res.status(200).json({ msg: "User removed from favorites." });
        } else {
            res.status(404).json({ msg: "User not found in favorites." });
        }
    } catch (error) {
        console.error("Error removing user from favorites:", error);
        res.status(500).json({ msg: "Failed to remove user from favorites." });
    }
};

exports.toggleFavorito = (req, res) => {
    const { username } = req.params;
    try {
        const updatedUser = favoriteRepository.toggleFavorite(username);
        res.status(200).json({ msg: "Favorite status toggled.", user: updatedUser });
    } catch (error) {
        if (error.message.includes("User not found in favorites.")) {
            return res.status(404).json({ msg: error.message });
        }
        console.error("Error toggling favorite status:", error);
        res.status(500).json({ msg: "Failed to toggle favorite status." });
    }
};

exports.ordenarUsuarios = (req, res) => {
    try {
        const sortedUsers = favoriteRepository.sortUsers();
        res.status(200).json({ msg: "Users sorted.", users: sortedUsers });
    } catch (error) {
        console.error("Error sorting favorite users:", error);
        res.status(500).json({ msg: "Failed to sort favorite users." });
    }
};
