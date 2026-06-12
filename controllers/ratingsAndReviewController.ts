/**
 * Ratings and Review Controller
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RatingAndReview, Hotel, User } from '../models';

export const createRating = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { hotelId, reviewTitle, review, cleanliness, comfort, service, security, location, overallRating, like } = req.body;

    const hotel = await Hotel.findByPk(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const companyId = (hotel as any).companyId;

    const user = await User.findByPk(userId, { attributes: ['firstName', 'lastName'] });
    const firstName = (user as any)?.firstName || '';
    const lastName = (user as any)?.lastName || '';

    const id = uuidv4();
    const rating = await RatingAndReview.create({
      id,
      userId,
      hotelId,
      companyId,
      reviewTitle,
      review,
      cleanliness,
      comfort,
      service,
      security,
      location,
      overallRating,
      like,
      firstName,
      lastName,
      date: new Date(),
    });

    return res.status(201).json({ message: 'Rating created', rating });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create rating', error: err.message });
  }
};

export const getRating = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const rating = await RatingAndReview.findByPk(id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    return res.status(200).json({ message: 'Rating retrieved', rating });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve rating', error: err.message });
  }
};

export const updateRating = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const [updated] = await RatingAndReview.update(req.body, { where: { id } });
    if (updated === 0) return res.status(404).json({ message: 'Rating not found' });
    const rating = await RatingAndReview.findByPk(id);
    return res.status(200).json({ message: 'Rating updated', rating });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to update rating', error: err.message });
  }
};

export const deleteRating = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const deleted = await RatingAndReview.destroy({ where: { id } });
    if (deleted === 0) return res.status(404).json({ message: 'Rating not found' });
    return res.status(200).json({ message: `Rating ${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete rating', error: err.message });
  }
};
