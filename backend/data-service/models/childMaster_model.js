import mongoose from "mongoose";

const childMaster_Schema = new mongoose.Schema(
  {
    part_number: { type: String, unique: true, required: true, trim: true },
    description: { type: String, unique: true, required: true, trim: true },
    part_level: { type: String, trim: true, default: "M" },
    location: { type: String, trim: true },
    bin_number: { type: String, trim: true },
    stock_qty: { type: Number, trim: true, default: 0 },
  },
  { timestamps: true }
);

// Indexes
// kitMaster_Schema.index({ bag_number: 1 }, { unique: true });
// kitMaster_Schema.index({ description: 1 }, { unique: true });

export default mongoose.model("Child_Master", childMaster_Schema);
