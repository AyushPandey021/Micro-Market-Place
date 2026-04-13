import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,

    },
    price: {
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            enum: ["INR", "EUR", "GBP"],
            default: "INR"
        }
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: [
        {
            url: String,
            thumbnail: String,
            fileId: String
        }
    ]

},

);
const Product = mongoose.model("Product", productSchema);
export default Product;
