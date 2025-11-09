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
router.get("/:uid", getHackerById);     // general route last
router.post("/", createHacker);
router.put("/:uid", updateHacker);
router.delete("/:uid", deleteHacker);


module.exports = router;
