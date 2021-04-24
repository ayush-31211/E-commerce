const express = require('express');
const { newOrder, myOrder, getOrderById, allOrder, updateOrder, param } = require('../controllers/ordercontroller');
const router = express.Router();
const {isAuthenticatedUser, authorizedRoles} = require('../middleware/auth');

router.route('/order/newOrder').post(isAuthenticatedUser,newOrder);

router.route('/order/:id').get(isAuthenticatedUser,getOrderById);
router.route('/orders/me').get(isAuthenticatedUser,myOrder);

router.route('/admin/orders').get(isAuthenticatedUser,authorizedRoles('admin'),allOrder)
router.route('/admin/orders/:id').put(isAuthenticatedUser,authorizedRoles('admin'),updateOrder)

module.exports = router;

/**
 * TODO:
 * what is populate
 */