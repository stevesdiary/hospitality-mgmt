require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { auditService } = require('./auditService');

const createCustomer = async (email, req = null) => {
  try {
    const customer = await stripe.customers.create({ email });
    if (req) {
      auditService.logPayment(req, 'create_stripe_customer', 'User', null, { stripeCustomerId: customer.id });
    }
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