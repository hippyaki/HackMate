const express = require("express");
const { getAllUsers, getUserByUid, addUser, checkUID, updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/", getUserByUid);
router.get("/check", checkUID);
router.post("/", addUser);
router.put("/", updateUser);

module.exports = router;
