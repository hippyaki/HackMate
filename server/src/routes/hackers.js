const express = require("express");
const {
  getAllHackers,
  getHackerById,
  createHacker,
  updateHacker,
  deleteHacker,
  getHackerMatches,
  getHackerSubs
} = require("../controllers/hackerController");

const router = express.Router();

router.get("/all", getAllHackers);
router.post("/match", getHackerMatches); 
router.post("/subs", getHackerSubs);
router.get("/", getHackerById);     
router.post("/", createHacker);
router.put("/", updateHacker);
router.delete("/", deleteHacker);


module.exports = router;
