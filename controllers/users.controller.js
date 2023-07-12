const UserService = require("../services/users.services");
class UsersController {
  userService = new UserService();

  signUp = async (req, res, next) => {
    const { nickname, password, confirmPassword } = req.body;
    const data = await this.userService.signUp(
      nickname,
      password,
      confirmPassword
    );
    if (data.success === false) {
      res.status(400).json({ success: true, msg: data.msg });
    } else {
      res.status(200).json({ msg: "회원가입이 완료되었습니다" });
    }
  };

  signIn = async (req, res, next) => {
    const { nickname, password } = req.body;
    const token = await this.userService.signIn(nickname, password);
    if (token.success === false) {
      res.status(400).json({ success: true, msg: data.msg });
    } else {
      res.cookie("Authorization", `Bearer ${token}`);
      res.status(200).json({ token });
    }
  };
}

module.exports = UsersController;
