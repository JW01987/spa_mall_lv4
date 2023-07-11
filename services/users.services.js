const UserRepository = require("../repositories/users.repository");

class UserService {
  userRepository = new UserRepository();
  singUp = async (nickname, password, confirmPassword) => {
    const nicknameRegexp = /^[a-zA-Z0-9]{3,}$/;
    if (!nicknameRegexp.test(nickname)) {
      throw new Error(
        "닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)입니다"
      );
    }
    if (password.length <= 4 || password.includes(nickname)) {
      throw new Error("비밀번호는 4자 이상, 닉네임을 포함할 수 없습니다.");
    }
    if (password !== confirmPassword) {
      throw new Error("비밀번호가 확인란과 일치하지 않습니다.");
    }
    const checkUser = await this.userRepository.checkUser(nickname);
    if (checkUser) {
      throw new Error("중복된 닉네임입니다.");
    }
    await this.userRepository.singUp(nickname, password);
  };

  singIn = async (nickname, password) => {
    const user = await this.userRepository.singIn(nickname, password);
    if (user.length === 0) {
      throw new Error("닉네임 또는 패스워드를 확인해주세요.");
    }

    const token = jwt.sign({ userId: user.id }, "customized-secret-key");
    res.cookie("Authorization", `Bearer ${token}`);
    return token;
  };
}

module.exports = UserService;
