import express from "express";
import Collection from "../models/Collections.js";
import Game from "../models/Game.js";

const router = express.Router();

// ADD a new collection
// POST /api/collections/
router.post('/', async (req, res) => {
  try {
    const {  name, code, email } = req.body;

    // Create collection (empty games list by default)
    const newCollection = new Collection({
      name: name || "Untitled Collection",
      code,
      members: email ? [email] : [],
      games: []
    });

    await newCollection.save();
    res.status(201).json(newCollection);

  } catch (err) {
    console.error("Error creating collection:", err);
    res.status(500).json({ error: "Failed to create collection" });
  }
});

// GET a collection by ID
// GET /api/collections/:collectionId
router.get('/:collectionId', async (req, res) => {
  try {
    const { collectionId } = req.params;

    const collection = await Collection.findById(collectionId)
      .populate("games.game");

    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    res.json(collection);

  } catch (err) {
    console.error("Error retrieving collection:", err);
    res.status(500).json({ error: "Failed to retrieve collection" });
  }
});

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

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) {
      query.members = email;
    }
    const collections = await Collection.find(query);
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

// join
router.post("/join", async (req, res) => {
  try {
    const { code, email } = req.body;

    const collection = await Collection.findOne({ code });
    if (!collection) {
      return res.status(404).json({ error: "Invalid code" });
    }

    if (!collection.members.includes(email)) {
      collection.members.push(email);
      await collection.save();
    }

    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: "Failed to join collection" });
  }
});

export default router;
