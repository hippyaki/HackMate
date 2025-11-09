const express = require("express");
const { getAllUsers, getUserByUid, addUser, checkUID, updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/check", checkUID); // specific route first
router.get("/", getUserByUid);   // general route last
router.post("/", addUser);
router.put("/", updateUser);


module.exports = router;
