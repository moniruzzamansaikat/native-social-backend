const { Schema, model, } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserScema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        unique: true
    },
    password: String,
}, {
    timestamps: true
});

// hash password before saving
UserScema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
});

// compare password
UserScema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = model('User', UserScema);
module.exports = User;
