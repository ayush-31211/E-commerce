const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please Enter the name of Product'],
        trim: true,
    },
    price:{
        type: Number,
        required: [true,'Please Enter the price of Product'],
        default: 0.0
    },
    description:{
        type: String,
        required: [true,'Please Enter the description of Product'],
        trim: true,
    },
    rating:{
        type: Number,
        default: 0
    },
    images:[
        {
            public_id: {
                type: String,
                // required: [true,'Please Enter the publicID of the image']
            },
            imageUrl:{
                type: String,
                // require: true
            }
        }
    ],
    category:{
        type: String,
        required: [true,'Please Enter the category of Product'],
        enum:{
            values:[
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Book',
                'Clothes/Shoe',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home',
                'Other'
            ], 
            message :'Please select the correct category'
        }
    },
    seller:{
        type: String,
        required: [true,'Please Enter the name of seller for the Product'],
        trim: true,
    },
    stock:{
        type: Number,
        required: [true,'Please enter the stock of the product'],
        default: 0
    },
    numOfReviews:{
        type: Number,
        default: 0,
    },
    reviews:[
        {
            user: {
                type:String,
                required: [true,'Enter the name of user']
            },
            comment:{
                type: String,
                required: true,
            },
            rating:{
                type: Number,
                default: 0
            }
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    }   


})

module.exports = mongoose.model('Product',productSchema);