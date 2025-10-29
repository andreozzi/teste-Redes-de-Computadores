const users = []; // In-memory storage for favorite users

module.exports = {
    getUsers: () => users,

    addUser: (user) => {
        if (users.length >= 5) {
            throw new Error("You can only add up to 5 favorite users.");
        }
        if (users.some(u => u.login === user.login)) {
            throw new Error("User is already in your favorites.");
        }
        users.push(user);
        return user;
    },

    removeUser: (username) => {
        const initialLength = users.length;
        module.exports.setUsers(users.filter(user => user.login !== username));
        return users.length < initialLength; // Return true if a user was removed
    },

    toggleFavorite: (username) => {
        const userIndex = users.findIndex(user => user.login === username);
        if (userIndex === -1) {
            throw new Error("User not found in favorites.");
        }

        // Ensure only one user is favorite
        users.forEach(u => u.isFavorite = false);
        users[userIndex].isFavorite = !users[userIndex].isFavorite;
        return users[userIndex];
    },

    sortUsers: () => {
        users.sort((a, b) => a.login.localeCompare(b.login));
        return users;
    },

    setUsers: (newUsers) => {
        // Clear existing users and add new ones
        users.splice(0, users.length, ...newUsers);
    }
};
