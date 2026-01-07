const db = require('../config/db');

const findUserByEmail = async (email) => {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0];
};

const findUserForPasswordReset = async (email) => {
    const [users] = await db.query('SELECT id, email FROM users WHERE email = ?', [email]);
    return users[0];
};

const updateUserResetToken = async (id, resetToken, resetTokenExpiry) => {
    await db.query(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?',
        [resetToken, resetTokenExpiry, id]
    );
};

const clearUserResetToken = async (id) => {
    await db.query(
        'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [id]
    );
};

const findUserByResetToken = async (token) => {
    const [users] = await db.query(
        'SELECT id, reset_token, reset_token_expiry FROM users WHERE reset_token = ?',
        [token]
    );
    return users[0];
};

const updateUserPassword = async (id, hashedPassword) => {
    await db.query(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [hashedPassword, id]
    );
};

module.exports = {
    findUserByEmail,
    findUserForPasswordReset,
    updateUserResetToken,
    clearUserResetToken,
    findUserByResetToken,
    updateUserPassword,
};
