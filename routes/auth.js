const router = require('express').Router();
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { checkAuth } = require('../utils/checkAuth')

// login 
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) throw new Error('No account with this username!');

        const matchedPassword = await user.comparePassword(password);
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
        let foundUser = await User.findOne({ username })
        if (foundUser) throw new Error('Username already exists!');

        // find user with same email
        foundUser = await User.findOne({ email })
        if (foundUser) throw new Error('Email already exists!');

        // create new user
        const newUser = new User({
            name,
            username,
            email,
            password
        });

        // save user
        const user = await newUser.save();
        const token = signToken(user);

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
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).send(user);
    } catch (error) {
        const { message } = error;
        res.status(400).send(message);
    }
});



module.exports = router;