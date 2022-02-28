const knex = require('knex');

exports.db = knex({
    client: "mysql",
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
});