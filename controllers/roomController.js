const { v4: uuidv4 } = require('uuid');
const { Room, Hotel } = require('../models');
const { resolveCompanyScope } = require('../middleware/tenantGuard');

const roomController = {
  createRoom: async (req, res) => {
    try {
      const { hotelEmail, category, capacity, checkIn, deals, checkOut, description,
              availability, discount, price, condition, additionalRequest } = req.body;

      const hotel = await Hotel.findOne({ where: { contactEmail: hotelEmail } });
      if (!hotel) {
        return res.status(404).send({ Message: 'Hotel not found so rooms cannot be created.' });
      }

      // org_admin can only create rooms for their own company's hotels
      const user = req.user;
      if (user.type === 'org_admin' && hotel.companyId !== user.companyId) {
        return res.status(403).json({ message: 'You cannot create rooms for a hotel outside your company' });
      }

      const discountOff = Math.round(price * ((deals || 0) / 100));
      const discountedPrice = price - discountOff;
      const id = uuidv4();

      const room = await Room.create({
        id,
        hotelId: hotel.id,
        companyId: hotel.companyId,
        category, capacity, deals, checkIn, checkOut, description,
        availability, discount, price, discountedPrice, condition, additionalRequest
      });

      return res.status(201).send({ message: 'Room created successfully', data: room });
    } catch (err) {
      return res.status(500).send({ message: 'An error occurred', error: err.message });
    }
  },

  getAllRooms: async (req, res) => {
    try {
      const companyId = resolveCompanyScope(req);
      const where = companyId ? { companyId } : {};
      const rooms = await Room.findAll({ where });
      return res.status(200).send({ message: 'Records found', data: rooms });
    } catch (err) {
      return res.status(500).send({ message: 'An error occurred', error: err.message });
    }
  },

  getRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const room = await Room.findOne({ where: { id } });
      if (!room) {
        return res.status(404).send({ message: 'Room not found' });
      }
      return res.status(200).send({ message: 'Record found', room });
    } catch (err) {
      return res.status(500).send({ message: 'An error occurred', error: err.message });
    }
  },

  updateRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const { category, capacity, deals, description, availability, price, condition } = req.body;
      const discountOff = Math.round(price * ((deals || 0) / 100));
      const discountedPrice = price - discountOff;
      await Room.update(
        { category, capacity, description, availability, deals, price, discountedPrice, condition },
        { where: { id } }
      );
      return res.status(200).send({ message: `Room ${id} updated successfully` });
    } catch (err) {
      return res.status(500).send({ message: 'Room unable to update', error: err.message });
    }
  },

  deleteRoom: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Room.destroy({ where: { id } });
      if (deleted === 1) {
        return res.status(200).send({ message: `Room ${id} deleted successfully` });
      }
      return res.status(404).send({ message: `Room ${id} does not exist or is already deleted` });
    } catch (err) {
      return res.status(500).send({ message: 'Error deleting room', error: err.message });
    }
  }
};

module.exports = roomController;
