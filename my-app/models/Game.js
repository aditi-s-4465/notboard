const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: String },
    player_counts: { type: Number },
    game_length: { type: Number },
    rating: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', gameSchema);
