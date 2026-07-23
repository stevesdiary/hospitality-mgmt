/**
 * Ratings and Review Controller
 */

import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { RatingAndReview, Hotel, User } from '../models';

/** Author of the review, a hotel admin for its company, or a platform admin. */
const canModerateRating = (req: Request, rating: any): boolean => {
  const user = req.user;
  if (!user) return false;
  if (user.type === 'admin') return true;
  if (user.type === 'org_admin' && user.companyId && rating.companyId === user.companyId) return true;
  return rating.userId === user.id;
};

export const createRating = async (req: Request, res: Response): Promise<any> => {
  try {
    // Authorship comes from the authenticated user, NOT the URL param, so a
    // review can't be posted in someone else's name.
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
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
    const rating = await RatingAndReview.findByPk(id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    // Only the author (or a platform admin) may edit review content — a hotel
    // must not be able to rewrite a guest's words.
    const user = req.user;
    const isAuthor = !!user && (rating as any).userId === user.id;
    if (!isAuthor && user?.type !== 'admin') {
      return res.status(403).json({ message: 'You can only edit your own review' });
    }
    // Never let the tenant/author/hotel binding change via update.
    const updateData = { ...req.body };
    for (const f of ['id', 'userId', 'companyId', 'hotelId']) delete updateData[f];
    await rating.update(updateData);
    const updated = await RatingAndReview.findByPk(id);
    return res.status(200).json({ message: 'Rating updated', rating: updated });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to update rating', error: err.message });
  }
};

export const deleteRating = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const rating = await RatingAndReview.findByPk(id);
    if (!rating) return res.status(404).json({ message: 'Rating not found' });
    // Author, the hotel's admin (moderation), or a platform admin may delete.
    if (!canModerateRating(req, rating)) {
      return res.status(403).json({ message: 'You do not have permission to delete this review' });
    }
    await rating.destroy();
    return res.status(200).json({ message: `Rating ${id} deleted` });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to delete rating', error: err.message });
  }
};
