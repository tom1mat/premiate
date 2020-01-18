const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sorteoSchema = new Schema({
    name: String,
    email: String,
    password: String,
    surname: String,
    avatar: String,
    credits: Number,
    creditsUsed: Number,
    googleData: Object,
    sorteos: Object,
    subastas: Object,
});

module.exports = mongoose.model('users', sorteoSchema);