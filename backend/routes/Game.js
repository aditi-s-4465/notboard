import express from "express";
import mongoose from "mongoose";
import Game from "../models/Game.js";

const router = express.Router();

// GET /api/games/:id  -> by Mongo _id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("GET /api/games/:id called with id =", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format");
      return res.status(400).json({ error: "Invalid game id format" });
    }

    const game = await Game.findById(id);
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

export default router;
