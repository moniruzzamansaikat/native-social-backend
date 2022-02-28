const router = require('express').Router();
const { signToken } = require('../utils/jwt');
const { checkAuth } = require('../utils/checkAuth');
const { db } = require('../utils/db');
const bcrypt = require('bcryptjs');

// login 
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db('users').where({ username }).first();
        if (!user) throw new Error('No account with this username!');

        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) throw new Error('Password is incorrect');

        const token = signToken(user);

        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        const { message } = error;
        res.status(400).send(message);
    }
})

// register
router.post('/register', async (req, res) => {
    const { name, username, email, password, password2 } = req.body;

    try {
        if (!name) throw new Error('Name is required!');
        if (!username) throw new Error('Username is required!');
        if (!email) throw new Error('Email is required!');
        if (!password) throw new Error('Password is required!');
        if (password.length < 6) throw new Error('Password must be at least 6 characters long!');
        if (password !== password2) throw new Error('Passwords do not match!');

        // find user with same username
        let foundUser = await db('users').where({ username }).first();
        if (foundUser) throw new Error('Username already exists!');

        // find user with same email
        foundUser = await db('users').where({ email }).first();
        if (foundUser) throw new Error('Email already exists!');

        // create new user
        const newUser = {
            name,
            username,
            email,
            password: await bcrypt.hash(password, 10)
        };

        // insert user 
        const id = await db('users').insert(newUser);
        const token = signToken({ id, ...newUser });

        res.status(201).json({
            success: true,
            token
        });
    } catch (error) {
        const { message } = error;
        res.status(400).send(message);
    }
})

// fetch user data
router.get('/me', checkAuth, async (req, res) => {
    try {
        const user = await db('users').where({ id: req.user.id }).first();
        res.status(200).send(user);
    } catch (error) {
        const { message } = error;
        res.status(400).send(message);
    }
});



module.exports = router;