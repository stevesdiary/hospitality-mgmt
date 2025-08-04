const { v4: uuidv4 } = require("uuid");
const {
  Hotel,
  Room,
  Facility,
  RatingAndReview,
  Reservation,
  Sequelize,
} = require("../models");
const Op = Sequelize.Op;

class HotelService {
  async createHotel(hotelData) {
    try {
      const id = uuidv4();
      const hotel = await Hotel.create({
        id,
        ...hotelData
      });
      return hotel;
    } catch (error) {
      throw new Error(`Error creating hotel: ${error.message}`);
    }
  }

  async buildHotelQuery(queryParams) {
    const {
      hotelType,
      search,
      restaurant,
      barLaunge,
      gym,
      roomService,
      wifiInternet,
      dstv,
      security,
      swimmingPool,
      cctv,
      frontDesk24h,
      carHire,
      electricity24h,
      minPrice = 0,
      maxPrice,
    } = queryParams;

    const facilities = {
      restaurant,
      barLaunge,
      gym,
      roomService,
      wifiInternet,
      dstv,
      security,
      swimmingPool,
      cctv,
      frontDesk24h,
      carHire,
      electricity24h
    };

    const whereConditions = {};
    const nameCitySearch = [];

    if (search) {
      nameCitySearch.push({
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { city: { [Op.like]: `%${search}%` } },
          { state: { [Op.like]: `%${search}%` } },
        ],
      });
    }

    if (nameCitySearch.length > 0) {
      whereConditions[Op.and] = [...nameCitySearch];
    }

    if (minPrice !== undefined && maxPrice !== undefined) {
      whereConditions["$rooms.price$"] = {
        [Op.between]: [minPrice, maxPrice],
      };
    }

    if (hotelType !== undefined) {
      whereConditions.hotelType = hotelType;
    }

    if (facilities) {
      const facilityConditions = [
        "restaurant", "barLaunge", "gym", "roomService", "wifiInternet",
        "dstv", "security", "swimmingPool", "cctv", "frontDesk24h",
        "carHire", "electricity24h"
      ];

      facilityConditions.forEach(condition => {
        if (facilities[condition] !== undefined) {
          whereConditions[`$facilities.${condition}$`] = {
            [Op.eq]: facilities[condition],
          };
        }
      });
    }

