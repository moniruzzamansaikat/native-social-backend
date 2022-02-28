const { checkAuth } = require('../utils/checkAuth');
const { db } = require('../utils/db');

const router = require('express').Router();

// fetch all users expect the current user 
router.get('/', checkAuth, async (req, res) => {
    try {
        console.log(req.user);
        let users = await db('users').whereNot('id', req.user.id);
        res.status(200).send(users);
    } catch (error) {
        const { message } = error;
        res.status(400).send(message);
    }
});

module.exports = router;