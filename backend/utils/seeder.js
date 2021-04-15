const dotenv = require('dotenv');
const Product = require('../models/products');
const products = require('../data/product.json');
const connectDataBase = require('../config/database');

dotenv.config({path: 'backend/config/config.env'});

connectDataBase();

const seeder = async () => {
    try{
        await Product.deleteMany();
        console.log("Products Deleted");
        await Product.insertMany(products);
        console.log("Products Inserted");
        process.exit();
    }
    catch(err){
        console.log(err.message);
        process.exit();
    }
}
seeder();