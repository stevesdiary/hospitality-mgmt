const { v4: uuidv4 } = require('uuid');
const cron = require('node-cron');
const { Reservation, User, Room, Hotel, Facility } = require('../models');
const { Model, where } = require('sequelize');
const moment = require('moment');
const user = require('../models/user');

const reservationController = {
  createReservation: async (req, res) => {
    try{
      const hotel_id = req.params.hotel_id;
      const { room_id, user_id, date_in, date_out, payment_status } = req.body;
      console.log(date_in, date_out);
      const id = uuidv4();
      const reservation = await Reservation.create({ id, hotel_id, room_id, user_id, date_in, date_out, payment_status });
      if(reservation){
        return res.status(201).send({ message: `Reservation creatd with id: ${id}`, Record: reservation } )
      }
    }
    catch(err){
      console.log('Reservation not created', err)
      return res.status(500).send({message: 'An error occoured', err})
    }
  },
  getOne: async (req, res) => {
    try{
      const id = req.params.id;
      const reservation = await Reservation.findOne({ 
        where: { id },
        attributes: {
          exclude: [ 'createdAt', 'updatedAt', 'deletedAt']
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt']
            }
          },
          {
            model: Hotel,
            attributes: {
              exclude: [ 'id', 'description', 'terms_and_conditions', 'createdAt', 'updatedAt', 'deletedAt' ]
            },
            include: [
              {
                model: Facility,
                as: 'facilities',
                attributes: {
                  exclude: ['id', 'hotel_id', 'createdAt', 'updatedAt', 'deletedAt']
                }
              }
            ]
          },
          {
            model: Room,
            attributes: {
              exclude: [ 'id', 'hotel_id', 'createdAt', 'updatedAt', 'deletedAt']
            }
          },
          
        ]
      });
      console.log(reservation.dataValues.User.dataValues.first_name)
      if (reservation) {
        return res.status(200).json({message: `Reservation record found`, data: reservation});
      }
      if(!reservation){
        return res.status(404).json({message: `Reservation with id ${id} does not exist or is deleted`});
      }
    }
    catch(err){
      return res.status(500).send({message: `There was an error.`, err});
    }
    // }
    // catch(err){
    //   console.log('Reservation not created', err)
    //   return res.status(500).send({message: 'An error occoured', err})
    // }
  },

  getAll: async ( req, res ) => {
    try{
      const reservations = await Reservation.findAll({
        attributes: {
          exclude: [ 'createdAt', 'updatedAt', 'deletedAt']
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt']
            }
          },
          {
            model: Hotel,
            // as: 'hotel',
            attributes: {
              exclude: [ 'id', 'description', 'terms_and_conditions', 'createdAt', 'updatedAt', 'deletedAt' ]
            },
            include: [
              {
                model: Facility,
                as: 'facilities',
                attributes: {
                  exclude: ['id', 'hotel_id', 'createdAt', 'updatedAt', 'deletedAt']
                }
              }
            ]
          },
          {
            model: Room,
            attributes: {
              exclude: [ 'id', 'hotel_id', 'createdAt', 'updatedAt', 'deletedAt']
            }
          },
          
        ]
      });
    
      if (reservations && reservations.length > 0) {
        return res.status(200).json({message: `Reservation records found`, data: reservations});
      } else {
        return res.status(404).json({message: `No reservations found`});
      }
    }
    catch(err){
      console.error(err);
      return res.status(500).send({message: `There was an error.`, err});
    }
  },
  
  removeReservations: async (req, res) => {
    try{
      // cron.schedule('*/2 * * * *', async () => {
      //   console.log('Running every 2 minutes');
        const deleteReservation = await Reservation.destroy({where: {status: 'used'}});
      if (deleteReservation){
        console.log(`Used reservations have been deleted successfully.`);
        return res.status(200).send({Message: `Used reservations have been deleted successfully.`});
      }
      else {
        console.log('All used reservations have been deleted or no used reservations')
        return res.status(404).send({message: 'All used reservations have been deleted or no used reservations'});
      }
      // });
      // // Delete used reervations periodiucally
      // cron.schedule('0 */6 * * *', async () => {
      //   console.log('Delete used reservations every 6 hours');
      //   const deleteReservation = await Reservation.destroy({where: {status: 'used'}});
      //   if (deleteReservation){
      //     console.log(`Used reservations have been deleted successfully.`);
      //     return res.status(200).send({Message: `Used reservations have been deleted successfully.`});
      //   }
      //   else{
      //     return res.status(200).send({message: 'All used reservations have been deleted or no used reservations'});
      //   }
      // });
    }
    catch(err){
      return res.status(500).send({Message: 'Multiple reservations unable to delete.', Error: err});
    }
  },
  updateReservation: async (req, res) => {
    try{
      const id = req.params.id;
      const reservation = await Reservation.findOne({
        where: { id },
        attributes: {
          exclude: ['hotel_id', 'user_id', 'room_id', 'createdAt', 'updatedAt', 'deletedAt']
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt']
            }
          }
        ],
      })
      let first_name = reservation.dataValues.User.dataValues.first_name;
      let last_name = reservation.dataValues.User.dataValues.last_name;
      const updateReservation = await Reservation.update({status: 'used'},{where: {id}});
      if (updateReservation){
        return res.status(200).send({Message: `Reservation for ${first_name} ${last_name} has been updated to 'used'.`});
      }
    }
    catch(err){
      return res.status(500).send({Message: 'Failed to update reservation, please try again later.', Error: err});
    }
  },
  deleteReservation: async (req, res) => {
    try{
      const id = req.params.id;
      const deleteReservation = await Reservation.destroy({
        where: {id}});
      if (deleteReservation){
        return res.status(200).send({Message: `Reservation with id ${id} has been deleted successfully`})
      }
      else{
        return res.status(404).send({Message: `reservation with id: ${id} has been deleted or is not found.`})
      }
    }
    catch(err){
      return res.status(500).send({Message: 'Reservation unable to update.', Error: err});
    }
  },


}

module.exports = reservationController;