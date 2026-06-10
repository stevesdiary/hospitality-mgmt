// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'guest' | 'regular' | 'premium' | 'admin' | 'org_admin';
  companyId?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
}

// Hotel Types
export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  starRating: number;
  checkInTime: string;
  checkOutTime: string;
  amenities: string[];
  images: MediaFile[];
  rooms: Room[];
  userId: string;
  status: 'active' | 'inactive' | 'maintenance';
  priceRange: {
    min: number;
    max: number;
  };
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HotelSearchFilters {
  city?: string;
  country?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
  starRating?: number[];
  amenities?: string[];
}

// Room Types
export interface Room {
  id: string;
  hotelId: string;
  roomNumber: string;
  category: 'standard' | 'deluxe' | 'suite' | 'penthouse';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  maxOccupancy: number;
  bedType: 'single' | 'double' | 'queen' | 'king' | 'twin';
  amenities: string[];
  pricePerNight: number;
  images: MediaFile[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomBookingRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  specialRequests?: string;
}

// Reservation Types
export interface Reservation {
  id: string;
  userId: string;
  roomId: string;
  hotelId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  specialRequests?: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  createdAt: string;
  updatedAt: string;
  room?: Room;
  hotel?: Hotel;
  user?: User;
}

export interface CreateReservationRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

// Rating & Review Types
export interface RatingAndReview {
  id: string;
  userId: string;
  hotelId?: string;
  roomId?: string;
  reservationId?: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  helpfulCount: number;
  images?: MediaFile[];
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface CreateReviewRequest {
  hotelId?: string;
  roomId?: string;
  reservationId?: string;
  rating: number;
  title: string;
  comment: string;
  images?: File[];
}

// Facility Types
export interface Facility {
  id: string;
  name: string;
  description: string;
  type: 'recreation' | 'dining' | 'business' | 'wellness' | 'sports' | 'entertainment';
  openingHours?: string;
  additionalInfo?: string;
  images?: MediaFile[];
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

// Media Types
export interface MediaFile {
  id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
  entityType: 'hotel' | 'room' | 'facility' | 'review' | 'user';
  entityId: string;
  uploadedBy: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  errors?: any[];
  statusCode: number;
}

// Common Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