    return whereConditions;
  }

  async findAllHotels(queryParams) {
    try {
      const whereConditions = await this.buildHotelQuery(queryParams);
      
      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: "rooms",
            attributes: {
              exclude: ["id", "hotelId", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Facility,
            as: "facilities",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: RatingAndReview,
            as: "ratingAndReview",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Reservation,
            as: "reservation",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });

      return { count, hotels };
    } catch (error) {
      throw new Error(`Error finding hotels: ${error.message}`);
    }
  }

  async findTopDeals(queryParams) {
    try {
      const { state } = queryParams;
      const whereConditions = {};
      
      if (state !== undefined) {
        whereConditions.state = state;
      }

      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
          include: [
            [
              Sequelize.literal('(SELECT COUNT(*) FROM `Rooms` WHERE `Rooms`.`hotelId` = `Hotel`.`id` AND `Rooms`.`deals` = true)'),
              'dealsCount',
            ],
          ],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: "rooms",
            attributes: {
              exclude: ["id", "hotelId", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Facility,
            as: "facilities",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: RatingAndReview,
            as: "ratingAndReview",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Reservation,
            as: "reservation",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
        order: [[Sequelize.literal('dealsCount'), 'DESC']],
        limit: 6,
      });

      return { count, hotels };
    } catch (error) {
      throw new Error(`Error finding top deals: ${error.message}`);
    }
  }

  async getTopDestinations(queryParams) {
    try {
      const { city } = queryParams;
      const whereConditions = {};
      
      if (city !== undefined) {
        whereConditions.city = city;
      }

      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: "rooms",
            attributes: {
              exclude: ["id", "hotelId", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Facility,
            as: "facilities",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: RatingAndReview,
            as: "ratingAndReview",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Reservation,
            as: "reservation",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
        limit: 6,
      });

      return { count, hotels };
    } catch (error) {
      throw new Error(`Error getting top destinations: ${error.message}`);
    }
  }

  async getHotelsByCity() {
    try {
      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
          include: [
            [
              Sequelize.literal('(SELECT COUNT(*) FROM `Hotels` WHERE `Hotels`.`city` = `Hotel`.`city`)'),
              'citiesCount',
            ],
          ],
        },
        include: [
          {
            model: Room,
            as: "rooms",
            attributes: {
              exclude: ["id", "hotelId", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Facility,
            as: "facilities",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: RatingAndReview,
            as: "ratingAndReview",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Reservation,
            as: "reservation",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
        group: ['Hotel.city'],
        order: [[Sequelize.literal('citiesCount'), 'DESC']],
        limit: 6,
      });

      return { count, hotels };
    } catch (error) {
      throw new Error(`Error getting hotels by city: ${error.message}`);
    }
  }

  async findHotelsByDate(queryParams) {
    try {
      const { dateIn, dateOut } = queryParams;
      const whereConditions = {};
      
      if (dateIn !== undefined && dateOut !== undefined) {
        whereConditions["$reservation.dateIn$"] = {
          [Op.between]: [dateIn, dateOut],
        };
      }

      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: "rooms",
            attributes: {
              exclude: ["id", "hotelId", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Facility,
            as: "facilities",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: RatingAndReview,
            as: "ratingAndReview",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Reservation,
            as: "reservation",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });

      return { count, hotels };
    } catch (error) {
      throw new Error(`Error finding hotels by date: ${error.message}`);
    }
  }

  async getTopHotelsByState(queryParams) {
    try {
      const { state } = queryParams;
      const whereConditions = {};
      
      if (state !== undefined) {
        whereConditions.state = state;
      }

      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
          include: [
            Sequelize.literal('(SELECT COUNT(*) FROM "Reservations" WHERE "Reservations"."hotelId" = "Hotel"."id")'),
            'reservationCount',
          ],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: "rooms",
            attributes: {
              exclude: ["id", "hotelId", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Facility,
            as: "facilities",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: RatingAndReview,
            as: "ratingAndReview",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Reservation,
            as: "reservation",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
        group: ['Hotel.id'],
        order: [[Sequelize.literal('reservationCount'), 'DESC']],
        limit: 6,
      });

      return { count, hotels };
    } catch (error) {
      throw new Error(`Error getting top hotels by state: ${error.message}`);
    }
  }

  async findHotelById(id) {
    try {
      const hotel = await Hotel.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: [
          {
            model: Room,
            as: "rooms",
            attributes: {
              exclude: ["id", "hotelId", "createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Facility,
            as: "facilities",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: RatingAndReview,
            as: "ratingAndReview",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
          {
            model: Reservation,
            as: "reservation",
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
          },
        ],
      });

      if (!hotel) {
        throw new Error('Hotel not found');
      }

      return hotel;
    } catch (error) {
      throw new Error(`Error finding hotel: ${error.message}`);
    }
  }

  async updateHotel(id, updateData) {
    try {
      const [updatedRows] = await Hotel.update(updateData, { where: { id } });
      
      if (updatedRows === 0) {
        throw new Error('Hotel not found or no changes made');
      }
      
      return await this.findHotelById(id);
    } catch (error) {
      throw new Error(`Error updating hotel: ${error.message}`);
    }
  }

  async deleteHotel(id) {
    try {
      const deletedRows = await Hotel.destroy({ where: { id } });
      
      if (deletedRows === 0) {
        throw new Error('Hotel not found');
      }
      
      return { message: `Hotel with id ${id} deleted successfully` };
    } catch (error) {
      throw new Error(`Error deleting hotel: ${error.message}`);
    }
  }
}

module.exports = new HotelService();
