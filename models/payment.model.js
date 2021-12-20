const mongoose = require('mongoose');
const payment = new mongoose.Schema({
    vnp_Amount: {
        type: String
    },
    vnp_BankCode: {
        type: String
    },
    vnp_BankTranNo: {
        type: String
    },
    vnp_CardType: {
        type: String
    },
    vnp_OrderInfo: {
        type: String
    },
    vnp_PayDate: {
        type: String
    },
    vnp_userId:{
        type:String
    },
    status :{
        type:String      
    },
    type:{
        type:String
    },
    cart : {
        type:Object
    }

}, {
    timestamps: true
});
const paymentModel = mongoose.model('payment', payment)
module.exports = paymentModel
