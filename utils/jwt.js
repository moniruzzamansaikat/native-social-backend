const jwt = require('jsonwebtoken');

exports.signToken = (user) => {
    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
    }, process.env.JWT_SECRET);

    return token;
}