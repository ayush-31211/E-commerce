const app = require('./app');
const connectDataBase = require('./config/database');
const dotenv = require('dotenv');


// Configuring Dev Environment
dotenv.config({path: 'backend/config/config.env'});


// Connecting to Database
connectDataBase();

app.listen(process.env.PORT,()=>{
        console.log(`Server Started at port ${process.env.PORT} in ${process.env.NODE_ENV} Mode`);
    }
)