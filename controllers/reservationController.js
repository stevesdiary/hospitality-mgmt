const { v4: uuidv4 } = require('uuid');
const { Reservation, User, Room, Hotel, Facility } = require('../models');
const moment = require('moment');
const { resolveCompanyScope } = require('../middleware/tenantGuard');

const reservationController = {
  createReservation: async (req, res) => {
    try {
      const { hotelId, roomId, dateIn, dateOut, paymentStatus } = req.body;
      const userId = req.user?.id;

      const hotel = await Hotel.findByPk(hotelId, { attributes: ['id', 'companyId'] });
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      const id = uuidv4();
      const reservation = await Reservation.create({
        id,
        hotelId,
        roomId,
        userId,
        companyId: hotel.companyId,
        dateIn,
        dateOut,
        paymentStatus
      });

      return res.status(201).json({ message: `Reservation created with id: ${id}`, Record: reservation });
    } catch (err) {
      return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findOne({
        where: { id },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [
          { model: User, attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'deletedAt'] } },
          {
            model: Hotel,
            attributes: { exclude: ['id', 'description', 'termsAndConditions', 'createdAt', 'updatedAt', 'deletedAt'] },
            include: [{ model: Facility, as: 'facilities', attributes: { exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'] } }]
          },
          { model: Room, attributes: { exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'] } }
        ]
      });

      if (!reservation) {
        return res.status(404).json({ message: `Reservation ${id} does not exist or is deleted` });
      }
      return res.status(200).json({ message: 'Reservation record found', data: reservation });
    } catch (err) {
      return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const companyId = resolveCompanyScope(req);
      const where = companyId ? { companyId } : {};

      const reservations = await Reservation.findAll({
        where,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [
          { model: User, attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt', 'deletedAt'] } },
          {
            model: Hotel,
            attributes: { exclude: ['id', 'description', 'termsAndConditions', 'createdAt', 'updatedAt', 'deletedAt'] },
            include: [{ model: Facility, as: 'facilities', attributes: { exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'] } }]
          },
          { model: Room, attributes: { exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'] } }
        ]
      });

      if (!reservations.length) {
        return res.status(404).json({ message: 'No reservations found' });
      }
      return res.status(200).json({ message: 'Reservation records found', data: reservations });
    } catch (err) {
      return res.status(500).json({ message: 'An error occurred', error: err.message });
    }
  },

  updateReservation: async (req, res) => {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findOne({
        where: { id },
        include: [{ model: User, attributes: ['firstName', 'lastName'] }]
      });
      if (!reservation) {
        return res.status(404).json({ message: `Reservation ${id} not found` });
      }
      const { firstName, lastName } = reservation.User;
      await Reservation.update({ status: 'used' }, { where: { id } });
      return res.status(200).json({ Message: `Reservation for ${firstName} ${lastName} has been updated to 'used'.` });
    } catch (err) {
      return res.status(500).json({ Message: 'Failed to update reservation', Error: err.message });
    }
  },

  removeReservations: async (req, res) => {
    try {
      const companyId = resolveCompanyScope(req);
      const where = { status: 'used', ...(companyId ? { companyId } : {}) };
      const deleted = await Reservation.destroy({ where });
      if (deleted) {
        return res.status(200).json({ Message: 'Used reservations deleted successfully.' });
      }
      return res.status(404).json({ message: 'No used reservations found.' });
    } catch (err) {
      return res.status(500).json({ Message: 'Multiple reservations unable to delete.', Error: err.message });
    }
  },

  deleteReservation: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Reservation.destroy({ where: { id } });
      if (deleted) {
        return res.status(200).json({ Message: `Reservation ${id} deleted successfully` });
      }
      return res.status(404).json({ Message: `Reservation ${id} not found or already deleted.` });
    } catch (err) {
      return res.status(500).json({ Message: 'Reservation unable to delete.', Error: err.message });
    }
  }
};

module.exports = reservationController;
