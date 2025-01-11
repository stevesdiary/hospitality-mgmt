const { v4: uuidv4 } = require('uuid');
const { Facility, Hotel, Room } = require('../models');
const verifyUserType = require('../middleware/verifyUserType');
const facilityController = {
  createFacility: async (req, res) => {
    try{
      const id = uuidv4();
      const { 
        hotelId,
        restaurant,
        barLaunge,
        security,
        wifiInternet,
        swimmingPool,
        dstv,
        gym,
        cctv,
        carHire,
        roomService,
        frontDesk24h,
        electricity24h,
        carPark 
      } = req.body;
      console.log(req.body);
      const facility = await Facility.create({
        id,
        hotelId,
        restaurant,
        barLaunge,
        security,
        wifiInternet,
        swimmingPool,
        dstv,
        gym,
        cctv,
        carHire,
        roomService,
        frontDesk24h,
        electricity24h,
        carPark
      });

      if (facility == 1) {
        console.log('Facilities created', facility);
        return res.status(201).send({message: 'Facility created successfully', Facility: facility});
      }
    }
    catch(err){
      return res.status(500).send({message: 'An error occoured, facility not created', Error: err});
    }
  },

  updateFacility: async (req, res) => {
    try{
      const id = req.params.id;
      const {
        restaurant,
        barLaunge,
        security,
        wifiInternet,
        swimmingPool,
        dstv,
        gym,
        cctv,
        carHire,
        roomService,
        frontDesk24h,
        electricity24h,
        carPark  
      } = req.body;
      const facility = await Facility.update({
        restaurant,
        barLaunge,
        security,
        wifiInternet,
        swimmingPool,
        dstv,
        gym,
        cctv,
        carHire,
        roomService,
        frontDesk24h,
        electricity24h,
        carPark, 
      }, {where: {id}});
      if (facility == 1) {
        console.log('Facilities updated successfully.', facility);
        return res.status(200).send({message: 'Facility updated successfully', Facility: facility});
      }
    }
    catch(err){
      return res.status(500).send({message: 'An error occoured, facility not updated', Error: err});
    }
  },
  
  getFacility: async (req, res) => {
    try{
      const hotelId = req.params.hotelId;
      console.log(hotelId)
      const facility = await Facility.findOne({
        where: {hotelId},
        attributes: {
          exclude: [ 'createdAt', 'updatedAt', 'deletedAt']
        },
      });
      if (facility.length == 0 ) {
        console.log(facility.length, 'facility length')
        return res.status(404).send({ Message: 'Facility record not found' })
      }
      return res.status(200).send({ Message: 'Record found', Record: facility });
    }
    catch(err){
      return res.status(500).send({ Message: 'Error occoured!', Error: err.message });
    }
  },

  getAllFacilities: async (req, res) => {
    try{
      const facilities = await Facility.findAll({
        attributes: {
          exclude: [ 'createdAt', 'updatedAt', 'deletedAt']
        },
      });
      return res.status(200).send({message: 'Records found', Records: facilities});
    }
    catch(err){
      return res.status(500).send({message: 'Error occoured!', Error: err});
    }
  },

  deleteFacility: async (req, res) => {
    try{
      const id = req.params.id;
      const facility = await Facility.destroy({where: {id}});
      if (facility == 1) {
        return res.status(500).send({message: `Facility record with id ${id} has been deleted successfully`});
      }
      // if(facility == 0){
      //   return res.send({message: `Facility record with id ${id} does not exist or is deleted in the database`});
      // }
    }
    catch(err){
      return res.status(500).send({message: 'Error occoured!', Error: err});
    }
  }
};

module.exports = facilityController;