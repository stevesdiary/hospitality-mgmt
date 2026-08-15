/**
 * API Response Transformers
 * Transforms server response format to client-expected format
 * 
 * Server returns: { message, Count, Hotels/Rooms/Users/Reservations, page, limit }
 * Client expects: { items, total, page, limit, totalPages }
 */

import type { Hotel, Room, User, Reservation, PaginatedResponse } from '@/types';

interface ServerHotel {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  description?: string;
  hotelType?: string;
  numberOfRooms?: number;
  contactEmail: string;
  contactPhone: string;
  companyId?: string;
  rooms?: ServerRoom[];
  facilities?: any;
  ratingAndReview?: any[];
}

interface ServerRoom {
  id: string;
  hotelId: string;
  category: string;
  capacity: number;
  description?: string;
  availability: boolean;
  price: number;
  condition: string;
}

interface ServerReservation {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  dateIn: string;
  dateOut: string;
  status: string;
  paymentStatus: string;
  totalPrice?: number;
  User?: any;
  Hotel?: ServerHotel;
  Room?: ServerRoom;
}

interface ServerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  type?: string;
  companyId?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export function transformHotel(h: ServerHotel): Hotel {
  const rooms = h.rooms?.map(transformRoom) ?? [];
  const minPrice = rooms.length > 0 ? Math.min(...rooms.map(r => r.pricePerNight)) : 0;
  const maxPrice = rooms.length > 0 ? Math.max(...rooms.map(r => r.pricePerNight)) : 0;
  const avgRating = h.ratingAndReview?.length 
    ? h.ratingAndReview.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / h.ratingAndReview.length 
    : 0;

  return {
    id: h.id,
    name: h.name,
    description: h.description || '',
    address: h.address,
    city: h.city,
    state: h.state,
    country: 'Nigeria',
    zipCode: '',
    phone: String(h.contactPhone),
    email: h.contactEmail,
    starRating: h.hotelType === 'luxury' ? 5 : h.hotelType === 'mid-range' ? 4 : 3,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    amenities: extractAmenities(h.facilities),
    images: [],
    rooms,
    userId: h.companyId || '',
    status: 'active',
    priceRange: { min: minPrice, max: maxPrice },
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: h.ratingAndReview?.length ?? 0,
    createdAt: '',
    updatedAt: '',
  };
}

export function transformRoom(r: ServerRoom): Room {
  return {
    id: r.id,
    hotelId: r.hotelId,
    roomNumber: '',
    category: r.category as any,
    condition: r.condition as any,
    description: r.description || '',
    maxOccupancy: r.capacity,
    bedType: 'double',
    amenities: [],
    pricePerNight: r.price,
    images: [],
    available: r.availability,
    createdAt: '',
    updatedAt: '',
  };
}

export function transformReservation(r: ServerReservation): Reservation {
  return {
    id: r.id,
    userId: r.userId,
    roomId: r.roomId,
    hotelId: r.hotelId,
    checkInDate: r.dateIn?.split('T')[0] || '',
    checkOutDate: r.dateOut?.split('T')[0] || '',
    numberOfGuests: r.Room?.capacity || 1,
    totalPrice: r.totalPrice || 0,
    status: r.status === 'active' ? 'pending' : r.status as any,
    paymentStatus: r.paymentStatus as any || 'pending',
    guestName: r.User ? `${r.User.firstName} ${r.User.lastName}` : '',
    guestEmail: r.User?.email || '',
    guestPhone: r.User?.phoneNumber || '',
    createdAt: '',
    updatedAt: '',
    room: r.Room ? transformRoom(r.Room) : undefined,
    hotel: r.Hotel ? transformHotel(r.Hotel) : undefined,
  };
}

export function transformUser(u: ServerUser): User {
  return {
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    userType: (u.type || 'guest') as any,
    companyId: u.companyId,
    phone: String(u.phoneNumber),
    gender: u.gender as any,
    profileImage: u.profileImage,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

function extractAmenities(facilities: any): string[] {
  if (!facilities) return [];
  const amenities: string[] = [];
  if (facilities.restaurant) amenities.push('Restaurant');
  if (facilities.barLounge) amenities.push('Bar');
  if (facilities.gym) amenities.push('Gym');
  if (facilities.wifiInternet) amenities.push('Free WiFi');
  if (facilities.swimmingPool) amenities.push('Swimming Pool');
  if (facilities.roomService) amenities.push('Room Service');
  if (facilities.security) amenities.push('24h Security');
  if (facilities.frontDesk24h) amenities.push('Front Desk 24h');
  if (facilities.carHire) amenities.push('Car Hire');
  if (facilities.electricity24h) amenities.push('24h Power');
  if (facilities.dstv) amenities.push('DSTV');
  if (facilities.cctv) amenities.push('CCTV');
  return amenities;
}

export function transformPaginatedResponse<TServer, TClient>(
  response: { Count?: number; page?: number; limit?: number; [key: string]: any },
  dataKey: string,
  transformer: (item: TServer) => TClient
): PaginatedResponse<TClient> {
  const items = (response[dataKey] || []).map(transformer);
  const total = response.Count || items.length;
  const page = response.page || 1;
  const limit = response.limit || 10;
  const totalPages = Math.ceil(total / limit);
  return { items, total, page, limit, totalPages };
}
