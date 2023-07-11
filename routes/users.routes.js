const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const UsersController = require("../controllers/users.controller");
const usersController = new UsersController();
router.post("/signUp", usersController.signUp);
router.post("/signIn", usersController.signIn);

module.exports = router;
