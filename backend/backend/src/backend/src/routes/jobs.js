const express = require("express");
const retrievalQueue = require("../queue/redisQueue");
const auth = require("../middleware/auth");

const router = express.Router();

// enqueue retrieval job
router.post("/", auth, async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) return res.status(400).json({ error: "itemId required" });

  const job = await retrievalQueue.add({ itemId });
  res.status(202).json({ jobId: job.id });
});

// get job status
router.get("/:id", auth, async (req, res) => {
  const job = await retrievalQueue.getJob(req.params.id);
  if (!job) return res.status(404).json({ error: "Job not found" });

  const state = await job.getState();
  res.json({ id: job.id, state, result: job.returnvalue || null });
});

module.exports = router;
