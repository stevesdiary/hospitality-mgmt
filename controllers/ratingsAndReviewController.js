const { v4: uuidv4 } = require('uuid');
const { User, RatingAndReview, Hotel } = require('../models');
const moment = require('moment');

const ratingsAndReviewController = {
  createRating: async (req, res) => {
    try {
      const date = moment().format('YYYY-MM-DD HH:mm:ss');
      const userId = req.params.userId;
      const userData = await User.findOne({ where: { id: userId } });
      if (!userData) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { hotelId, reviewTitle, review, like, cleanliness, comfort, service, security, location } = req.body;

      const hotel = await Hotel.findByPk(hotelId, { attributes: ['id', 'companyId'] });
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      const id = uuidv4();
      const ratings = await RatingAndReview.create({
        id, hotelId, userId,
        companyId: hotel.companyId,
        reviewTitle, date,
        firstName: userData.firstName,
        lastName: userData.lastName,
        review, like, cleanliness, comfort, service, security, location
      });

      return res.status(201).json({ message: 'Rating created successfully', record: ratings });
    } catch (err) {
      return res.status(500).json({ message: 'Error occurred while creating rating', error: err.message });
    }
  },

  getRating: async (req, res) => {
    try {
      const { id } = req.params;
      const ratings = await RatingAndReview.findOne({
        where: { id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      });
      if (!ratings) {
        return res.status(404).send({ message: 'Record not found' });
      }
      const { service, security, comfort, location } = ratings;
      const averageRating = (service + security + comfort + location) / 4;
      return res.status(200).send({ message: 'Record retrieved', Record: ratings, OverallRating: averageRating });
    } catch (err) {
      return res.status(500).send({ message: 'An error occurred', Error: err.message });
    }
  },

  updateRating: async (req, res) => {
    try {
      const { id } = req.params;
      const date = moment().format('MMM Do YY');
      const { reviewTitle, review, like, cleanliness, comfort, service, security, location } = req.body;
      await RatingAndReview.update(
        { reviewTitle, date, review, like, cleanliness, comfort, service, security, location },
        { where: { id } }
      );
      return res.status(200).send({ message: 'Ratings updated' });
    } catch (err) {
      return res.status(500).send({ message: 'Error occurred', Error: err.message });
    }
  },

  deleteRating: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await RatingAndReview.destroy({ where: { id } });
      if (deleted === 1) {
        return res.status(200).json({ message: `Rating ${id} deleted successfully` });
      }
      return res.status(404).json({ message: `Rating ${id} does not exist or is already deleted` });
    } catch (err) {
      return res.status(500).json({ message: 'An error occurred while deleting rating', error: err.message });
    }
  }
};

module.exports = ratingsAndReviewController;
