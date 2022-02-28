require('dotenv').config();
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

app.listen(process.env.PORT, () => {
    require('./utils/db');
    console.log(`🚀 server is running port ${process.env.PORT}`);
});