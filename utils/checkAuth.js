const jwt = require('jsonwebtoken')

exports.checkAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).send('Unauthorized');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized');
        }

        req.user = decoded;
        next();
    });
} 