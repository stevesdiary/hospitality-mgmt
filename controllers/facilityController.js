const facilityService = require('../services/facilityService');
const { resolveCompanyScope } = require('../middleware/tenantGuard');

const facilityController = {
  createFacility: async (req, res) => {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        return res.status(400).json({ message: 'A companyId is required to create a facility' });
      }
      const facility = await facilityService.createFacility(req.body, companyId);
      return res.status(201).send({ message: 'Facility created successfully', Facility: facility });
    } catch (error) {
      return res.status(500).send({ message: 'An error occurred, facility not created', Error: error.message });
    }
  },

  updateFacility: async (req, res) => {
    try {
      const { id } = req.params;
      const facility = await facilityService.updateFacility(id, req.body);
      return res.status(200).send({ message: 'Facility updated successfully', Facility: facility });
    } catch (error) {
      return res.status(500).send({ message: 'An error occurred, facility not updated', Error: error.message });
    }
  },

  getFacility: async (req, res) => {
    try {
      const { hotel_id } = req.params;
      const facility = await facilityService.getFacilityByHotelId(hotel_id);
      return res.status(200).send({ Message: 'Record found', Record: facility });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).send({
        Message: error.message.includes('not found') ? 'Facility record not found' : 'Error occurred!',
        Error: error.message
      });
    }
  },

  getAllFacilities: async (req, res) => {
    try {
      const companyId = resolveCompanyScope(req);
      const facilities = await facilityService.getAllFacilities(companyId);
      return res.status(200).send({ message: 'Records found', Records: facilities });
    } catch (error) {
      return res.status(500).send({ message: 'Error occurred!', Error: error.message });
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
        message: error.message.includes('not found') ? `Facility record with id ${req.params.id} not found` : 'Error occurred!',
        Error: error.message
      });
    }
  }
};

module.exports = facilityController;
