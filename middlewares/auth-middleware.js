const jwt = require("jsonwebtoken");
const { Users } = require("../models");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, "customized-secret-key");
    const user = await Users.findOne({ where: { id: userId } });
    if (user.length === 0) {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
    }
    res.locals.user = user;
    next();
  } catch (err) {
    res.status(401).send({ success: false, errorMessage: err.message });
  }
};
