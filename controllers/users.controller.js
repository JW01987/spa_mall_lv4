const UserService = require("../services/users.services");
class UsersController {
  userService = new UserService();

  signUp = async (req, res, next) => {
    const { nickname, password, confirmPassword } = req.body;
    await this.userService.singUp(nickname, password, confirmPassword);
    res.status(200).json({ success: true, msg: "회원가입이 완료되었습니다." });
  };

  singIn = async (req, res, next) => {
    const { nickname, password } = req.body;
    const token = await this.userService.singIn(nickname, password);
    res.status(200).json({ token });
  };
}

module.exports = UsersController;
