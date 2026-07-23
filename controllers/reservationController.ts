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

/**
 * Whether the requester may access a given reservation.
 * - Platform admin ('admin'): every tenant.
 * - Hotel staff (org_admin/staff): only reservations for their own company.
 * - Guest: only their own reservations.
 */
const canAccessReservation = (req: Request, reservation: any): boolean => {
  const user = req.user;
  if (!user) return false;
  if (user.type === 'admin') return true;
  if (user.companyId && reservation.companyId === user.companyId) return true;
  return reservation.userId === user.id;
};

// Fields that must never be set from the client body — they are derived from
// the hotel / authenticated user or controlled by dedicated endpoints.
const RESERVATION_PROTECTED_FIELDS = ['id', 'companyId', 'userId', 'status', 'checkInTime', 'checkOutTime'];

const stripProtectedFields = (body: Record<string, any>): Record<string, any> => {
  const clean = { ...body };
  for (const field of RESERVATION_PROTECTED_FIELDS) delete clean[field];
  return clean;
};

export const createReservation = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { hotelId, roomId, dateIn, dateOut, guestCount } = req.body;
    if (!hotelId || !roomId) {
      return res.status(400).json({ message: 'hotelId and roomId are required' });
    }

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    // The room must belong to the hotel being booked, so the reservation binds
    // to a single, consistent tenant.
    const room = await Room.findByPk(roomId);
    if (!room || (room as any).hotelId !== hotelId) {
      return res.status(400).json({ message: 'Room does not belong to the specified hotel' });
    }

    const companyId = (hotel as any).companyId;

    const reservation = await Reservation.create({
      // Client-supplied extras first, then authoritative fields override them so
      // companyId/userId/status can never be spoofed via the request body.
      ...stripProtectedFields(req.body),
      id: uuidv4(),
      userId,
      hotelId,
      roomId,
      companyId,
      dateIn,
      dateOut,
      guestCount: guestCount || 1,
      status: 'pending',
    });

    return res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create reservation', error: err.message });
  }
};

/** Generate a short, human-friendly booking reference unique across reservations. */
const generateBookingReference = async (): Promise<string> => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous 0/O/1/I
  for (let attempt = 0; attempt < 6; attempt++) {
    let code = '';
    for (let i = 0; i < 8; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    const reference = `BK-${code}`;
    const clash = await Reservation.findOne({ where: { bookingReference: reference }, paranoid: false });
    if (!clash) return reference;
  }
  // Extremely unlikely; fall back to a UUID-derived reference.
  return `BK-${uuidv4().split('-')[0].toUpperCase()}`;
};

/**
 * Guest checkout — book a hotel from its own public page WITHOUT an account.
 * The guest supplies their contact details; the reservation binds to the
 * hotel's tenant (companyId derived from the hotel) and gets a booking
 * reference the guest presents at the front desk for check-in.
 */
export const createGuestReservation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { hotelId, roomId, dateIn, dateOut, guestCount, guest } = req.body;
    if (!hotelId || !roomId) {
      return res.status(400).json({ message: 'hotelId and roomId are required' });
    }
    if (!dateIn || !dateOut) {
      return res.status(400).json({ message: 'dateIn and dateOut are required' });
    }
    const guestName = guest?.name ?? req.body.guestName;
    const guestEmail = guest?.email ?? req.body.guestEmail;
    const guestPhone = guest?.phone ?? req.body.guestPhone;
    if (!guestName || !guestEmail) {
      return res.status(400).json({ message: 'Guest name and email are required' });
    }

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const room = await Room.findByPk(roomId);
    if (!room || (room as any).hotelId !== hotelId) {
      return res.status(400).json({ message: 'Room does not belong to the specified hotel' });
    }

    const bookingReference = await generateBookingReference();

    const reservation = await Reservation.create({
      id: uuidv4(),
      userId: null as any, // guest booking — no account
      hotelId,
      roomId,
      companyId: (hotel as any).companyId,
      guestName,
      guestEmail,
      guestPhone,
      bookingReference,
      dateIn,
      dateOut,
      guestCount: guestCount || 1,
      status: 'pending',
    });

    return res.status(201).json({
      message: 'Booking confirmed',
      bookingReference,
      reservation,
    });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create booking', error: err.message });
  }
};

/** Front-desk lookup by booking reference (for guest check-in). */
export const lookupByReference = async (req: Request, res: Response): Promise<any> => {
  try {
    const { reference } = req.params;
    const reservation = await Reservation.findOne({ where: { bookingReference: reference }, include: GUEST_INCLUDE });
    if (!reservation || !canAccessReservation(req, reservation)) {
      return res.status(404).json({ message: 'Booking not found. Please verify the reference.' });
    }
    return res.status(200).json({ message: 'Booking found', reservation });
  } catch (err: any) {
    return res.status(500).json({ message: 'Lookup failed', error: err.message });
  }
};

export const getOneReservation = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({ where: { id }, include: GUEST_INCLUDE });
    // 404 rather than 403 when the requester has no access, so reservation
    // existence isn't leaked across tenants.
    if (!reservation || !canAccessReservation(req, reservation)) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
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
    if (!reservation || !canAccessReservation(req, reservation)) {
      return res.status(404).json({ message: 'Booking not found. Please verify the booking number.' });
    }
    return res.status(200).json({ message: 'Booking found', reservation });
  } catch (err: any) {
    return res.status(500).json({ message: 'Lookup failed', error: err.message });
  }
};

export const checkIn = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation || !canAccessReservation(req, reservation)) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
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

    if (!reservation || !canAccessReservation(req, reservation)) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
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
    const reservation = await Reservation.findByPk(id);
    if (!reservation || !canAccessReservation(req, reservation)) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    // Never allow the tenant/owner/status fields to be reassigned via update;
    // status transitions go through the dedicated check-in/check-out endpoints.
    await reservation.update(stripProtectedFields(req.body));
    const updated = await Reservation.findByPk(id);
    return res.status(200).json({ message: 'Reservation updated', reservation: updated });
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
    const reservation = await Reservation.findByPk(id);
    if (!reservation || !canAccessReservation(req, reservation)) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    await reservation.destroy();
    return res.status(200).json({ message: `Reservation ${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete reservation', error: err.message });
  }
};
