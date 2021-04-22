const User = require('../models/user');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');


// Register User

exports.registerUser = async (req,res,next)=>{
    const {name,email,password} = req.body;
    console.log("BODY",req.body);
    try
    {
        const user = await User.create({name,email,password});

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


// resetPassword /api/v1/password/reset/:token
exports.resetPassword = async(req,res,next) =>{
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: req.params.id,
        resetPasswordExpire: { $gt: Date.now()}
    })

    if(!user)
    {
        throw Error("Password Token is invalid");
    }
    
    if(req.body.password !==req.body.confirmPassword)
    {
        res.status(500).json({
            success: false,
            message: 'Passwords not matched'
        })
        return 
    }

    user.password = req.body.password;
    
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});

    sendToken(user,200,res);

}


// forgotPassword /api/v1/password/forgot

exports.forgotPassword = async(req,res,next) => {

    if(!req.body.email)
    {
        res.status(500).json({
            success: false,
            message: 'Enter the email'
        })
        return
    }

    const user = await User.findOne({ email: req.body.email });
    
    if(!user)
    {
        res.status(404).json({
            success: false,
            message:'Email doesnot exist'
        })
        return
    }   

    // get JWT token
    const resetToken = await user.generatePasswordToken();
    await user.save({validateBeforeSave: false});

    // Create Password Url
    const URL = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`
    console.log("URL",URL)
    const message = `Your link to reset the password is\n\n${URL}\n\n If you have not requested, then please ignore the mail`;

    try{
        await sendEmail({
            email: user.email,
            subject: 'Ecom password recovery',
            message
        })
        res.status(200).json({
            success: true,
            message: 'Email send to ' + user.email
        })
    }
    catch(error)
    {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save({validateBeforeSave: false});

        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



// Get logged in user

exports.getUserProfile = async(req,res,next) =>{
    const user = await User.findById(req.user.id);

    if(!user)
    {
        res.status(502).json({
            success: false,
            message: 'No user Found',
        })
        return
    }
    res.status(200).json({
        success: true,
        user
    })
}


// Update Password

exports.updatePassword = async(req,res,next) =>{
    const user = await User.findById(req.user.id).select('+password')
    const isMatched = await user.checkPassword(req.body.oldPassword);
    if(!isMatched)
    {
        res.status(500).json({
            success: false,
            message: 'Old Password not matched'
        })
        return
    }
    user.password = req.body.password;
    await user.save();
    sendToken(user,201,res);
}


// update user profile 

exports.updateProfile = async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    if(!user)
    {
        
        res.status(500).json({
            success: false,
            message: "User doesn't exist"
        })
        return
    }

    const newData = {
        name: req.user.name,
        email: req.email.email
    }

    //TODO: update Avatar

    user = await User.findByIdAndUpdate(req.user.id,newData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "User Updated",
        user
    })
}







// logout the current user
exports.logoutUser = (req,res,next)=>{
    console.log("Logout")
    res.cookie('token',null,{expires:new Date(Date.now()),httpOnly:true});
    
    res.status(201).json({
        success: true,
        message: 'Logout'
    })


}


/** 
 * TODO:
 * check getUserProfile works
 * check update password
 * check update user
 *
 */