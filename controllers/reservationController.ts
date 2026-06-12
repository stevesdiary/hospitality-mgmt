/**
 * Reservation Controller
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Reservation, Hotel, Room, User } from '../models';

const resolveCompanyScope = (req: Request): string | null => {
  const user = req.user;
  if (!user) return null;
  if (user.type === 'admin') return null;
  return user.companyId || null;
};

export const createReservation = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { hotelId, roomId, dateIn, dateOut } = req.body;

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const companyId = (hotel as any).companyId;
    const id = uuidv4();

    const reservation = await Reservation.create({
      id,
      userId,
      hotelId,
      roomId,
      companyId,
      dateIn,
      dateOut,
      ...req.body,
    });

    return res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create reservation', error: err.message });
  }
};

export const getOneReservation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({
      where: { id },
      include: [
        { model: User, as: 'User', attributes: { exclude: ['password'] } },
        {
          model: Hotel,
          as: 'Hotel',
        },
        { model: Room, as: 'Room' },
      ],
    });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    return res.status(200).json({ message: 'Reservation retrieved', reservation });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve reservation', error: err.message });
  }
};

export const getAllReservations = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const where: any = {};
    if (companyId) where.companyId = companyId;

    const { count, rows: reservations } = await Reservation.findAndCountAll({
      where,
      include: [
        { model: User, as: 'User', attributes: { exclude: ['password'] } },
        { model: Hotel, as: 'Hotel' },
        { model: Room, as: 'Room' },
      ],
    });
    return res.status(200).json({ message: 'Reservations retrieved', Count: count, Reservations: reservations });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve reservations', error: err.message });
  }
};

export const updateReservation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const [updated] = await Reservation.update(req.body, { where: { id } });
    if (updated === 0) return res.status(404).json({ message: 'Reservation not found' });
    const reservation = await Reservation.findByPk(id);
    return res.status(200).json({ message: 'Reservation updated', reservation });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to update reservation', error: err.message });
  }
};

export const removeAllReservations = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const where: any = {};
    if (companyId) where.companyId = companyId;
    const deleted = await Reservation.destroy({ where });
    return res.status(200).json({ message: `${deleted} reservations deleted` });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to remove reservations', error: err.message });
  }
};

export const deleteReservation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deleted = await Reservation.destroy({ where: { id } });
    if (deleted === 0) return res.status(404).json({ message: 'Reservation not found' });
    return res.status(200).json({ message: `Reservation ${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete reservation', error: err.message });
  }
};
