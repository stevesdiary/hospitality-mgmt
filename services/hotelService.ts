/**
 * Hotel Service - TypeScript Version
 */

import { v4 as uuidv4 } from 'uuid';
import { Hotel, Room, Facility, RatingAndReview, Reservation, Sequelize } from '../models';
import { HotelInstance } from '../models/hotel';
import { HotelSearchQuery } from '../types';
import { Op } from 'sequelize';

class HotelService {
  async createHotel(hotelData: Partial<HotelInstance>): Promise<HotelInstance> {
    try {
      const id = uuidv4();
      const hotel = await Hotel.create({
        id,
        ...hotelData,
      });
      return hotel;
    } catch (error: any) {
      throw new Error(`Error creating hotel: ${error.message}`);
    }
  }

  async buildHotelQuery(queryParams: HotelSearchQuery): Promise<any> {
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
      electricity24h,
    };

    const whereConditions: any = {};
    const nameCitySearch: any[] = [];

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
      whereConditions['$rooms.price$'] = {
        [Op.between]: [minPrice, maxPrice],
      };
    }

    if (hotelType !== undefined) {
      whereConditions.hotelType = hotelType;
    }

    if (facilities) {
      const facilityConditions = [
        'restaurant',
        'barLaunge',
        'gym',
        'roomService',
        'wifiInternet',
        'dstv',
        'security',
        'swimmingPool',
        'cctv',
        'frontDesk24h',
        'carHire',
        'electricity24h',
      ];

      facilityConditions.forEach((condition) => {
        if ((facilities as any)[condition] !== undefined) {
          whereConditions[`$facilities.${condition}$`] = {
            [Op.eq]: (facilities as any)[condition],
          };
        }
      });
    }

    return whereConditions;
  }

  async findAllHotels(queryParams: HotelSearchQuery): Promise<{ count: number; hotels: HotelInstance[] }> {
    try {
      const whereConditions = await this.buildHotelQuery(queryParams);

      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: {
              exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Facility,
            as: 'facilities',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: RatingAndReview,
            as: 'ratingAndReview',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
        ],
      });

      return { count, hotels };
    } catch (error: any) {
      throw new Error(`Error finding hotels: ${error.message}`);
    }
  }

  async findTopDeals(queryParams: HotelSearchQuery): Promise<{ count: number; hotels: HotelInstance[] }> {
    try {
      const { state } = queryParams;
      const whereConditions: any = {};

      if (state !== undefined) {
        whereConditions.state = state;
      }

      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          include: [
            [Sequelize.literal('(SELECT COUNT(*) FROM `Rooms` WHERE `Rooms`.`hotelId` = `Hotel`.`id` AND `Rooms`.`deals` = true)'), 'dealsCount'] as any,
          ],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: {
              exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Facility,
            as: 'facilities',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: RatingAndReview,
            as: 'ratingAndReview',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
        ],
        order: [[Sequelize.literal('dealsCount'), 'DESC']],
        limit: 6,
      });

      return { count, hotels };
    } catch (error: any) {
      throw new Error(`Error finding top deals: ${error.message}`);
    }
  }

  async getTopDestinations(queryParams: HotelSearchQuery): Promise<{ count: number; hotels: HotelInstance[] }> {
    try {
      const { city } = queryParams;
      const whereConditions: any = {};

      if (city !== undefined) {
        whereConditions.city = city;
      }

      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: {
              exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Facility,
            as: 'facilities',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: RatingAndReview,
            as: 'ratingAndReview',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
        ],
        limit: 6,
      });

      return { count, hotels };
    } catch (error: any) {
      throw new Error(`Error getting top destinations: ${error.message}`);
    }
  }

  async getHotelsByCity(): Promise<{ count: number; hotels: HotelInstance[] }> {
    try {
      const result = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          include: [
            [Sequelize.literal('(SELECT COUNT(*) FROM `Hotels` WHERE `Hotels`.`city` = `Hotel`.`city`)'), 'citiesCount'] as any,
          ],
        },
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: {
              exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Facility,
            as: 'facilities',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: RatingAndReview,
            as: 'ratingAndReview',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
        ],
        group: ['Hotel.city'],
        order: [[Sequelize.literal('citiesCount'), 'DESC']],
        limit: 6,
      });

      const count = Array.isArray(result.count) ? result.count.length : result.count;
      const hotels = result.rows;

      return { count, hotels };
    } catch (error: any) {
      throw new Error(`Error getting hotels by city: ${error.message}`);
    }
  }

  async findHotelsByDate(queryParams: HotelSearchQuery): Promise<{ count: number; hotels: HotelInstance[] }> {
    try {
      const { dateIn, dateOut } = queryParams;
      const whereConditions: any = {};

      if (dateIn !== undefined && dateOut !== undefined) {
        whereConditions['$reservation.dateIn$'] = {
          [Op.between]: [dateIn, dateOut],
        };
      }

      const { count, rows: hotels } = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: {
              exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Facility,
            as: 'facilities',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: RatingAndReview,
            as: 'ratingAndReview',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
        ],
      });

      return { count, hotels };
    } catch (error: any) {
      throw new Error(`Error finding hotels by date: ${error.message}`);
    }
  }

  async getTopHotelsByState(queryParams: HotelSearchQuery): Promise<{ count: number; hotels: HotelInstance[] }> {
    try {
      const { state } = queryParams;
      const whereConditions: any = {};

      if (state !== undefined) {
        whereConditions.state = state;
      }

      const result = await Hotel.findAndCountAll({
        distinct: true,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
          include: [
            [Sequelize.literal('(SELECT COUNT(*) FROM "Reservations" WHERE "Reservations"."hotelId" = "Hotel"."id")'), 'reservationCount'] as any,
          ],
        },
        where: whereConditions,
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: {
              exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Facility,
            as: 'facilities',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: RatingAndReview,
            as: 'ratingAndReview',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
        ],
        group: ['Hotel.id'],
        order: [[Sequelize.literal('reservationCount'), 'DESC']],
        limit: 6,
      });

      const count = Array.isArray(result.count) ? result.count.length : result.count;
      const hotels = result.rows;

      return { count, hotels };
    } catch (error: any) {
      throw new Error(`Error getting top hotels by state: ${error.message}`);
    }
  }

  async findHotelById(id: string): Promise<HotelInstance> {
    try {
      const hotel = await Hotel.findOne({
        where: { id },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
        include: [
          {
            model: Room,
            as: 'rooms',
            attributes: {
              exclude: ['id', 'hotelId', 'createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Facility,
            as: 'facilities',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: RatingAndReview,
            as: 'ratingAndReview',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
          {
            model: Reservation,
            as: 'reservation',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt'],
            },
          },
        ],
      });

      if (!hotel) {
        throw new Error('Hotel not found');
      }

      return hotel;
    } catch (error: any) {
      throw new Error(`Error finding hotel: ${error.message}`);
    }
  }

  async updateHotel(id: string, updateData: Partial<HotelInstance>): Promise<HotelInstance> {
    try {
      const [updatedRows] = await Hotel.update(updateData, { where: { id } });

      if (updatedRows === 0) {
        throw new Error('Hotel not found or no changes made');
      }

      return await this.findHotelById(id);
    } catch (error: any) {
      throw new Error(`Error updating hotel: ${error.message}`);
    }
  }

  async deleteHotel(id: string): Promise<{ message: string }> {
    try {
      const deletedRows = await Hotel.destroy({ where: { id } });

      if (deletedRows === 0) {
        throw new Error('Hotel not found');
      }

      return { message: `Hotel with id ${id} deleted successfully` };
    } catch (error: any) {
      throw new Error(`Error deleting hotel: ${error.message}`);
    }
  }
}

export default new HotelService();
