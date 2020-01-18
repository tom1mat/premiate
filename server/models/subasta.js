const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subastaSchema = new Schema({
    title: String,
    dateString: String,
    ammount: Number,
    status: String,
    winnerId: String,
});

module.exports = mongoose.model('subastas', subastaSchema);