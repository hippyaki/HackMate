const express = require("express");
const {
  getAllHackers,
  getHackerById,
  createHacker,
  updateHacker,
  deleteHacker
} = require("../controllers/hackersController");

const router = express.Router();

router.get("/", getAllHackers);
router.get("/:uid", getHackerById);
router.post("/", createHacker);
router.put("/:uid", updateHacker);
router.delete("/:uid", deleteHacker);

module.exports = router;
