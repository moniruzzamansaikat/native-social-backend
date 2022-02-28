require('dotenv').config();
require('./utils/db');
const express = require('express');
const cors = require('cors');

const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin: "*"
}));

if (process.env.NODE_ENV === 'development') {
    app.use(require('morgan')('dev'));
}

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/friends', require('./routes/friends'));
app.get("*", (req, res) => res.status(404).send({
    message: "Not Found"
}))

app.listen(process.env.PORT, () => {
    console.log(`🚀 server is running port ${process.env.PORT}`);
});