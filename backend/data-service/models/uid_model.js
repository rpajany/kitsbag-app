import mongoose from "mongoose";

// const uid_Schema = new mongoose.Schema({

//     serial_uid: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
// });

const uid_Schema = new mongoose.Schema({
  _id: { type: String, default: "fixed_id_1" },
  serial_uid: { type: Number, trim: true },
});

// Indexes

export default mongoose.model("UID", uid_Schema);
