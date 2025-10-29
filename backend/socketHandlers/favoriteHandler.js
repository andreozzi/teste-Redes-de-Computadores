const favoriteRepository = require('../repository/favoriteRepository');
const axios = require('axios');

const GITHUB_API_BASE_URL = 'https://api.github.com';

module.exports = (io, socket) => {
    const emitFavorites = () => {
        const users = favoriteRepository.getUsers();
        socket.emit('favorites:update', users);
    };

    socket.on('favorites:get', () => {
        emitFavorites();
    });

    socket.on('favorites:add', async (username) => {
        try {
            const githubResponse = await axios.get(`${GITHUB_API_BASE_URL}/users/${username}`);
            const userData = githubResponse.data;

            const newUser = {
                id: userData.id,
                login: userData.login,
                name: userData.name,
                avatar_url: userData.avatar_url,
                html_url: userData.html_url,
                isFavorite: false,
            };

            favoriteRepository.addUser(newUser);
            io.emit('favorites:update', favoriteRepository.getUsers()); // Emit to all connected clients
        } catch (error) {
            let errorMessage = "Failed to add user to favorites.";
            if (error.message.includes("You can only add up to 5 favorite users.") || error.message.includes("User is already in your favorites.")) {
                errorMessage = error.message;
            } else if (error.response && error.response.status === 404) {
                errorMessage = "GitHub user not found.";
            }
            socket.emit('favorites:error', errorMessage);
        }
    });

    socket.on('favorites:remove', (username) => {
        try {
            favoriteRepository.removeUser(username);
            io.emit('favorites:update', favoriteRepository.getUsers());
        } catch (error) {
            socket.emit('favorites:error', "Failed to remove user from favorites.");
        }
    });

    socket.on('favorites:toggle', (username) => {
        try {
            favoriteRepository.toggleFavorite(username);
            io.emit('favorites:update', favoriteRepository.getUsers());
        } catch (error) {
            socket.emit('favorites:error', "Failed to toggle favorite status.");
        }
    });

    socket.on('favorites:sort', () => {
        try {
            favoriteRepository.sortUsers();
            io.emit('favorites:update', favoriteRepository.getUsers());
        } catch (error) {
            socket.emit('favorites:error', "Failed to sort favorite users.");
        }
    });
};
