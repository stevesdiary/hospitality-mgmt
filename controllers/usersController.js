const UserService = require('../services/userService');
const { resolveCompanyScope } = require('../middleware/tenantGuard');

exports.findAllUser = async (req, res) => {
  try {
    const companyId = resolveCompanyScope(req);
    const users = await UserService.findAllUsers(companyId);
    return res.status(200).send({ message: 'Records found', users });
  } catch (err) {
    return res.status(500).send({ message: 'Error occurred', error: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await UserService.findUserById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.status(200).send({ message: 'User found', user });
  } catch (err) {
    return res.status(500).send({ message: 'Error occurred', error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await UserService.deleteUserById(req.params.id);
    const message = deleted
      ? `User ${req.params.id} deleted successfully`
      : `User ${req.params.id} does not exist or was already deleted.`;
    return res.status(200).send({ message });
  } catch (err) {
    return res.status(500).send({ message: 'Error occurred', error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await UserService.updateUserById(req.params.id, req.body);
    const message = updated[0] === 1 ? 'Record Updated' : 'User not found or no changes made';
    return res.status(200).send({ message });
  } catch (err) {
    return res.status(500).send({ message: 'Error occurred', error: err.message });
  }
};
