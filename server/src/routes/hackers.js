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
router.get("/:uid", getHackerById);
router.post("/", createHacker);
router.put("/:uid", updateHacker);
router.delete("/:uid", deleteHacker);
router.get("/match", getHackerMatches);

module.exports = router;
