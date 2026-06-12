/**
 * Facility Service
 */

import { v4 as uuidv4 } from 'uuid';
import { Facility } from '../models';
import { FacilityInstance } from '../models/facilities';

class FacilityService {
  async createFacility(data: Partial<FacilityInstance>, companyId: string): Promise<FacilityInstance> {
    const id = uuidv4();
    return Facility.create({ id, companyId, ...data });
  }

  async getAllFacilities(companyId?: string): Promise<{ count: number; facilities: FacilityInstance[] }> {
    const where: any = {};
    if (companyId) where.companyId = companyId;
    const { count, rows: facilities } = await Facility.findAndCountAll({ where });
    return { count, facilities };
  }

  async getFacilitiesByHotel(hotelId: string): Promise<FacilityInstance | null> {
    return Facility.findOne({ where: { hotelId } });
  }

  async updateFacility(id: string, data: Partial<FacilityInstance>): Promise<FacilityInstance> {
    const [updated] = await Facility.update(data, { where: { id } });
    if (updated === 0) throw new Error('Facility not found');
    const facility = await Facility.findByPk(id);
    if (!facility) throw new Error('Facility not found');
    return facility;
  }

  async deleteFacility(id: string): Promise<void> {
    const deleted = await Facility.destroy({ where: { id } });
    if (deleted === 0) throw new Error('Facility not found');
  }
}

export default new FacilityService();
