const User = require('../models/user');

// Register User

exports.registerUser = async (req,res,next)=>{
    const {name,email,password} = req.body;
    console.log("BODY",req.body);
    try
    {
        const user = await User.create({name,email,password});
        const token = user.getJwtToken()
        res.status(201).json({
            success:true,
            user,
            token
        });
    }
    catch(err)
    {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}