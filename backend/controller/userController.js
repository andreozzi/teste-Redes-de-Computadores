
const axios = require('axios');

exports.getUserByUsername = async (req, res) => {
    const username = req.params.username;
    console.log(`Fetching user: ${username}`);
    try {
        const githubResponse = await axios.get(`https://api.github.com/users/${username}`);
        const userData = githubResponse.data;
        const user = {
            id: userData.id,
            login: userData.login,
            avatar_url: userData.avatar_url,
            html_url: userData.html_url,
            name: userData.name || userData.login, // Use login if name is not available
        };
        res.status(200).json(user);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ message: 'GitHub user not found.' });
        } else {
            console.error('Error fetching user from GitHub:', error.message);
            res.status(500).json({ message: 'Error fetching user data.' });
        }
    }
};

exports.getUserByUsernameInternal = async (username) => {
    try {
        const githubResponse = await axios.get(`https://api.github.com/users/${username}`);
        const userData = githubResponse.data;
        const user = {
            id: userData.id,
            login: userData.login,
            avatar_url: userData.avatar_url,
            html_url: userData.html_url,
            name: userData.name || userData.login, // Use login if name is not available
        };
        return { status: 200, user: user };
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return { status: 404, message: 'GitHub user not found.' };
        } else {
            console.error('Error fetching user from GitHub (internal):', error.message);
            return { status: 500, message: 'Error fetching user data.' };
        }
    }
};
