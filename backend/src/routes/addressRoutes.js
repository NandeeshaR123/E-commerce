const express = require('express');
const { 
    getAddresses, 
    createAddress, 
    updateAddress, 
    deleteAddress,
    getAddressById 
} = require('../controllers/addressController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAddresses);
router.get('/:addressId', authMiddleware, getAddressById);
router.post('/', authMiddleware, createAddress);
router.put('/:addressId', authMiddleware, updateAddress);
router.delete('/:addressId', authMiddleware, deleteAddress);

module.exports = router;



