import express from "express";
import multer from 'multer';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, reserveInventory, releaseInventory } from '../controllers/productController.js';
import createAuthMiddleware from "../middleware/auth.middleware.js";
import { validateCreateProduct } from "../middleware/validation.middleware.js";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// POST /api/products
router.post('/', createAuthMiddleware(['admin', 'seller']), upload.array('Images', 10), validateCreateProduct, createProduct);

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// PUT /api/products/:id
router.put('/:id', createAuthMiddleware(['admin', 'seller']), upload.array('Images', 10), updateProduct);

// DELETE /api/products/:id
router.delete('/:id', createAuthMiddleware(['admin', 'seller']), deleteProduct);

// POST /api/products/reserve - Reserve inventory for order
router.post('/reserve', reserveInventory);

// POST /api/products/release - Release reserved inventory
router.post('/release', releaseInventory);

export default router;