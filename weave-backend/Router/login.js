const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authentication");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  logout,
} = require("../controllers/user.js");
const { login, checktoken } = require("../controllers/login");

router.get("/verifytoken", checktoken);
router.get("/", getAllUsers);
router.post("/login", login);
router.route("/").post(createUser);
router.route("/:id").patch(updateUser).delete(deleteUser);
router.post("/logout", logout);

module.exports = router;
