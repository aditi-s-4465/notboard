import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Description: { type: String },
    AvgRating: { type: Number },
    MinPlayers: { type: Number },
    MaxPlayers: { type: Number },

    ImagePath: { type: String },

    "Cat:Thematic": { type: Number },
    "Cat:Strategy": { type: Number },
    "Cat:War": { type: Number },
    "Cat:Family": { type: Number },
    "Cat:CGS": { type: Number },
    "Cat:Abstract": { type: Number },
    "Cat:Party": { type: Number },
    "Cat:Childrens": { type: Number },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
