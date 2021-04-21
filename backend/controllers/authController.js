const User = require('../models/user');
const sendToken = require('../utils/jwtToken');

// Register User

exports.registerUser = async (req,res,next)=>{
    const {name,email,password} = req.body;
    console.log("BODY",req.body);
    try
    {
        const user = await User.create({name,email,password});
        const token = user.getJwtToken()

        sendToken(user,200,res);
    }
    catch(err)
    {
        res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

// Login User

exports.loginUser = async (req,res,next)=>{

    const {email,password} = req.body;
    try{ 
        if(!email||!password)
        {            
            throw Error("Please enter email and password");
        }
        const user = await User.findOne({email}).select('+password')
        console.log("User",user);
        if(!user)
        {            
            throw Error("Invalid Email");
        }
           
        const checkPassword = await user.checkPassword(password);
        if(!checkPassword)
        {
            throw Error("Invalid Password");
        }

        sendToken(user,200,res);

    }
    catch(err)
    {
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}




// logout the current user
exports.logoutUser = (req,res,next)=>{
    console.log("Logout")
    res.cookie('token',null,{expires:new Date(Date.now()),httpOnly:true});
    
    res.status(201).json({
        success: true,
        message: 'LogOut'
    })


}
