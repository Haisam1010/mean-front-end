import mongoose from "mongoose";

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    }
})

export default mongoose.model("OrderItem", orderItemSchema);

