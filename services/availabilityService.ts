/**
 * Room availability
 *
 * A room is unavailable for a date range if an existing *active* reservation
 * overlaps it. Dates are treated as half-open intervals [dateIn, dateOut):
 * a guest checking out on the 10th does not conflict with one checking in on
 * the 10th, which matches how hotels actually turn rooms over.
 */

import { Op, Transaction } from 'sequelize';
import { Reservation, Room } from '../models';

/**
 * Statuses that still hold the room. Cancelled, checked-out and no-show
 * bookings release it.
 */
export const BLOCKING_STATUSES = ['pending', 'confirmed', 'checked-in'];

export interface DateRange {
  dateIn: Date;
  dateOut: Date;
}

/**
 * Validate and normalise a requested stay.
 * Returns an error message instead of throwing so callers can map it to a 400.
 */
export const parseStay = (rawIn: any, rawOut: any): { range?: DateRange; error?: string } => {
  if (!rawIn || !rawOut) return { error: 'dateIn and dateOut are required' };

  const dateIn = new Date(rawIn);
  const dateOut = new Date(rawOut);

  if (Number.isNaN(dateIn.getTime()) || Number.isNaN(dateOut.getTime())) {
    return { error: 'dateIn and dateOut must be valid dates' };
  }
  if (dateOut <= dateIn) {
    return { error: 'dateOut must be after dateIn' };
  }
  return { range: { dateIn, dateOut } };
};

/**
 * Find an active reservation on this room that overlaps the requested stay.
 *
 * Overlap for half-open ranges: existing.dateIn < requested.dateOut
 *                            && existing.dateOut > requested.dateIn
 *
 * Pass a transaction (with lock) to make the check-then-create sequence safe
 * against concurrent bookings of the same room.
 */
export const findConflictingReservation = async (
  roomId: string,
  range: DateRange,
  options: { excludeReservationId?: string; transaction?: Transaction } = {}
): Promise<any | null> => {
  const where: any = {
    roomId,
    status: { [Op.in]: BLOCKING_STATUSES },
    dateIn: { [Op.lt]: range.dateOut },
    dateOut: { [Op.gt]: range.dateIn },
  };

  if (options.excludeReservationId) {
    where.id = { [Op.ne]: options.excludeReservationId };
  }

  return Reservation.findOne({ where, transaction: options.transaction });
};

/**
 * Whether a room can be booked for a range: it must be listed as bookable and
 * have no overlapping active reservation.
 */
export const isRoomAvailable = async (
  roomId: string,
  range: DateRange,
  options: { excludeReservationId?: string; transaction?: Transaction } = {}
): Promise<{ available: boolean; reason?: string }> => {
  const room = await Room.findByPk(roomId, { transaction: options.transaction });
  if (!room) return { available: false, reason: 'Room not found' };
  if ((room as any).availability === false) {
    return { available: false, reason: 'This room is not currently bookable' };
  }

  const clash = await findConflictingReservation(roomId, range, options);
  if (clash) {
    return { available: false, reason: 'This room is already booked for the selected dates' };
  }
  return { available: true };
};

/**
 * All rooms in a hotel that are free for the given range — used to show a
 * guest only what they can actually book on the hotel's own page.
 */
export const findAvailableRooms = async (hotelId: string, range: DateRange): Promise<any[]> => {
  const rooms = await Room.findAll({ where: { hotelId, availability: true } });
  if (rooms.length === 0) return [];

  const roomIds = rooms.map((r: any) => r.id);

  // One query for every overlapping reservation across the hotel's rooms,
  // rather than a query per room.
  const conflicts = await Reservation.findAll({
    where: {
      roomId: { [Op.in]: roomIds },
      status: { [Op.in]: BLOCKING_STATUSES },
      dateIn: { [Op.lt]: range.dateOut },
      dateOut: { [Op.gt]: range.dateIn },
    },
    attributes: ['roomId'],
  });

  const taken = new Set(conflicts.map((c: any) => c.roomId));
  return rooms.filter((r: any) => !taken.has(r.id));
};
