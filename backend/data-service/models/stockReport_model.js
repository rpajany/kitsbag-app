import mongoose from "mongoose";

const stockReport_Schema = new mongoose.Schema(
  {
    part_id: { type: String, required: true, trim: true },
    part_number: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    bin_number: { type: String, trim: true },
    stock_qty: { type: Number, trim: true, default: 0 },
    transact_qty: { type: Number, trim: true, default: 0 },
    hand_qty: { type: Number, trim: true, default: 0 },
    remarks: { type: String, trim: true },
    employee: { type: String, trim: true },
  },
  { timestamps: true }
);

// Indexes
// kitMaster_Schema.index({ bag_number: 1 }, { unique: true });
// kitMaster_Schema.index({ description: 1 }, { unique: true });

export default mongoose.model("Stock_Report", stockReport_Schema);
