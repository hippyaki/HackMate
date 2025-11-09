const express = require("express");
const { getAllUsers, getUserByUid, addUser, checkUID, updateUser } = require("../controllers/userController");

const router = express.Router();

router.get("/all", getAllUsers);
router.get("/check/:uuid", checkUID); // specific route first
router.get("/:uuid", getUserByUid);   // general route last
router.post("/", addUser);
router.put("/:uuid", updateUser);


module.exports = router;
