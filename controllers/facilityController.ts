/**
 * Facility Controller
 */

import { Request, Response } from 'express';
import facilityService from '../services/facilityService';
import { Facility } from '../models';

const resolveCompanyScope = (req: Request): string | undefined => {
  const user = req.user;
  if (!user) return undefined;
  if (user.type === 'admin') return undefined;
  return user.companyId;
};

/** Platform admin may act on any tenant; anyone else only on their own company. */
const assertOwns = (req: Request, resourceCompanyId?: string): boolean => {
  const user = req.user;
  if (!user) return false;
  if (user.type === 'admin') return true;
  return !!resourceCompanyId && user.companyId === resourceCompanyId;
};

export const createFacility = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) return res.status(403).json({ message: 'Company association required' });
    const facility = await facilityService.createFacility(req.body, companyId);
    return res.status(201).json({ message: 'Facility created', facility });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create facility', error: err.message });
  }
};

export const getFacilityByHotel = async (req: Request, res: Response): Promise<any> => {
  try {
    const { hotel_id } = req.params;
    const facility = await facilityService.getFacilitiesByHotel(hotel_id);
    if (!facility) return res.status(404).json({ message: 'Facility not found' });
    return res.status(200).json({ message: 'Facility retrieved', facility });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve facility', error: err.message });
  }
};

export const getAllFacilities = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const result = await facilityService.getAllFacilities(companyId);
    return res.status(200).json({ message: 'Facilities retrieved', Count: result.count, Facilities: result.facilities });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve facilities', error: err.message });
  }
};

export const updateFacility = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const existing = await Facility.findByPk(id);
    if (!existing || !assertOwns(req, (existing as any).companyId)) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    // companyId is immutable — never let an update move a facility between tenants.
    const updateData = { ...req.body };
    delete updateData.companyId;
    delete updateData.id;
    const facility = await facilityService.updateFacility(id, updateData);
    return res.status(200).json({ message: 'Facility updated', facility });
  } catch (err: any) {
    if (err.message === 'Facility not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to update facility', error: err.message });
  }
};

export const deleteFacility = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const existing = await Facility.findByPk(id);
    if (!existing || !assertOwns(req, (existing as any).companyId)) {
      return res.status(404).json({ message: 'Facility not found' });
    }
    await facilityService.deleteFacility(id);
    return res.status(200).json({ message: `Facility ${id} deleted successfully` });
  } catch (err: any) {
    if (err.message === 'Facility not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to delete facility', error: err.message });
  }
};
