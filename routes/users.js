const express = require("express");
const router = express.Router();
const { Users } = require("../models");

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;
  const nicknameRegexp = /^[a-zA-Z0-9]{3,}$/;
  if (!nicknameRegexp.test(nickname)) {
    res.status(400).json({
      errorMessage:
        "닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)입니다",
    });
    return;
  }
  if (password.length <= 4 || password.includes(nickname)) {
    res.status(400).json({
      errorMessage: "비밀번호는 4자 이상, 닉네임을 포함할 수 없습니다.",
    });
    return;
  }
  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "비밀번호가 확인란과 일치하지 않습니다.",
    });
    return;
  }

  // email 또는 nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
  const existsUsers = await Users.findOne({ where: { nickname } });
  if (existsUsers) {
    res.status(400).json({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }

  await Users.create({ nickname, password });

  res.status(201).json({});
});

module.exports = router;
