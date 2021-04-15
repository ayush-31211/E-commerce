const mongoose = require('mongoose');

// Connecting to DataBase
const connectDataBase = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true 
    }).then(con=>{
        console.log(`MongoDB connected at ${con.connection.host}`)
    });
}   
module.exports = connectDataBase;