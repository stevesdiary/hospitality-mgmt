const authService = require('../services/authService');

const loginController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ 
          message: "Email and password are required" 
        });
      }

      // Call auth service
      const authResult = await authService.login({ email, password });
      
      // Set session cookie
      res.cookie('session', authResult.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: authService.parseTokenExpiry(process.env.TOKEN_EXPIRY || '5hours') * 1000,
        sameSite: 'strict'
      });

      // Return response
      return res.status(200).json({
        statusCode: 200,
        id: authResult.user.id,
        email: authResult.user.email,
        first_name: authResult.user.first_name,
        last_name: authResult.user.last_name,
        type: authResult.user.type,
        token: authResult.accessToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific errors
      if (error.message.includes("Email is not registered")) {
        return res.status(404).json({ Message: error.message });
      } else if (error.message.includes("Password is not correct")) {
        return res.status(401).json({ Message: error.message });
      }
      
      return res.status(500).json({ 
        Message: `Login failed`, 
        Error: error.message 
      });
    }
  },

  logout: async (req, res) => {
    try {
      const sessionId = req.cookies?.session;
      if (!sessionId) {
        return res.status(400).json({ 
          message: "No active session found" 
        });
      }
      await authService.logout(sessionId);
      res.clearCookie('session');
      
      return res.status(200).json({ 
        message: "Bye 👋, you have successfully logged out" 
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      if (error.message.includes("Session not found")) {
        return res.status(404).json({ 
          message: "Session not found or already expired" 
        });
      }
      
      return res.status(500).json({ 
        message: "Logout failed", 
        error: error.message 
      });
    }
  }
};

module.exports = loginController;
