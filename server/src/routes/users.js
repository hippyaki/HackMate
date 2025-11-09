const express = require("express");
const { getAllUsers, getUserByUid, addUser, checkUID, updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/:uid", getUserByUid);
router.get("/check/:uid", checkUID);
router.post("/", addUser);
router.put("/:uid", updateUser);

module.exports = router;
