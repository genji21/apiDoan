const Users = require('../models/userModel')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const { paymentModel } = require('../models');
const userModel = require('../models/userModel');
const option = {
    service: 'gmail',
    auth: {
        user: 'dinhphi751@gmail.com', // email hoặc username
        pass: 'Dinhtruongphi12345' // password
    }
};

const transporter = nodemailer.createTransport(option);
const userCtrl = {
register: async (req,res) =>{
  try{
    const {name,email,password} = req.body;
  
    const verifytoken = jwt.sign({email: req.body.email}, "bezkoder-secret-key")
    const user = await Users.findOne({email})
    
    const mail = {
        from: option.auth.user, // Địa chỉ email của người gửi
        to: email, // Địa chỉ email của người nhaan
        subject: 'Please confirm your account ', // Tiêu đề mail
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Cảm ơn bạn đã đăng kí , vui lòng click vào link dưới để kích hoạt tài khoản </p>
        <a href='http://localhost:3000/user/auth/verify/${verifytoken}'> Click here</a>
        </div>`, // Nội dung mail dạng wtext
    };
    if(user) return res.status(400).json({msg: "The Email already exits"})
    
    if(password.length < 6 ) return res.status(400).json({msg: "Password is at least 6 characters long "})

    // Password Encryption
    const passwordHash = await bcrypt.hash(password,10)
    const newUser = new Users({
        name,email,password:passwordHash,
        confirmationCode: verifytoken,
        status:'Pending'
    })
    // save mongo

    newUser.save(); 
    
      transporter.sendMail(mail, function(error, info) {
        if (error) { // nếu có lỗi
        } else { //nếu thành công
        }
    });
    // send mail
    
    // accessToken
   // accessToken
   
   
    res.json({msg:"Register Success",'confirmationCode':verifytoken})
}

  catch(err) {
      res.status(400).json({msg:err.message})
      return res.status(400).json({msg: err.message})
  }
},
login : async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await Users.findOne({email})
        if(!user) return res.status(400).json({msg:"User does not exit."})
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({msg:"Password is incorret"})
        // If login success,create accesstoken and refresh token
        const accesstoken = createAcessToken({id:user._id})
        const refreshtoken = createFreshToken({id:user._id})
        res.cookie('refreshtoken',refreshtoken,{
            httpOnly: true,
            path: '/user/refresh_token'
        })
        res.json({msg:"Login Success",acessToken:accesstoken})
      
       
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},  
verify : async(req,res)=>{
    try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token,"bezkoder-secret-key")

            const {name, email, password} = user

            const check = await Users.findOne({email})
            if(check.status === "Pending") {
                await Users.findOneAndUpdate({email},{status:"Active"})
                return res.json({msg : "Active account successfully"})
            }
            if(check.status === "Active") {
                return res.status(400).json({msg:"Your account has been activated"})
            }
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
},
getHistoryPayment: async (req,res) =>{
    
    try {
        console.log(req.query.id)
         const history = await paymentModel.find({vnp_userId: req.query.id})
         res.json({history})
    } catch (err) {
         return res.status(500).json({msg: err.message})
    }
},
  getUserInfor: async (req, res) => {

      try {
      const user = await Users.findById(req.user.id).select('-password')
      if(!user) return res.status(400).json({msg:"User does not exist"})
      const userToken = createAcessToken({user})
      res.json({user})
  } catch (err) {
      return res.status(500).json({msg: err.message})
  }
    },
    updateUser: async (req, res) => {
        try {
            const {name, image,phone,email,address} = req.body
            await Users.findOneAndUpdate({_id: req.user.id}, {
                name, avatar:image,phone,email,address
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {password,oldpass} = req.body
             const user = await Users.findById({_id:req.user.id})
             const isMatch = await bcrypt.compare(oldpass,user.password)
             if(isMatch){
                  const passwordHash = await bcrypt.hash(password,12)
                    await Users.findOneAndUpdate({_id: req.user.id}, {
                        password: passwordHash
                    })
           return res.json({msg: "Thay Đổi Mật Khẩu Thành Công "})

            }
            return res.status(400).json({msg:"Mật khẩu hiện tại không chính xác "})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    // admin
getAllUser: async (req,res)=>{
    try {
      const users =  await Users.find()
        res.json({users})
    } catch (error) {
        
    }
}
,getDetailUser:async(req,res)=>{
    try {
        console.log(req.body.id)
    const user = await Users.findById(req.body.id)
    if(!user)return res.status(400).json({msg:"Failed"}) 
      res.json({user})

    } catch (err) {
      return res.status(500).json({msg: err.message})
        
    }
}
,
UpdateUserAdmin:async (req,res)=>{
    try {
        const {email,name,phone} = req.body.data.data
        const user = await Users.findOneAndUpdate({_id:req.body.id},{email,name,phone})
        res.json({user})
    } catch (err) {
        return res.status(500).json({msg:err.message})
    }
},
DeleteUserAdmin : async(req,res)=>{
    try {
        console.log(req.params,req.body)
        // await Users.findByIdAndDelete({_id:req.params.idUser})
        res.json({msg:"delete success"})
    } catch (err) {
        return res.status(500).json({msg:err.message})
    }
}
}
const createAcessToken = (user) =>{
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECERT,{expiresIn: '1d'})
}
const createFreshToken = (user) =>{
    return jwt.sign(user,process.env.REFESH_TOKEN_SECERT,{expiresIn: '7d'})
}
module.exports = userCtrl