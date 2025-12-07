import express from "express";
import mongoose from "mongoose";
import Game from "../models/Game.js";

const router = express.Router();

// GET all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/games/:id  -> by Mongo _id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /api/games/:id called with id =", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ error: "Invalid game id format" });
    }

    const game = await Game.findById(id).select({
        Name: 1,
        Description: 1,
        AvgRating: 1,
        MinPlayers: 1,
        MaxPlayers: 1,
        ImagePath: 1,
        "Cat:Thematic": 1,
        "Cat:Strategy": 1,
        "Cat:War": 1,
        "Cat:Family": 1,
        "Cat:CGS": 1,
        "Cat:Abstract": 1,
        "Cat:Party": 1,
        "Cat:Childrens": 1,
    });
    console.log("Game found:", game);

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    res.json(game);
  } catch (err) {
    console.error("Error fetching game:", err);
    res.status(500).json({ error: "Failed to fetch game" });
  }
});

// Get games with filters
router.get('/filter', async (req, res) => {
  try {
    const filters = req.query;
    const games = await Game.find(filters);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
