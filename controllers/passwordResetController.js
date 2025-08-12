const authService = require('../services/authService');

const passwordResetController = {
  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password: newPassword, confirmPassword, email } = req.body;
      
      // Validate required fields
      if (!token || !newPassword || !confirmPassword || !email) {
        return res.status(400).json({
          statusCode: 400,
          message: "Missing required fields: token, password, confirmPassword, and email are required"
        });
      }
      
      // Call service to reset password
      const result = await authService.resetPassword(token, {
        newPassword,
        confirmPassword,
        email
      });
      
      return res.status(200).json({
        statusCode: 200,
        Message: result.message
      });
    } catch (error) {
      console.error("Password reset error:", error);
      
      // Handle specific error cases
      if (error.message.includes("Invalid or expired token")) {
        return res.status(400).json({
          statusCode: 400,
          message: error.message
        });
      } else if (error.message.includes("Invalid email")) {
        return res.status(401).json({
          statusCode: 401,
          message: error.message
        });
      } else if (error.message.includes("Passwords do not match")) {
        return res.status(409).json({
          statusCode: 409,
          message: error.message
        });
      } else if (error.message.includes("User not found")) {
        return res.status(404).json({
          statusCode: 404,
          message: error.message
        });
      } else if (error.message.includes("Invalid token") || error.message.includes("Token expired")) {
        return res.status(401).json({
          statusCode: 401,
          message: error.message
        });
      }
      
      // Generic server error
      return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong while resetting password",
        error: error.message
      });
    }
  }
};

module.exports = passwordResetController;
