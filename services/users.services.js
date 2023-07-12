const UserRepository = require("../repositories/users.repository");
const jwt = require("jsonwebtoken");
class UserService {
  userRepository = new UserRepository();
  signUp = async (nickname, password, confirmPassword) => {
    const nicknameRegexp = /^[a-zA-Z0-9]{3,}$/;
    if (!nicknameRegexp.test(nickname)) {
      return {
        success: false,
        msg: "닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)입니다",
      };
    }
    if (password.length <= 4 || password.includes(nickname)) {
      return {
        success: false,
        msg: "비밀번호는 4자 이상, 닉네임을 포함할 수 없습니다.",
      };
    }
    if (password !== confirmPassword) {
      return {
        success: false,
        msg: "비밀번호가 확인란과 일치하지 않습니다.",
      };
    }
    const checkUser = await this.userRepository.checkUser(nickname);
    if (checkUser) {
      return {
        success: false,
        msg: "중복된 닉네임입니다.",
      };
    }
    await this.userRepository.signUp(nickname, password);
    return {};
  };

  signIn = async (nickname, password) => {
    const user = await this.userRepository.signIn(nickname, password);
    if (user === null) {
      return {
        success: false,
        msg: "닉네임 또는 패스워드를 확인해주세요.",
      };
    }

    const token = jwt.sign({ userId: user.id }, "customized-secret-key");
    return token;
  };
}

module.exports = UserService;
