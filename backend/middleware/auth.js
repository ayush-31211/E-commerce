
// Check if user is authenticated or not

const jwt = require("jsonwebtoken");
const User = require("../models/user");

/**
 * This will be used to check if person is authorized to perform operation to products so it is part of product file not user file
 */



const isAuthenticatedUser = async (req,res,next)=>{

    const {token} = req.cookies;

    if (!token)
    {
        throw Error("Login First");
    }
    const decode = jwt.verify(token,process.env.SECRET)

    req.user = await User.findById(decode.id);
    
    next();



}
module.exports = isAuthenticatedUser;