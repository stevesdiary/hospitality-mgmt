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

export const createRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const { contactEmail, ...roomData } = req.body;

    const hotel = await Hotel.findOne({ where: { contactEmail } });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found for provided contact email' });

    const companyId = (hotel as any).companyId;
    const id = uuidv4();

    const room = await Room.create({ id, hotelId: hotel.id, companyId, ...roomData });
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
    const [updated] = await Room.update(req.body, { where: { id } });
    if (updated === 0) return res.status(404).json({ message: 'Room not found' });
    const room = await Room.findByPk(id);
    return res.status(200).json({ message: 'Room updated', room });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to update room', error: err.message });
  }
};

export const deleteRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deleted = await Room.destroy({ where: { id } });
    if (deleted === 0) return res.status(404).json({ message: 'Room not found' });
    return res.status(200).json({ message: `Room ${id} deleted successfully` });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete room', error: err.message });
  }
};
