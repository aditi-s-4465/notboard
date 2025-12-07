import express from "express";
import Collection from "../models/Collections.js";
import Game from "../models/Game.js";

const router = express.Router();

// ADD game to collection
// POST /api/collections/:collectionId/games
router.post('/:collectionId/games', async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { gameId, ownedBy } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: 'gameId is required' });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Verify the game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Avoid duplicates 
    const alreadyInCollection = collection.games.some(
      (g) => g.game.toString() === gameId
    );
    if (alreadyInCollection) {
      return res.status(400).json({ error: 'Game already in collection' });
    }

    collection.games.push({
      game: gameId,
      ownedBy: ownedBy || null
    });

    await collection.save();
    await collection.populate('games.game');

    res.status(201).json(collection);
  } catch (err) {
    console.error('Error adding game to collection:', err);
    res.status(500).json({ error: 'Failed to add game to collection' });
  }
});

// REMOVE game from collection
// DELETE /api/collections/:collectionId/games/:gameId
router.delete('/:collectionId/games/:gameId', async (req, res) => {
  try {
    const { collectionId, gameId } = req.params;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const originalLength = collection.games.length;

    collection.games = collection.games.filter(
      (g) => g.game.toString() !== gameId
    );

    if (collection.games.length === originalLength) {
      return res.status(404).json({ error: 'Game not found in collection' });
    }

    await collection.save();
    await collection.populate('games.game');

    res.json(collection);
  } catch (err) {
    console.error('Error removing game from collection:', err);
    res.status(500).json({ error: 'Failed to remove game from collection' });
  }
});

export default router;
