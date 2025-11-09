const express = require("express");
const {
  getAllHackers,
  getHackerById,
  createHacker,
  updateHacker,
  deleteHacker,
  getHackerMatches
} = require("../controllers/hackerController");

const router = express.Router();

router.get("/all", getAllHackers);
router.get("/match", getHackerMatches); // specific route first
router.get("/", getHackerById);     // general route last
router.post("/", createHacker);
router.put("/", updateHacker);
router.delete("/", deleteHacker);


module.exports = router;
