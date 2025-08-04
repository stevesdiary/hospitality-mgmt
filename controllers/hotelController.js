const hotelService = require('../services/hotelService');

const hotelController = {
  createHotel: async (req, res) => {
    try {
      const hotel = await hotelService.createHotel(req.body);
      return res
        .status(201)
        .send({ message: "Record created.", data: hotel });
    } catch (error) {
      return res.status(500).send({ 
        message: "An error occurred", 
        error: error.message 
      });
    }
  },

  findAllHotel: async (req, res) => {
    try {
      const { count, hotels } = await hotelService.findAllHotels(req.query);
      
      if (count === 0) {
        return res.status(404).send({
          Message: "No record found for this search, try checking the search parameters.",
        });
      }
      
      return res
        .status(200)
        .send({ 
          Message: `Hotel records found.`, 
          Count: count, 
          Hotel: hotels 
        });
    } catch (error) {
      return res.status(500).send({ 
        Message: "An error occurred", 
        Error: error.message 
      });
    }
  },

  topDeals: async (req, res) => {
    try {
      const { count, hotels } = await hotelService.findTopDeals(req.query);
      return res
        .status(200)
        .send({ 
          Message: `Hotel records found.`, 
          Count: count, 
          Hotel: hotels 
        });
    } catch (error) {
      return res.status(500).send({ 
        Message: "An error occurred", 
        Error: error.message 
      });
    }
  },

  getTopDestinations: async (req, res) => {
    try {
      const { count, hotels } = await hotelService.getTopDestinations(req.query);
      return res
        .status(200)
        .send({ 
          Message: `Hotel records found.`, 
          Count: count, 
          Hotel: hotels 
        });
    } catch (error) {
      return res.status(500).send({ 
        Message: "An error occurred", 
        Error: error.message 
      });
    }
  },

  hotelsByCity: async (req, res) => {
    try {
      const { count, hotels } = await hotelService.getHotelsByCity();
      return res
        .status(200)
        .send({ 
          Message: `Hotel records found.`, 
          Count: count, 
          Hotel: hotels 
        });
    } catch (error) {
      return res.status(500).send({ 
        Message: "An error occurred", 
        Error: error.message 
      });
    }
  },

  findHotelByDate: async (req, res) => {
    try {
      const { count, hotels } = await hotelService.findHotelsByDate(req.query);
      
      if (count === 0) {
        return res.status(404).send({
          Message: "No record found for this date range.",
        });
      }
      
      return res
        .status(200)
        .send({ 
          Message: `Hotel records found.`, 
          Count: count, 
          Hotel: hotels 
        });
    } catch (error) {
      return res.status(500).send({ 
        Message: "An error occurred", 
        Error: error.message 
      });
    }
  },

  topHotelsByState: async (req, res) => {
    try {
      const { count, hotels } = await hotelService.getTopHotelsByState(req.query);
      return res
        .status(200)
        .send({ 
          Message: `Hotel records found.`, 
          Count: count, 
          Hotel: hotels 
        });
    } catch (error) {
      return res.status(500).send({ 
        Message: "An error occurred", 
        Error: error.message 
      });
    }
  },

  findOneHotel: async (req, res) => {
    try {
      const { id } = req.params;
      const hotel = await hotelService.findHotelById(id);
      return res
        .status(200)
        .send({ Message: "Hotel record found.", Hotel: hotel });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).send({ 
        Message: error.message.includes('not found') 
          ? "Hotel not found." 
          : "An error occurred",
        Error: error.message 
      });
    }
  },

  updateHotel: async (req, res) => {
    try {
      const { id } = req.params;
      const hotel = await hotelService.updateHotel(id, req.body);
      return res
        .status(200)
        .send({ Message: "Record updated.", Hotel: hotel });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).send({ 
        Message: error.message.includes('not found') 
          ? "Hotel not found." 
          : "An error occurred",
        Error: error.message 
      });
    }
  },

  deleteHotel: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await hotelService.deleteHotel(id);
      return res.send(result);
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      return res.status(statusCode).send({ 
        message: error.message.includes('not found') 
          ? `Hotel with id ${id} not found` 
          : "An error occurred",
        error: error.message 
      });
    }
  },
};

module.exports = hotelController;
