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
    // description: {
    //   type: String,
    //   unique: true,
    //   required: true,
    //   trim: true,
    //   index: true,
    // },
    qty: { type: Number, trim: true, default: 1 },
    min_weight: { type: Number, trim: true },
    max_weight: { type: Number, trim: true },
    part_level: { type: String, trim: true },
    parent_item_code: { type: String, trim: true },
    // sub_assy: { type: String, trim: true },
    rate: { type: Number, trim: true },
  },
  { timestamps: true }
);

// Indexes
// kitMaster_Schema.index({ bag_number: 1 }, { unique: true });
// kitMaster_Schema.index({ description: 1 }, { unique: true });

export default mongoose.model("Main_Kit", kitMaster_Schema);
