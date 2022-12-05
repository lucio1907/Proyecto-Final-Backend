const userUnauthorized = (res) => {
    const error = new Error('Unauthorized, only administrator');
    return res.status(401).json({ msg: error.message });
}

module.exports = userUnauthorized;