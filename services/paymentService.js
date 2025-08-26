require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Example usage - should be moved to proper controller
const createCustomer = async (email) => {
  try {
    const customer = await stripe.customers.create({
      email: email,
    });
    console.log('Customer created:', customer.id);
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

module.exports = {
  createCustomer,
  stripe
};