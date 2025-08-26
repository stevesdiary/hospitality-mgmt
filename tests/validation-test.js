/**
 * Simple validation test script
 * Tests the Joi validation schemas to ensure they work correctly
 */

const { userValidation, hotelValidation, reservationValidation } = require('../utils/validationSchemas');

console.log('🧪 Testing Joi Validation Schemas...\n');

// Test user registration validation
console.log('📝 Testing User Registration Validation:');

// Valid user data
const validUser = {
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '08123456789',
  gender: 'male',
  email: 'john.doe@email.com',
  password: 'StrongP@ssw0rd123',
  confirmPassword: 'StrongP@ssw0rd123',
  type: 'regular'
};

// Test valid user
const validUserResult = userValidation.register.validate(validUser);
console.log('✅ Valid user data:', validUserResult.error ? 'FAILED' : 'PASSED');

// Test invalid user (weak password)
const invalidUser = {
  ...validUser,
  password: 'weak',
  confirmPassword: 'weak'
};

const invalidUserResult = userValidation.register.validate(invalidUser);
console.log('❌ Weak password:', invalidUserResult.error ? 'PASSED (correctly rejected)' : 'FAILED');

// Test invalid email
const invalidEmailUser = {
  ...validUser,
  email: 'invalid-email'
};

const invalidEmailResult = userValidation.register.validate(invalidEmailUser);
console.log('❌ Invalid email:', invalidEmailResult.error ? 'PASSED (correctly rejected)' : 'FAILED');

// Test hotel validation
console.log('\n🏨 Testing Hotel Validation:');

const validHotel = {
  name: 'Grand Palace Hotel',
  address: '123 Main Street, Victoria Island',
  city: 'Lagos',
  state: 'Lagos',
  description: 'A luxurious hotel in the heart of Lagos with world-class amenities',
  hotelType: 'luxury',
  numberOfRooms: 150,
  contactEmail: 'contact@grandpalace.com',
  contactPhone: '08123456789',
  termsAndConditions: 'Standard terms and conditions apply for all bookings and services provided by the hotel.'
};

const validHotelResult = hotelValidation.create.validate(validHotel);
console.log('✅ Valid hotel data:', validHotelResult.error ? 'FAILED' : 'PASSED');

// Test invalid hotel (missing required fields)
const invalidHotel = {
  name: 'Test Hotel'
  // Missing required fields
};

const invalidHotelResult = hotelValidation.create.validate(invalidHotel);
console.log('❌ Missing required fields:', invalidHotelResult.error ? 'PASSED (correctly rejected)' : 'FAILED');

// Test reservation validation
console.log('\n📅 Testing Reservation Validation:');

const validReservation = {
  hotelId: '123e4567-e89b-12d3-a456-426614174000',
  roomId: '987fcdeb-51d2-43a8-b123-456789abcdef',
  dateIn: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  dateOut: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
  paymentStatus: 'pending'
};

const validReservationResult = reservationValidation.create.validate(validReservation);
console.log('✅ Valid reservation data:', validReservationResult.error ? 'FAILED' : 'PASSED');

// Test invalid reservation (past date)
const invalidReservation = {
  ...validReservation,
  dateIn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
};

const invalidReservationResult = reservationValidation.create.validate(invalidReservation);
console.log('❌ Past check-in date:', invalidReservationResult.error ? 'PASSED (correctly rejected)' : 'FAILED');

console.log('\n🎉 Validation testing completed!');

// Show example error format
if (invalidUserResult.error) {
  console.log('\n📋 Example validation error format:');
  const errors = invalidUserResult.error.details.map(detail => ({
    field: detail.path.join('.'),
    message: detail.message,
    value: detail.context?.value
  }));
  console.log(JSON.stringify(errors, null, 2));
}