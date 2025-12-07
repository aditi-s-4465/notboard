import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    BGGId: { type: Number, required: true, unique: true }, 
    Name: { type: String, required: true },             
    Description: { type: String },
    YearPublished: { type: Number },
    GameWeight: { type: Number },
    AvgRating: { type: Number },
    BayesAvgRating: { type: Number },
    StdDev: { type: Number },
    MinPlayers: { type: Number },
    MaxPlayers: { type: Number },
    ComAgeRec: { type: Number },
    LanguageEase: { type: Number },
    BestPlayers: { type: Number },
    GoodPlayers: { type: String },
    NumOwned: { type: Number },
    NumWant: { type: Number },
    NumWish: { type: Number },
    NumWeightVotes: { type: Number },
    MfgPlaytime: { type: Number },
    ComMinPlaytime: { type: Number },
    ComMaxPlaytime: { type: Number },
    MfgAgeRec: { type: Number },
    NumUserRatings: { type: Number }
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
