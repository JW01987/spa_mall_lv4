const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { Users } = require("../models");

// 로그인 API
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;
  try {
    const user = await Users.findOne({ where: { nickname } });
    if (!user || password !== user.password) {
      res.status(400).json({
        errorMessage: "닉네임 또는 패스워드를 확인해주세요.",
      });
      return;
    }

    const token = jwt.sign({ userId: user.id }, "customized-secret-key");
    res.cookie("Authorization", `Bearer ${token}`); // JWT를 Cookie로 할당합니다!
    res.status(200).json({ token }); // JWT를 Body로 할당합니다!
  } catch (err) {
    res.status(400).json({ errorMessage: err.message }); // JWT를 Body로 할당합니다!
  }
});

module.exports = router;
