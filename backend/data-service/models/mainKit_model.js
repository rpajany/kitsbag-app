import mongoose from "mongoose";

const kitMaster_Schema = new mongoose.Schema(
  {
    bag_number: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    qty: { type: Number, default: 0 },
    min_weight: { type: Number },
    max_weight: { type: Number },
    part_level: { type: String, trim: true },
    parent_item_code: { type: String, trim: true },
    sub_assy: { type: String, trim: true },
    rate: { type: Number },
  },
  { timestamps: true }
);

// Indexes
// kitMaster_Schema.index({ bag_number: 1 }, { unique: true });
// kitMaster_Schema.index({ description: 1 }, { unique: true });

export default mongoose.model("Main_Kit", kitMaster_Schema);
