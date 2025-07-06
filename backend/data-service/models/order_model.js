import mongoose from "mongoose";

const order_Schema = new mongoose.Schema(
  {
    order_number: { type: String, required: true, trim: true },
    // order_date: { type: String, required: true, trim: true },
    order_date: { type: Date, required: true, trim: true }, // ✅ Store as native Date type
    bag_number: { type: String, required: true, trim: true },
    description: { type: String, trim: true }, // required: true,
    order_qty: { type: Number, required: true, trim: true },
    start_qty: { type: Number, trim: true },
    complete_qty: { type: Number, trim: true },
    pending_qty: { type: Number, trim: true },
    status: { type: String, trim: true },
    delivery_date: { type: String, required: true, trim: true },
    // rate: { type: Number, required: true, trim: true },
  },
  { timestamps: true }
);

// Indexes

export default mongoose.model("Order", order_Schema);
