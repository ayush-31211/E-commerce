const Order = require('../models/order')
const Product = require('../models/products')


// Create new order /api/v1/order/neworder
exports.newOrder = async(req,res,next) =>{
    const {
            orderItem,
            shippingInfo,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            paymentInfo
          } = req.body;

    orderItem.product = await Product.findById('6072f1b5ed896f3380cca80b')
    const order = await Order.create({orderItem,
                                        shippingInfo,
                                        itemsPrice,
                                        shippingPrice,
                                        taxPrice,
                                        totalPrice,
                                        paymentInfo,
                                        paidAt: Date.now(),
                                        user: req.user.id,
                                    })
    res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        order
    })
}

// Get Single Order /api/v1/order/:id

exports.getOrderById = async(req,res,next) =>{
    const order = await Order.findById(req.params.id);
    
    if(!order)
    {
        res.status(404).json({
            success: false,
            message: 'Order with ID not found'
        })
        return 
    }
    const populatedOrder = await (order).populated('user');
    res.status(200).json({
        success: true,
        order,
        populatedOrder
    })
}

// Get users order /api/v1/orders/me

exports.myOrder = async(req,res,next) =>{
    const orders = await Order.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
}



// Get users order /api/v1/admin/orders

exports.allOrder = async(req,res,next) =>{
    const orders = await Order.find();

    let totalPrice = 0;
    orders.forEach( order=>{
        totalPrice += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalPrice,
        length: orders.length,
        orders
    })
}

// Get users order /api/v1/admin/orders/:id

exports.updateOrder = async(req,res,next) =>{
    const order = await Order.findById(req.params.id);

    if(order.orderStatus=='Delivered')
    {
        res.status(200).json({
            success: false,
            message: 'Order already delivered',
            order
        })
        return;
    }
    order.orderItem.forEach(async(item)=>{
        await updateStock(item.product,item.unit);
    })
    order.orderStatus = req.body.status;
    if(order.orderStatus==='Delivered')
        order.deliveredAt = Date.now();
    
    await order.save();

    res.status(200).json({
        success: true,
        order
    })
}

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    
    await product.save({validateBeforeSave: false});
}
