const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../config/redis');
const saltRounds = 11;

const tokenExpiry = process.env.TOKEN_EXPIRY || '5hours';

class AuthService {
  async login(credentials) {
    try {
      const { email, password } = credentials;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error("Email is not registered or profile not found!");
      };
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error("Password is not correct, please provide the correct password.");
      }

      const userInfo = {
        id: user.id,
        email: user.email,
        type: user.type
      };
      const accessToken = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: tokenExpiry });

      const sessionId = uuidv4();
      const sessionData = {
        userId: user.id,
        email: user.email,
        type: user.type
      };
      
      await redisClient.setEx(
        sessionId, 
        this.parseTokenExpiry(tokenExpiry), 
        JSON.stringify(sessionData)
      );

      return {
        sessionId,
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          type: user.type
        }
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  async logout(sessionId) {
    try {
      if (!sessionId) {
        throw new Error("No session provided");
      }

      const result = await redisClient.del(sessionId);
      if (result === 0) {
        throw new Error("Session not found or already expired");
      }

      return { message: "Logout successful" };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  parseTokenExpiry(expiry) {
    if (expiry.includes('h')) {
      const hours = parseInt(expiry.replace('h', ''));
      return hours * 3600; // Convert hours to seconds
    } else if (expiry.includes('m')) {
      const minutes = parseInt(expiry.replace('m', ''));
      return minutes * 60; // Convert minutes to seconds
    } else if (expiry.includes('s')) {
      return parseInt(expiry.replace('s', ''));
    }
    return 18000; // Default to 5 hours in seconds
  }

  async resetPassword(token, passwordData) {
    try {
      const { newPassword, confirmPassword, email } = passwordData;
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const decodedEmail = decoded?.email;
      
      if (!decodedEmail) {
        throw new Error("Invalid or expired token: email not found");
      };
      if (email !== decodedEmail) {
        throw new Error("Invalid email provided");
      };
      if (!newPassword) {
        throw new Error("New password is required");
      }
      
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      const user = await User.findOne({ where: { email: decodedEmail } });
      if (!user) {
        throw new Error(`User not found with email ${decodedEmail}`);
      };
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      user.password = hashedPassword;
      await user.save();
      
      return { message: "Password updated successfully, you can now login with your new password." };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new Error("Invalid token");
      } else if (error.name === 'TokenExpiredError') {
        throw new Error("Token expired");
      }
      throw error;
    }
  }

}

module.exports = new AuthService();
