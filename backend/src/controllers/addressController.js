const User = require('../models/user');

// Get all addresses for the authenticated user
exports.getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('addresses');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ addresses: user.addresses || [] });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
};

// Create a new address
exports.createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
            user.addresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        const newAddress = {
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            country: country || 'USA',
            isDefault: isDefault || false,
        };

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({ 
            message: 'Address created successfully', 
            address: user.addresses[user.addresses.length - 1] 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating address', error: error.message });
    }
};

// Update an address
exports.updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;
        const { fullName, phone, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // If this is set as default, unset other defaults
        if (isDefault) {
            user.addresses.forEach(addr => {
                if (addr._id.toString() !== addressId) {
                    addr.isDefault = false;
                }
            });
        }

        // Update address fields
        if (fullName !== undefined) address.fullName = fullName;
        if (phone !== undefined) address.phone = phone;
        if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
        if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
        if (city !== undefined) address.city = city;
        if (state !== undefined) address.state = state;
        if (zipCode !== undefined) address.zipCode = zipCode;
        if (country !== undefined) address.country = country;
        if (isDefault !== undefined) address.isDefault = isDefault;

        await user.save();

        res.status(200).json({ 
            message: 'Address updated successfully', 
            address 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        user.addresses.pull(addressId);
        await user.save();

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
};

// Get a single address by ID
exports.getAddressById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { addressId } = req.params;
        
        const user = await User.findById(userId).select('addresses');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ address });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
};



