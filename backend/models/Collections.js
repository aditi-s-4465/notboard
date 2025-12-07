import mongoose from "mongoose";

const collectionGameSchema = new mongoose.Schema(
  {
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    ownedBy: { type: String },
  },
  { _id: false }
);

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    ownerEmail: { type: String },
    members: [{ type: String }],
    games: [collectionGameSchema],
  },
  { timestamps: true }
);

const Collection = mongoose.model("Collection", collectionSchema);

export default Collection;
