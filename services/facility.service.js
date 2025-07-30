const { v4: uuidv4 } = require('uuid');
const { Facility } = require('../models');

class FacilityService {
  async createFacility(facilityData) {
    try {
      const id = uuidv4();
      const facility = await Facility.create({
        id,
        ...facilityData
      });
      
      return facility;
    } catch (error) {
      throw new Error(`Error creating facility: ${error.message}`);
    }
  }

  async updateFacility(id, updateData) {
    try {
      const [updatedRows] = await Facility.update(updateData, { where: { id } });
      
      if (updatedRows === 0) {
        throw new Error('Facility not found or no changes made');
      }
      
      return await this.getFacilityById(id);
    } catch (error) {
      throw new Error(`Error updating facility: ${error.message}`);
    }
  }

  async getFacilityByHotelId(hotelId) {
    try {
      const facility = await Facility.findOne({
        where: { hotelId },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        }
      });
      
      if (!facility) {
        throw new Error('Facility record not found');
      }
      
      return facility;
    } catch (error) {
      throw new Error(`Error fetching facility: ${error.message}`);
    }
  }

  async getAllFacilities() {
    try {
      return await Facility.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        }
      });
    } catch (error) {
      throw new Error(`Error fetching facilities: ${error.message}`);
    }
  }

  async deleteFacility(id) {
    try {
      const deletedRows = await Facility.destroy({ where: { id } });
      
      if (deletedRows === 0) {
        throw new Error('Facility not found');
      }
      
      return { message: `Facility with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(`Error deleting facility: ${error.message}`);
    }
  }

  async getFacilityById(id) {
    try {
      const facility = await Facility.findByPk(id, {
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt']
        }
      });
      
      if (!facility) {
        throw new Error('Facility not found');
      }
      
      return facility;
    } catch (error) {
      throw new Error(`Error fetching facility: ${error.message}`);
    }
  }
}

module.exports = new FacilityService();