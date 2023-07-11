const { Posts, Users, Likes } = require("../models");
const { Sequelize } = require("sequelize");
class UserRepository {
  checkUser = async (nickname) => {
    const checkUser = await Users.findOne({ where: { nickname } });
    return { checkUser };
  };
  singUp = async (nickname, password) => {
    await Users.create({ nickname, password });
  };
  singIn = async (nickname, password) => {
    const user = await Users.findOne({
      where: { [Op.and]: [{ nickname }, { password }] },
    });
    return user;
  };
}

module.exports = UserRepository;
