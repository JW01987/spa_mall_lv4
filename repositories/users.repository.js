const { Users } = require("../models");
const { Op } = require("sequelize");
class UserRepository {
  checkUser = async (nickname) => {
    const checkUser = await Users.findOne({ where: { nickname } });
    return checkUser;
  };
  signUp = async (nickname, password) => {
    await Users.create({ nickname, password });
  };
  signIn = async (nickname, password) => {
    const user = await Users.findOne({
      where: { [Op.and]: [{ nickname }, { password }] },
    });
    return user;
  };
}

module.exports = UserRepository;
