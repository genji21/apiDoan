const mongoose = require('mongoose');
const hotel = new mongoose.Schema({
   
    name: {
        type: String
    },
    userId:{
        type:String,
        Default:""
        
    },
    rooms:{
        type:Array
    },
    image:{
        type:Array

    },
    rank:{
        type:Number
    },
    rating: {
        type: Number
    },
    numReview: {
        type: Number
    },
    location: {
        type: String
    },
    service: {
        type: Array
    },
    type: {
        type: String
    },

    thunhap :{
        type:Number
    }
}, {
    timestamps: true
});
const hotelModel = mongoose.model('hotel', hotel)
module.exports = hotelModel
