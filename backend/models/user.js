const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please enter your name']
    },
    email:{
        type: String,
        required: [true,'Please enter your email'],
        unique: [true, 'The email already exist'],
        validate: [validator.isEmail, 'Please enter valid email']
    },
    password:{
        type: String,
        required: [true,'Please enter your password'],
        minlength: [6,'Password is too short'],
        select: false,
    },
    // avatar:{
    //     public_id:{
    //         type: String,
    //         required: true
    //     },
    //     url:{
    //         type: String,
    //         required: true
    //     }
    // }
    role:{
        type: String,
        default: 'User'
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpire:{
        type: Date
    }

})
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.checkPassword = async function(enteredPassword){
    let flag = await bcrypt.compare(enteredPassword,this.password);
    //console.log(enteredPassword,flag,"Flag")
    return flag; 
}


userSchema.methods.generatePasswordToken = async function(){
    //generate token using crypto
    const resetToken = crypto.randomBytes(20).toString('hex');
    //console.log("Reset Token",resetToken);
    
    //hash token
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    //console.log("Hashed Token 1",hashedToken);
    //console.log("Hashed Token 2",crypto.createHash('sha256').update(resetToken).digest('hex'));
    this.resetPasswordToken = hashedToken;
    this.resetPasswordExpire = Date.now()+30*60*1000;
    
    return resetToken;

}



userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.SECRET,{
        expiresIn: process.env.JWT_TIME
    })
}

module.exports = mongoose.model('User',userSchema);