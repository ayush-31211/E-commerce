const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    shippingInfo:{
        address:{
            type: String,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        },
        postalCode:{
            type: Number,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        contactNo:{
            type: Number,
            required: true
        },
    },
    user:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref:'User'
    },
    orderItem:[
        {
            name:{
                type: String,
                required: true
            },
            price:{
                type: Number,
                required: true
            },
            unit:{
                type: Number,
                default: 1
            },
            product:{
                type: mongoose.Schema.ObjectId,
                required: true,
                ref:'Product'
            },
        }
    ],
    paymentInfo:{
        id:{
            type: String,
            required: true
        },
        status:{
            type: String,
        }
    },
    itemsPrice:{
        type: Number,
        default: 0.0
    },
    taxPrice:{
        type: Number,
        default: 0.0
    },
    shippingPrice:{
        type: Number,
        default: 50.0
    },
    totalPrice:{
        type: Number,
        default: 0.0
    },
    paidAt:{
        type: Date,
        default: Date.now()
    },
    orderStatus:{
        type: String,
        default: 'Processing'
    },
    deliveredAt:{
        type: Date,
        default: Date.now()
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
    
    
})

module.exports = mongoose.model('order',orderSchema);