const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    bggId: { type: Number, required: true, unique: true }, 
    name: { type: String, required: true },
    yearPublished: { type: Number },
    minPlayers: { type: Number },
    maxPlayers: { type: Number },
    playingTime: { type: Number },        
    avgRating: { type: Number },   
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
