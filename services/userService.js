const { User } = require('../models');

exports.findAllUsers = async () => {
  return await User.findAndCountAll({
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
    },
  });
};

exports.findUserById = async (id) => {
  return await User.findOne({
    where: { id },
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
    },
  });
};

exports.deleteUserById = async (id) => {
  return await User.destroy({ where: { id } });
};

exports.updateUserById = async (id, userData) => {
  return await User.update(userData, { where: { id } });
};
