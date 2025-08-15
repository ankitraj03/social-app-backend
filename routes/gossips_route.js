import express from 'express';
import Gossips from '../models/gossips_model.js'

const router = express.Router();


router.post("/share", async (req, res) => {
  try {
    const { username, gossip, upvote, downvote, time } = req.body;
    if (!username || !gossip || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newgossip = new Gossips({ username, gossip, upvote, downvote, time });
    await newgossip.save();

    res.status(201).json({ msg: "Gossip shared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/gossips", async (req, res) => {
  try {
    const gossips = await Gossips.find();
    res.status(200).json(gossips);
  } catch (error) {
    console.error("Error fetching gossips:", error);
    res.status(500).json({ message: "Failed to fetch gossips" });
  }
});


router.post("/upvote/:id", async (req, res) => {
  try {
    const { vote } = req.body; 
    const { id } = req.params;

    const gossip = await Gossips.findById(id);
    if (!gossip) return res.status(404).json({ message: "Gossip not found" });

    if (vote === "up") gossip.upvote = (gossip.upvote || 0) + 1;
    else if (vote === "none") gossip.upvote = Math.max((gossip.upvote || 1) - 1, 0);
    else if (vote === "switch") {
      gossip.upvote = (gossip.upvote || 0) + 1;
      gossip.downvote = Math.max((gossip.downvote || 1) - 1, 0);
    }

    await gossip.save();
    res.status(200).json(gossip);
  } catch (err) {
    res.status(500).json({ message: "Failed to upvote", error: err.message });
  }
});

router.post("/downvote/:id", async (req, res) => {
  try {
    const { vote } = req.body; 
    const { id } = req.params;

    const gossip = await Gossips.findById(id);
    if (!gossip) return res.status(404).json({ message: "Gossip not found" });

    if (vote === "down") gossip.downvote = (gossip.downvote || 0) + 1;
    else if (vote === "none") gossip.downvote = Math.max((gossip.downvote || 1) - 1, 0);
    else if (vote === "switch") {
      gossip.downvote = (gossip.downvote || 0) + 1;
      gossip.upvote = Math.max((gossip.upvote || 1) - 1, 0);
    }

    await gossip.save();
    res.status(200).json(gossip);
  } catch (err) {
    res.status(500).json({ message: "Failed to downvote", error: err.message });
  }
});


router.get("/gossip/top", async (req, res) => {
  try {
    const topGossip = await Gossips.findOne().sort({ upvote: -1 }).lean(); 
    if (!topGossip) return res.status(404).json({ message: "No gossips found" });

    res.status(200).json(topGossip);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top gossip", error: err.message });
  }
});

export default router;