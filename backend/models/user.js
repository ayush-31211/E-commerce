const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    console.log(enteredPassword,flag,"Flag")
    return flag; 
}


userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id},process.env.SECRET,{
        expiresIn: process.env.JWT_TIME
    })
}

module.exports = mongoose.model('User',userSchema);