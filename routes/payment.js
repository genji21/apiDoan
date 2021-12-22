var express = require('express');
var router = express.Router();
var $ = require('jquery');
var config = require('config')
const paymentController = require('../controllers/payment.controller');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const {
   ObjectId
} = require('mongodb')
const option = {
    service: 'gmail',
    auth: {
        user: 'dinhphi751@gmail.com', // email hoặc username
        pass: 'Dinhtruongphi12345!' // password
    }
};
const transporter = nodemailer.createTransport(option);
const { paymentModel } = require('../models');
const {hotelModel} = require('../models')
const userModel = require("../models/userModel")
    var querystring = require('qs');

router.get('/', paymentController.index);
router.get('/getPaymentId/:id', paymentController.show)
router.post("/createPayment",async function(req,res,next){
    const {cart,type} = req.body;
    console.log(req.body)
    const mail = {
        from: option.auth.user, // Địa chỉ email của người gửi
        to: cart.email, // Địa chỉ email của người nhaan
        subject: 'Xác Nhận Giao Dịch  ', // Tiêu đề mail
        html: `<h1>Xác Nhận Giao Dịch</h1>
        <h2>Hello </h2>
        <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi , hãy chuyển khoản vào số tài khoản ABCXYZ  để xác nhận việc đặt phòng </p>
        </div>`, // Nội dung mail dạng wtext
    };
    try {
        await paymentModel.create({
        type:cart.type,
        cart:{...cart},
        vnp_userId:cart.userId,
        status:"Chưa Thanh Toán "
        })
         transporter.sendMail(mail, function(error, info) {
        if (error) { // nếu có lỗi
            res.status(400).json({msg:error.message})
        } else { //nếu thành công
        }
    });
    res.json({cart})
    }  catch(err) {
      return res.status(400).json({msg: err.message})
  }
        

})
router.get('/create_payment_url', async function (req, res, next) {
   
    var dateFormat = require('dateformat');
    var date = new Date();
    var desc = 'Thanh toan don hang thoi gian: ' + dateFormat(date, 'yyyy-mm-dd HH:mm:ss');
    const {price,userId,ownerId,hotelid} = req.query
     res.render('order', {
        title: 'Tạo mới đơn hàng',
        description: desc,
        price,
        ownerId,
        hotelId:hotelid,
        userId
    })
});

router.post('/create_payment_url', function (req, res, next) {
    var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    var config = require('config');
    var dateFormat = require('dateformat');
    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');
    var vnpUrl = config.get('vnp_Url');
    var returnUrl = config.get('vnp_ReturnUrl');
    var date = new Date();
    var createDate = dateFormat(date, 'yyyymmddHHmmss');
    var orderId = dateFormat(date, 'HHmmss');
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    var userId = req.body.userId
    var hotelId = req.body.hotelId
    var ownerId = req.body.ownerId
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_userId'] = userId
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = userId.concat("|",hotelId+"|",ownerId);
    // console.log(vnp_Params['vnp_OrderInfo'])
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, {
        encode: false
    });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, {
        encode: false
    });

    res.redirect(vnpUrl)
});

router.get('/vnpay_return', async function (req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];
     const a =  vnp_Params['vnp_OrderInfo'].split("|")
            const userId = a[0]
            const hotelId = a[1]
            const ownerId = a[2]
    vnp_Params = sortObject(vnp_Params);
    var config = require('config');
    var tmnCode = config.get('vnp_TmnCode');
    var secretKey = config.get('vnp_HashSecret');

    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        if(typeof vnp_Params['vnp_OrderInfo'] === "string") {
           const hotelPrev = await hotelModel.findOne({_id:ObjectId(hotelId)})
           const payment = await  paymentModel.findOne({vnp_userId:userId})
        //    const user = await userModel.findOne({hotelId:hotelId})
            await hotelModel.findOneAndUpdate({_id:  ObjectId(hotelId)},{thunhap:Number(hotelPrev.thunhap) + Number(vnp_Params['vnp_Amount'])/100 })
            // await userModel.findOneAndUpdate({hotelId:hotelId},{thunhap:Number(user.thunhap) + Number(vnp_Params['vnp_Amount'])/100})
            await paymentModel.findOneAndUpdate({vnp_userId:userId},{status:"Đã Thanh Toán"})
              const mail = {
        from: option.auth.user, // Địa chỉ email của người gửi
        to: payment.cart.email, // Địa chỉ email của người nhaan
        subject: 'Xác Nhận Giao Dịch  ', // Tiêu đề mail
        html: `<h1>Giao Dịch Thành Công Đơn Hàng</h1>
        <h2>Xin Chào</h2>
        <p>Cảm ơn bạn đã chọn dịch vụ của chúng tôi , bạn đã đặt đơn phòng thành công vui lòng tời Hotel để làm thủ tục checkin  </p>
        </div>`, // Nội dung mail dạng wtext
    };
     transporter.sendMail(mail, function(error, info) {
        if (error) { // nếu có lỗi
            res.status(400).json({msg:error.message})
        } else { //nếu thành công
        }
    });
    res.render('success', {code: vnp_Params['vnp_ResponseCode'],title: 'Thành Công',redirec: config.get('redirec')})
        }


      
    } else{
        res.render('success', {code: '97',title: 'Thành Công'})
    }
});

router.get('/vnpay_ipn', function (req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    var config = require('config');
    var secretKey = config.get('vnp_HashSecret');
    var querystring = require('qs');
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");     
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
     

    if(secureHash === signed){
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
        res.status(200).json({RspCode: '00', Message: 'success'})
    }
    else {
        res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
    }
});

function sortObject(obj) {
	var sorted = {};
	var str = [];
	var key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;