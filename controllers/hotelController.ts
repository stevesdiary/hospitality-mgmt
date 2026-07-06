/**
 * Hotel Controller
 */

import { Request, Response } from 'express';
import hotelService from '../services/hotelService';
import { HotelSearchQuery } from '../types';

const resolveCompanyScope = (req: Request): string | null => {
  const user = req.user;
  if (!user) return null;
  if (user.type === 'admin') return null; // admin sees all
  return user.companyId || null;
};

const assertOwnsResource = (req: Request, resourceCompanyId: string): boolean => {
  const user = req.user;
  if (!user) return false;
  if (user.type === 'admin') return true;
  return user.companyId === resourceCompanyId;
};

export const createHotel = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) return res.status(403).json({ message: 'Company association required to create a hotel' });

    const hotel = await hotelService.createHotel(req.body, companyId);
    return res.status(201).json({ message: 'Hotel created successfully', hotel });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create hotel', error: err.message });
  }
};

export const getAllHotels = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const result = await hotelService.findAllHotels(req.query as unknown as HotelSearchQuery, companyId);
    return res.status(200).json({ message: 'Hotels retrieved', Count: result.count, Hotels: result.hotels });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve hotels', error: err.message });
  }
};

export const getTopDeals = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const result = await hotelService.findTopDeals(req.query as unknown as HotelSearchQuery, companyId);
    return res.status(200).json({ message: 'Top deals retrieved', Count: result.count, Hotels: result.hotels });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve top deals', error: err.message });
  }
};

export const getTopHotels = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const result = await hotelService.getTopHotelsByState(req.query as unknown as HotelSearchQuery, companyId);
    return res.status(200).json({ message: 'Top hotels retrieved', Count: result.count, Hotels: result.hotels });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve top hotels', error: err.message });
  }
};

export const getHotelsByCity = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const result = await hotelService.getHotelsByCity(companyId);
    return res.status(200).json({ message: 'Hotels by city retrieved', Count: result.count, Hotels: result.hotels });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve hotels by city', error: err.message });
  }
};

export const getTopDestinations = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const result = await hotelService.getTopDestinations(req.query as unknown as HotelSearchQuery, companyId);
    return res.status(200).json({ message: 'Top destinations retrieved', Count: result.count, Hotels: result.hotels });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve top destinations', error: err.message });
  }
};

export const getOneHotel = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const hotel = await hotelService.findHotelById(id);
    return res.status(200).json({ message: 'Hotel retrieved', hotel });
  } catch (err: any) {
    if (err.message.includes('not found')) return res.status(404).json({ message: 'Hotel not found' });
    return res.status(500).json({ message: 'Failed to retrieve hotel', error: err.message });
  }
};

/**
 * Public per-hotel landing page data source. Resolves a single hotel by its
 * slug (e.g. /h/abc-hotels-and-suites) with its rooms, facilities and reviews
 * so a guest can view that hotel's offers and book directly. No cross-tenant data.
 */
export const getHotelBySlug = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug } = req.params;
    const hotel = await hotelService.findHotelBySlug(slug);
    return res.status(200).json({ message: 'Hotel retrieved', hotel });
  } catch (err: any) {
    if (err.message.includes('not found')) return res.status(404).json({ message: 'Hotel not found' });
    return res.status(500).json({ message: 'Failed to retrieve hotel', error: err.message });
  }
};

export const getHotelsByDate = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const result = await hotelService.findHotelsByDate(req.query as unknown as HotelSearchQuery, companyId);
    return res.status(200).json({ message: 'Hotels by date retrieved', Count: result.count, Hotels: result.hotels });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve hotels by date', error: err.message });
  }
};

export const updateHotel = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const existing = await hotelService.findHotelById(id);
    if (!(existing as any).companyId || !assertOwnsResource(req, (existing as any).companyId)) {
      return res.status(403).json({ message: 'Forbidden - you do not own this hotel' });
    }
    const hotel = await hotelService.updateHotel(id, req.body);
    return res.status(200).json({ message: 'Hotel updated', hotel });
  } catch (err: any) {
    if (err.message.includes('not found')) return res.status(404).json({ message: 'Hotel not found' });
    return res.status(500).json({ message: 'Failed to update hotel', error: err.message });
  }
};

export const deleteHotel = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const existing = await hotelService.findHotelById(id);
    if (!(existing as any).companyId || !assertOwnsResource(req, (existing as any).companyId)) {
      return res.status(403).json({ message: 'Forbidden - you do not own this hotel' });
    }
    const result = await hotelService.deleteHotel(id);
    return res.status(200).json(result);
  } catch (err: any) {
    if (err.message.includes('not found')) return res.status(404).json({ message: 'Hotel not found' });
    return res.status(500).json({ message: 'Failed to delete hotel', error: err.message });
  }
};
