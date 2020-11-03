const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    users : Array,
    chats : Array
})


module.exports = mongoose.model('Room' , roomSchema);