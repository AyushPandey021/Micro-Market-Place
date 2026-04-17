import Product from '../models/product.model.js';
import imageKitService from '../services/imagekitservice.js';


export const createProduct = async (req, res) => {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body;
        const seller = req.user?.id || req.body.seller;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Images are required'
            });
        }

        let images = [];
        try {
            const uploadPromises = req.files.map(file => imageKitService.uploadImage(file));
            const uploadResults = await Promise.all(uploadPromises);
            images = uploadResults.map(result => ({
                url: result.url,
                fileId: result.fileId,
                thumbnail: result.thumbnail
            }));
        } catch (uploadError) {
            console.error('Image upload error:', uploadError);
            return res.status(500).json({
                success: false,
                message: 'Failed to upload images'
            });
        }

        // Create new product
        const product = new Product({
            title,
            description,
            priceAmount,
            priceCurrency: priceCurrency || 'INR',
            seller,
            images
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { q, minprice, maxprice, skip = 0, limit = 20 } = req.query;

        const filter = {};
        if (q) {
            filter.$text = { $search: q };
        }
        if (minprice) {
            filter.priceAmount = { ...filter.priceAmount, $gte: Number(minprice) };
        }
        if (maxprice) {
            filter.priceAmount = { ...filter.priceAmount, $lte: Number(maxprice) };
        }
        const products = await Product.find(filter).skip(Number(skip)).limit(Math.min(Number(limit), 50));
        res.json({
            success: true,
            message: 'Products retrieved successfully',
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, priceAmount, priceCurrency } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user is authorized (seller or admin)
        if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to update this product'
            });
        }

        // Update fields
        if (title) product.title = title;
        if (description) product.description = description;
        if (priceAmount) product.priceAmount = Number(priceAmount);
        if (priceCurrency) product.priceCurrency = priceCurrency || 'INR';

        // Handle image updates if provided
        if (req.files && req.files.length > 0) {
            try {
                const uploadPromises = req.files.map(file => imageKitService.uploadImage(file));
                const uploadResults = await Promise.all(uploadPromises);
                const newImages = uploadResults.map(result => ({
                    url: result.url,
                    fileId: result.fileId,
                    thumbnail: result.thumbnail
                }));
                product.images = [...product.images, ...newImages]; // Append new images
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload images'
                });
            }
        }

        await product.save();

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to delete this product'
            });
        }

        if (product.images && product.images.length > 0) {
            try {
                const deletePromises = product.images
                    .filter(image => image.fileId)
                    .map(image => imageKitService.deleteImage(image.fileId));
                await Promise.all(deletePromises);
            } catch (deleteError) {
                console.error('Image delete error:', deleteError);
            }
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const reserveInventory = async (req, res) => {
    try {
        const { items } = req.body;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for product ${product.title}`
                });
            }

            // Reserve stock (you might want to add a reserved field to the schema)
            product.stock -= item.quantity;
            await product.save();
        }

        res.json({
            success: true,
            message: 'Inventory reserved successfully'
        });
    } catch (error) {
        console.error('Error reserving inventory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reserve inventory'
        });
    }
};

export const releaseInventory = async (req, res) => {
    try {
        const { items } = req.body;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (product) {
                // Release reserved stock
                product.stock += item.quantity;
                await product.save();
            }
        }

        res.json({
            success: true,
            message: 'Inventory released successfully'
        });
    } catch (error) {
        console.error('Error releasing inventory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to release inventory'
        });
    }
};
