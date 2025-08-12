const { v4: uuidv4 }= require('uuid');
const { User, RatingAndReview } = require('../models');
const moment = require('moment');
const { where } = require('sequelize');

const ratingsAdnReviewController = {
  createRating: async (req, res) => {
    try{
      const date = moment().format('YYYY-MM-DD hh:mm:ss');
      const userId = req.params.userId;
      const userData =  await User.findOne({where: {id: userId }});
      firstName = userData.firstName;
      lastName = userData.lastName;
      const id = uuidv4();
      const { hotelId, reviewTitle, review, like, cleanliness, comfort, service, security, location } = req.body;
      const ratings = await RatingAndReview.create({id, hotelId, userId, reviewTitle, date, firstName, lastName, review, like, cleanliness, comfort, service, security, location});
      return res.status(201).send({message: 'Ratings created', Record: ratings});
    }catch(err){
      return res.status(500).send({message: 'Error occoured', Error: err})
    }
  },

  like: async (req, res) => {
    try{
      const {id, hotelId, userId} =  req.body;
      const likeExists = await RatingAndReview.findOne({ where: { hotelId, userId }});
      if(likeExists){
        return res.status(403).send({message: 'User already liked the hotel'})
      }
      if(!likeExists){
        const like = await RatingAndReview.updateRating({ like: true }, { where: { userId, hotelId } });
      }
      
    }
    catch(err){
      return res.status(500).send({ message: 'Error occoured', Error: err })
    }
  },

  getRating: async (req, res) => {
    try{
      const id = req.params.id;
      const ratings = await RatingAndReview.findOne({ 
        where: { id },
        attributes: {
          exclude: [ 'createdAt', 'updatedAt', 'deletedAt']
        },
      });
      if (ratings){
        const { service, security, comfort, location } = ratings;
        const averageRating = (service + security + comfort + location) /4;
        return res.status(200).send({ message: 'Record retrieved', Record: ratings, OverallRating: averageRating });
      }
      else {
        return res.status(404).send({ message: 'Record not found' });
      };
    }
    catch(err){
      return res.status(500).send({ message: 'An error occoured', Error: err })
    }
  },

  updateRating: async (req, res) => {
    try {
      const id = req.params.id;
      const date = moment().format("MMM Do YY");
      const { reviewTitle, review, like, cleanliness, comfort, service, security, location } = req.body;
      const ratings = await RatingAndReview.update({ reviewTitle, date, review, like, cleanliness, comfort, service, security, location}, {where: {id}});
      return res.status(200).send({ message: 'Ratings updated', Record: ratings });
    } catch(err){
      return res.status(500).send({ message: 'Error occoured', Error: err });
    }
  },
  deleteRating: async (req, res) => {
    try {
      const id = req.params.id;
      const deleteRating = await RatingAndReview.destroy({where: { id }});
      if (deleteRating == 1) {
        return res.status(500).send({ message: `Room record with id ${id} has been deleted successfully`});
      }
      if(deleteRating == 0) {
        return res.send({ message: `Room with id ${id} does not exist or is deleted in the database` });
      }
    }
    catch(err) {
      return res.status(500).send({ message: 'AN error occoured', Error: err });
    }
  }
}

module.exports = ratingsAdnReviewController;
