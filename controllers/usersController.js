const UserService = require('../services/userService');

exports.findAllUser = async (req, res) => {
  try {
    const users = await UserService.findAllUsers();
    return res.status(200).send({ message: 'Records found', users });
  } catch (err) {
    console.error('Error occurred:', err);
    return res.status(500).send({ message: 'Error occurred', err });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await UserService.findUserById(req.params.id);
    return res.status(200).send({ message: 'User found', user });
  } catch (err) {
    console.error('Error occurred:', err);
    return res.status(500).send({ message: 'Error occurred', err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await UserService.deleteUserById(req.params.id);
    const message = deleted
      ? `User with id ${req.params.id} has been deleted successfully!`
      : `User ${req.params.id} does not exist or was already deleted.`;
    return res.status(200).send({ message });
  } catch (err) {
    console.error('Error occurred:', err);
    return res.status(500).send({ message: 'Error occurred', err });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updated = await UserService.updateUserById(req.params.id, req.body);
    const message = updated[0] === 1 ? 'Record Updated' : 'User not found or no changes made';
    return res.status(200).send({ message });
  } catch (err) {
    console.error('Error occurred:', err);
    return res.status(500).send({ message: 'Error occurred', err });
  }
};

exports.findAllUser = async (req, res) => {
  try{
    const users = await User.findAndCountAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
      }
    });
    return res.status(200).send({message: 'Records found', users})
  }catch(err){
    console.log('An error occoured!', err);
    return res.send({message: 'Error showed up', err})
  };
};

exports.findOne =  async (req, res) => {
  try{
    const id = req.params.id;
    const user = await User.findOne({
      where: {id}, 
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
      }});
    return res.status(200).send({message: 'User found', user });
  }catch(err){
    console.log('Error occoured', err)
    res.status(500).send({message: 'Error happened', err});
  };
};

exports.deleteUser = async (req, res ) => {
  try{
    const id = req.params.id;
    console.log("IDDDD", id)
    const user = await User.destroy({where: {id}})
    // console.log(user)
    if (user == 1 ){
      return res.send({message: `User with id ${id} has been deleted successfully!`})
    }
    if(user == 0){
      return res.send({message: `User ${id} does not exist or is deleted in the database`})
    }
  }catch(err){
    return res.status(500).send({message: 'Error occoured', err})
  }
};

exports.updateUser = async (req, res) => {
  try{
    const id = req.params.id;
    const {first_name, last_name, address, email, phone_number, type } = req.body;
    const updateUser = await User.update({first_name, last_name, address, email, phone_number, type }, {where: {id}});
    console.log(updateUser);
    if(updateUser == 1) {
      return res.status(200).send({ message: 'Record Updated' });
    }
    
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: 'Error occoured', err})
  }
};