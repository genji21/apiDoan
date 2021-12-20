const Request = require("../models/requestModel")
const requestModel = require("../models/requestModel")
const requestCtrl = {
    createRequest : async (req,res) =>{
        try { 
            const newRequest = new requestModel({
                userId:req.body.userid,
                infor:req.body.infor

    })
     newRequest.save();
     res.json({msg:"Send request success"})
        } catch (error) {
            
        }
    }
}
module.exports = requestCtrl