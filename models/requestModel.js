const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
   
    userId:{
        type:String,
        default:""
    },
    infor:{
        type:Object
    }
} , {
    timestamps: true
})
module.exports = mongoose.model('Request',userSchema)