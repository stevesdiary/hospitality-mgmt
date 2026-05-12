const bcrypt = require('bcrypt');
const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { sendSuccess, sendError, sendCreated } = require('../utils/responseHelper');
const { auditService } = require('../services/auditService');
const saltRounds = bcrypt.genSaltSync(11);

const registerController = {
  registerUser: async (req, res) => {
    try {
      // Validation is now handled by middleware
      // req.body is already validated and sanitized
      const { firstName, lastName, phoneNumber, gender, email, password, type } = req.body;
      const id = uuidv4();
      
      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return sendError(res, `User ${firstName} already exists, you can login with your password.`, 409);
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, saltRounds);
    
      // Create user
      const userRecord = await User.create({ 
        id, 
        firstName, 
        lastName, 
        phoneNumber, 
        gender, 
        email, 
        password: hashedPassword, 
        type 
      });
      
      if (userRecord) {
        const sanitizedUser = await User.findByPk(userRecord.id, {
          attributes: { exclude: ['password'] },
        });
        auditService.logAuth(
          { ip: req.ip, headers: req.headers, user: { id: userRecord.id, email, type }, body: req.body },
          'register',
          'success',
          { userId: userRecord.id }
        );
        return sendCreated(res, `User ${firstName} created successfully`, sanitizedUser);
      }
    } catch(err) {
      console.error('Registration error:', err);
      auditService.logAuth(
        { ip: req.ip, headers: req.headers, user: null, body: req.body },
        'register',
        'failure',
        { reason: err.message }
      );
      return sendError(res, "An error occurred during registration", 500, err.message);
    }
  }
}

module.exports = registerController;