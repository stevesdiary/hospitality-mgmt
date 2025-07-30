const facilityService = require('../services/facilityService');
const verifyUserType = require('../middleware/verifyUserType');

const facilityController = {
  createFacility: async (req, res) => {
    try {
      const facility = await facilityService.createFacility(req.body);
      return res.status(201).send({
        message: 'Facility created successfully',
        Facility: facility
      });
    } catch (error) {
      return res.status(500).send({
        message: 'An error occurred, facility not created',
        Error: error.message
      });
    }
  },

  updateFacility: async (req, res) => {
    try {
      const { id } = req.params;
      const facility = await facilityService.updateFacility(id, req.body);
      return res.status(200).send({
        message: 'Facility updated successfully',
        Facility: facility
      });
    } catch (error) {
      return res.status(500).send({
        message: 'An error occurred, facility not updated',
        Error: error.message
      });
    }
  },

  getFacility: async (req, res) => {
    try {
      const { hotelId } = req.params;
      const facility = await facilityService.getFacilityByHotelId(hotelId);
      return res.status(200).send({
        Message: 'Record found',
        Record: facility
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).send({
        Message: error.message.includes('not found') 
          ? 'Facility record not found' 
          : 'Error occurred!',
        Error: error.message
      });
    }
  },

  getAllFacilities: async (req, res) => {
    try {
      const facilities = await facilityService.getAllFacilities();
      return res.status(200).send({
        message: 'Records found',
        Records: facilities
      });
    } catch (error) {
      return res.status(500).send({
        message: 'Error occurred!',
        Error: error.message
      });
    }
  },

  deleteFacility: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await facilityService.deleteFacility(id);
      return res.status(200).send(result);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).send({
        message: error.message.includes('not found') 
          ? `Facility record with id ${id} not found` 
          : 'Error occurred!',
        Error: error.message
      });
    }
  }
};

module.exports = facilityController;