const jwt = require('jsonwebtoken');

exports.signToken = (user) => {

    const token = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
    }, process.env.JWT_SECRET);

    return token;
}