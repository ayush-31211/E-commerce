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

// Login User

exports.loginUser = async (req,res,next)=>{

    const {email,password} = req.body;
    try{ 
        if(!email||!password)
        {            
            throw Error("Please enter email and password");
        }
        const user = await User.findOne({email}).select('+password')
        console.log(user);
        if(!user)
        {            
            throw Error("Invalid Email");
        }
           
        const checkPassword = await user.checkPassword(password);
        console.log(checkPassword);
        if(!checkPassword)
        {
            throw Error("Invalid Password");
        }
        res.status(201).json({
            success: true,
            user
        })
    }
    catch(err)
    {
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}