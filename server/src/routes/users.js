const express = require("express");
const { getAllUsers, getUserByUid, addUser, checkUsername } = require("../controllers/userController");

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/", getUserByUid);
router.get("/validate", checkUsername);
router.post("/", addUser);

module.exports = router;
