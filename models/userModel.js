const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: true,
        trim: true
    },
    hotelId:{
        type:String,
        default:""
    },
    email:  {
        type: String,
        required: true,
        trim: true
    },
    password:  {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: Number,
        default: 0 
    },
    status: {
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
      },
    confirmationCode : {
        type : String,
        unique: true
    },
    cart: {
        type: Array,
        default: []
    },
    address:{
        type:String,
        default:""
    },
    phone:{
        type:String
    },
    avatar:{
        type:String
    },
    thunhap:{
        type:Number,
        default:0
    }
} , {
    timestamps: true
})
module.exports = mongoose.model('Users',userSchema)