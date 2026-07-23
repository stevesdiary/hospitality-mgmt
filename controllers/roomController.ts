/**
 * Room Controller
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Room, Hotel } from '../models';

const resolveCompanyScope = (req: Request): string | null => {
  const user = req.user;
  if (!user) return null;
  if (user.type === 'admin') return null;
  return user.companyId || null;
};

/** Platform admin may act on any tenant; anyone else only on their own company. */
const assertOwns = (req: Request, resourceCompanyId?: string): boolean => {
  const user = req.user;
  if (!user) return false;
  if (user.type === 'admin') return true;
  return !!resourceCompanyId && user.companyId === resourceCompanyId;
};

// Derived from the hotel or immutable — never accepted from the request body.
const ROOM_PROTECTED_FIELDS = ['id', 'companyId', 'hotelId'];
const stripProtectedRoomFields = (body: Record<string, any>): Record<string, any> => {
  const clean = { ...body };
  for (const field of ROOM_PROTECTED_FIELDS) delete clean[field];
  return clean;
};

export const createRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const { contactEmail, ...roomData } = req.body;

    const hotel = await Hotel.findOne({ where: { contactEmail } });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found for provided contact email' });

    const companyId = (hotel as any).companyId;
    // The requester must own the hotel they're adding a room to.
    if (!assertOwns(req, companyId)) {
      return res.status(403).json({ message: 'You do not have permission to add rooms to this hotel' });
    }
    const id = uuidv4();

    const room = await Room.create({ id, hotelId: hotel.id, companyId, ...stripProtectedRoomFields(roomData) });
    return res.status(201).json({ message: 'Room created successfully', room });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create room', error: err.message });
  }
};

export const getRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    return res.status(200).json({ message: 'Room retrieved', room });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve room', error: err.message });
  }
};

export const getAllRooms = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const where: any = {};
    if (companyId) where.companyId = companyId;

    const { count, rows: rooms } = await Room.findAndCountAll({ where });
    return res.status(200).json({ message: 'Rooms retrieved', Count: count, Rooms: rooms });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve rooms', error: err.message });
  }
};

export const updateRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);
    if (!room || !assertOwns(req, (room as any).companyId)) {
      return res.status(404).json({ message: 'Room not found' });
    }
    await room.update(stripProtectedRoomFields(req.body));
    const updated = await Room.findByPk(id);
    return res.status(200).json({ message: 'Room updated', room: updated });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to update room', error: err.message });
  }
};

export const deleteRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const room = await Room.findByPk(id);
    if (!room || !assertOwns(req, (room as any).companyId)) {
      return res.status(404).json({ message: 'Room not found' });
    }
    await room.destroy();
    return res.status(200).json({ message: `Room ${id} deleted successfully` });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete room', error: err.message });
  }
};
