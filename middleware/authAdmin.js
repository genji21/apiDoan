const Users = require('../models/userModel')

const authAdmin = async (req, res, next) =>{
    try {
        // Get user information by id
        console.log(req.body.user.id)
        const user = await Users.findOne({
            _id: req.body.user.id
        })
        if(user.role !== 1)
            return res.status(400).json({msg: "Admin resources access denied"})

        next()
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin