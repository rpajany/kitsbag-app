import mongoose from "mongoose";

const childKit_Schema = new mongoose.Schema(
  {
    bag_number: { type: String, required: true, trim: true },
    part_number: { type: String, required: true, trim: true },
    description: { type: String, unique: true, required: true, trim: true },
    qty: { type: Number, required: true, trim: true, default: 1 },
    // min_weight: { type: Number },
    // max_weight: { type: Number },
    part_level: { type: String, trim: true },
    // parent_item_code: { type: String, trim: true },
    // sub_assy: { type: String, trim: true }
  },
  { timestamps: true }
);

// Indexes
// kitMaster_Schema.index({ bag_number: 1 }, { unique: true });
// kitMaster_Schema.index({ description: 1 }, { unique: true });

export default mongoose.model("Child_Kit", childKit_Schema);
