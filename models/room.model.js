const mongoose = require('mongoose');
const room = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    image: {
        type: Array
    },
    bed: {
        type: Number
    },
    stock: {
        type: Number
    },
    categoryId: {
        type: String
    },
    ratting: {
        type: Number
    },
    sold: {
        type: Number
    },
}, {
    timestamps: true
});
const roomModel = mongoose.model('room', room)
module.exports = roomModel
