/**
 * Reservation Controller
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Reservation, Hotel, Room, User } from '../models';

const GUEST_INCLUDE = [
  { model: User, as: 'User', attributes: { exclude: ['password'] } },
  { model: Hotel, as: 'Hotel' },
  { model: Room, as: 'Room' },
];

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

    const { hotelId, roomId, dateIn, dateOut, guestCount } = req.body;

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
      guestCount: guestCount || 1,
      status: 'pending',
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
    const reservation = await Reservation.findOne({ where: { id }, include: GUEST_INCLUDE });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    return res.status(200).json({ message: 'Reservation retrieved', reservation });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve reservation', error: err.message });
  }
};

/** Front-desk lookup — returns full guest details for check-in screen */
export const lookupReservation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({ where: { id }, include: GUEST_INCLUDE });
    if (!reservation) return res.status(404).json({ message: 'Booking not found. Please verify the booking number.' });
    return res.status(200).json({ message: 'Booking found', reservation });
  } catch (err: any) {
    return res.status(500).json({ message: 'Lookup failed', error: err.message });
  }
};

export const checkIn = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.status === 'checked-in') {
      return res.status(409).json({ message: 'Guest is already checked in' });
    }
    if (reservation.status === 'checked-out') {
      return res.status(409).json({ message: 'Reservation is already completed' });
    }
    if (reservation.status === 'cancelled') {
      return res.status(409).json({ message: 'Cannot check in a cancelled reservation' });
    }

    await reservation.update({
      status: 'checked-in',
      checkInTime: new Date(),
    });

    const full = await Reservation.findOne({ where: { id }, include: GUEST_INCLUDE });
    return res.status(200).json({ message: 'Guest checked in successfully', reservation: full });
  } catch (err: any) {
    return res.status(500).json({ message: 'Check-in failed', error: err.message });
  }
};

export const checkOut = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    if (reservation.status !== 'checked-in') {
      return res.status(409).json({ message: 'Guest must be checked in before checking out' });
    }

    await reservation.update({
      status: 'checked-out',
      checkOutTime: new Date(),
    });

    const full = await Reservation.findOne({ where: { id }, include: GUEST_INCLUDE });
    return res.status(200).json({ message: 'Guest checked out successfully', reservation: full });
  } catch (err: any) {
    return res.status(500).json({ message: 'Check-out failed', error: err.message });
  }
};

export const getAllReservations = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const where: any = {};
    if (companyId) where.companyId = companyId;

    const { count, rows: reservations } = await Reservation.findAndCountAll({
      where,
      include: GUEST_INCLUDE,
      order: [['createdAt', 'DESC']],
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
