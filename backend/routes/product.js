const express = require('express');
const router = express.Router();

const {newProducts,getProducts, getSingleProduct, updateProduct, deleteProduct} = require('../controllers/productController');

// Get all Products
router.route('/products').get(getProducts);

// Add New Product
router.route('/admin/products/newProducts').post(newProducts);    

// Get Element By ID
router.route('/product/:id').get(getSingleProduct);    

// Update/Delete Element By ID
router.route('/admin/product/:id')
                                .put(updateProduct)
                                .delete(deleteProduct);    

module.exports = router;