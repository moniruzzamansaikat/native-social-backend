const { checkAuth } = require('../utils/checkAuth');
const { db } = require('../utils/db');
const router = require('express').Router();

// get friends
router.get('/', checkAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const friends = await db('friends')
            .where({ userOne: userId })
            .select('id');
        const friendIds = friends.map(friend => friend.id);
        const users = await db('users')
            .whereIn('id', friendIds)
            .select('id', 'name', 'username');

        res.status(200).send(users);
    } catch (error) {
        let { message } = error;
        res.status(400).send(message);
    }
});

// send friend request
router.post('/send', checkAuth, async (req, res) => {
    const userOne = req.user.id;
    const { userId: userTwo } = req.body;
    try {
        if (!userTwo) throw new Error('User id is required');

        // check if user is already friends
        const isFriend = await db('friends').where({
            userOne,
            userTwo
        }).first();
        if (isFriend) throw new Error('User is already friends!');

        // check if user is already sent a friend request
        const isRequested = await db('friend_requests').where({
            userOne,
            userTwo
        }).first();
        if (isRequested) throw new Error('User is already requested!');

        // check if user is already requested to be friends
        const isRequesting = await db('friend_requests').where({
            userOne: userTwo,
            userTwo: userOne
        }).first();
        if (isRequesting) throw new Error('User is already requesting!');

        // insert friend request
        await db('friend_requests').insert({
            userOne,
            userTwo
        });

        res.status(200).send({
            success: true
        });
    } catch (error) {
        let { message } = error;
        res.status(400).send(message);
    }
});

// accept friend request
router.post('/accept', checkAuth, async (req, res) => {
    const userOne = req.user.id;
    const { userId: userTwo } = req.body;
    try {
        // check if user is already friends
        const isFriend = await db('friends').where({
            userOne,
            userTwo
        }).first();
        if (isFriend) throw new Error('User is already friends!');

        // check if user is already requested to be friends
        const isRequesting = await db('friend_requests').where({
            userOne: userTwo,
            userTwo: userOne,
        }).first();
        if (!isRequesting) throw new Error('User is not requesting!');

        // insert friend
        await db('friends').insert({
            userOne,
            userTwo
        });

        // delete friend request
        await db('friend_requests').where({
            userOne: userTwo,
            userTwo: userOne

        }).del();

        res.status(200).send({
            success: true
        });
    } catch (error) {
        let { message } = error;
        res.status(400).send(message);
    }
});

// get sent friend requests
router.get('/sent', checkAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const requests = await db('friend_requests').where({
            userOne: userId
        });
        res.status(200).send(requests);
    } catch (error) {
        let { message } = error;
        res.status(400).send(message);
    }
});

// get received friend requests
router.get('/received', checkAuth, async (req, res) => {
    const userId = req.user.id;
    try {
        const requests = await db('friend_requests').where({
            userTwo: userId
        });
        res.status(200).send(requests);
    } catch (error) {
        let { message } = error;
        res.status(400).send(message);
    }
});

// unfriend
router.post('/unfriend', checkAuth, async (req, res) => {
    const userOne = req.user.id;
    const { userId: userTwo } = req.body;
    try {
        // check if user is already friends
        const isFriend = await db('friends').where({
            userOne,
            userTwo
        }).first();
        if (!isFriend) throw new Error('User is not friends!');

        // delete friend
        await db('friends').where({
            userOne,
            userTwo
        }).del();

        res.status(200).send({
            success: true
        });
    } catch (error) {
        let { message } = error;
        res.status(400).send(message);
    }
});

// delete friend request
router.post('/delete', checkAuth, async (req, res) => {
    const userOne = req.user.id;
    const { userId: userTwo } = req.body;
    try {
        // check if user is already friends
        const isFriend = await db('friends').where({
            userOne,
            userTwo
        }).first();
        if (isFriend) throw new Error('User is already friends!');

        // check if user is already requested to be friends
        const isRequesting = await db('friend_requests').where({
            userOne: userTwo,
            userTwo: userOne
        }).first();
        if (!isRequesting) throw new Error('User is not requesting!');

        // delete friend request
        await db('friend_requests').where({
            userOne: userTwo,
            userTwo: userOne
        }).del();

        res.status(200).send({
            success: true
        });
    } catch (error) {
        let { message } = error;
        res.status(400).send(message);
    }
});

// cancel friend request
router.post('/cancel', checkAuth, async (req, res) => {
    const userOne = req.user.id;
    const { userId: userTwo } = req.body;
    try {
        // check if user is already friends
        const isFriend = await db('friends').where({
            userOne,
            userTwo
        }).first();
        if (isFriend) throw new Error('User is already friends!');

        // check if user is already requested to be friends
        const isRequested = await db('friend_requests').where({
            userOne,
            userTwo
        }).first();
        if (!isRequested) throw new Error('User is not requested!');

        // delete friend request
        await db('friend_requests').where({
            userOne,
            userTwo
        }).del();

        res.status(200).send({
            success: true
        });
    } catch (error) {
        let { message } = error;
        res.status(400).send(message);
    }
});



module.exports = router;