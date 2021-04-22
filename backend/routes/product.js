const express = require('express');
const router = express.Router();

const {newProducts,getProducts, getSingleProduct, updateProduct, deleteProduct, addReview, getReview} = require('../controllers/productController');
const {isAuthenticatedUser} = require('../middleware/auth');

// Get all Products
router.route('/products').get(isAuthenticatedUser,getProducts);

// Add New Product
router.route('/admin/products/newProducts').post(newProducts);    

// Get Element By ID
router.route('/product/:id').get(getSingleProduct);    

// Update/Delete Element By ID
router.route('/admin/product/:id')
                                .put(updateProduct)
                                .delete(deleteProduct);    
                        
router.route('/review').put(isAuthenticatedUser,addReview);
router.route('/reviews').get(getReview);

                                

module.exports = router;