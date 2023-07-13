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

    res.status(data.status).json({ msg: data.msg });
  };

  signIn = async (req, res, next) => {
    const { nickname, password } = req.body;
    try {
      const data = await this.userService.signIn(nickname, password);
      res.cookie("Authorization", `Bearer ${data.token}`);
      res.status(data.status).json({ token: data.token });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
}

module.exports = UsersController;
