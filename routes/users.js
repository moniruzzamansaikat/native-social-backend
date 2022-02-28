const User = require('../models/User');
const { checkAuth } = require('../utils/checkAuth');

const router = require('express').Router();

// fetch all users expect the current user
router.get('/', checkAuth, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } });
        res.status(200).send(users);
    } catch (error) {
        const { message } = error;
        res.status(400).send(message);
    }
});

module.exports = router;