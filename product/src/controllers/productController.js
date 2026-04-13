import Product from '../models/product.model.js';
import imageKitService from '../services/imagekitservice.js';

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, seller } = req.body;

        // Validate required fields
        if (!name || !price || !price.amount || !seller) {
            return res.status(400).json({
                success: false,
                message: 'Name, price.amount, and seller are required'
            });
        }

        let images = [];

        // Handle image uploads if files are provided
        if (req.files && req.files.length > 0) {
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
        }

        // Create new product
        const product = new Product({
            name,
            description,
            price: {
                amount: price.amount,
                currency: price.currency || 'INR'
            },
            seller,
            images: images
        });

        // Save to database
        await product.save();

        // Return success response
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
