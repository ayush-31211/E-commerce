const Products = require('../models/products')
const APIFeatures = require('../utils/apiFeatures');

// Create Products => /api/v1/products/newProducts

exports.newProducts = async(req,res,next)=>{
    //console.log(req);
    const product = await Products.create(req.body);
    res.status(201).json({
        success: true,
        product,
    })
}



// Get all products   =>   /api/v1/products?keyword=apple

exports.getProducts = async(req,res,next)=>{

    const resPerPage = 4;
    const apiFeatures = new APIFeatures(Products.find(),req.query).search().filter();
    let product = await apiFeatures.query;
    let filteredProductsCount = product.length;

    apiFeatures.pagination(resPerPage)
    product = await apiFeatures.query;


    res.status(200).json({
        success: true,
        productsCount: product.length,
        resPerPage,
        filteredProductsCount,
        product
    })

};


// Get single product =>api/v1/products/:id

exports.getSingleProduct = async(req,res,next)=>{

    let product;
    try{
        product = await Products.findById(req.params.id);
    }
    catch(err)
    {
        return res.status(400).json({
            success: false,
            message: err.message,
            id: req.params.id
        })
    }
    if(!product)
    {
        return res.status(404).json({
            success: false,
            message: 'Product not Found',
        })
    }
    res.status(404).json({
        success: true,
        product
    })

}

// Update Product =>api/v1/products/:id

exports.updateProduct = async(req,res,next) => {
    let product;
    try{
        product = await Products.findById(req.params.id);
    }
    catch(err)
    {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
    if(!product)
    {
        return res.status(404).json({
            success: false,
            message: 'Product not Found',
        })
    }

    product = await Products.findByIdAndUpdate(req.params.id,req.body,{
        new: true,
        runValidator: true,
        useFindandModify: false,
    });



    res.status(404).json({
        success: true,
        product
    })


}

// Delete Product =>api/v1/admin/product/:id

exports.deleteProduct= async(req,res,next)=>{
    let products;
    try{
        products = await Products.findById(req.params.id);
        //console.log("PRODUCT");
        //console.log(products);
        //console.log(typeof(products))
    }
    catch(err)
    {
        res.status(400).json({
            success: false,
            message: err.message,
        })
    }
    
    if(!products)
    {
        return res.status(404).json({
            success: false,
            message: 'Product not Found',
        })
    }
    // remove vs deleteOne is remove is depreceated
    products = await Products.findByIdAndDelete(req.params.id);
    //await products.remove();
    res.status(200).json({
        success: true,
        products
    })

}






// create new review /api/v1/review

exports.addReview = async (req,res,next) =>{
    const {rating, comment, productId} = req.body;

    const review = { 
        user:req.user.id,
        name:req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Products.findById(productId);
    const isReviewed = product.reviews.find( r => {const flag=r.user.toString()===req.user.id.toString(); return flag} )
    if(isReviewed)
    {
        product.reviews.forEach( review => {
            if(review.user.toString()===req.user.id.toString())
            {
                review.comment = comment;
                review.rating = rating; 
            }
        });
    }
    else
    {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length   
    }
    product.rating = product.reviews.reduce((acc,item)=> item.rating + acc,0)/product.reviews.length;


    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true,
        product
    })


}

// get product review /api/v1/reviews

exports.getReview = async(req,res,next) =>{
    const product = await Products.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}


// delete Review /api/v1/review
exports.deleteReview = async(req,res,next) =>{
    const product = await Products.findById(req.query.product_id);

    const reviews = product.reviews.filter(review => review._id.toString()!==req.query.review.id.toString());
    product.reviews = reviews;
    product.rating = product.review.reduce((acc,item)=> item.rating + acc,0)/product.review.length;


    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        reviews: product.reviews, 
        product
    })

}