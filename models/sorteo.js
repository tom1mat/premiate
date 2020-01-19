const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sorteoSchema = new Schema({
    idDetalle: String,
    sorteo: String,
    status: String
});

module.exports = mongoose.model('sorteos', sorteoSchema);