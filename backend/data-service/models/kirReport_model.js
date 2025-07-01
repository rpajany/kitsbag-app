import mongoose from "mongoose";

const kitReport_schema = new mongoose.Schema(
  {
    serial_number: { type: Number, required: true, unique: true, trim: true },
    bag_number: { type: String, required: true, trim: true },
    // description: { type: String, required: true, trim: true },
    actual_weight: { type: Number, trim: true }, // required: true,
    order_number: { type: String, required: true, trim: true },
    status: { type: String, trim: true },
    pack_date: { type: String, trim: true },
    shift: { type: String, trim: true },
    employee: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("kit_report", kitReport_schema);
