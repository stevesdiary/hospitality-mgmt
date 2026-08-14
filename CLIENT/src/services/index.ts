// Export all services from a single location
export { default as apiService } from './api';
export { default as authService, authService as authApi } from './auth.service';
export { default as hotelService, hotelService as hotelApi } from './hotel.service';
export { default as roomService, roomService as roomApi } from './room.service';
export { default as reservationService, reservationService as reservationApi } from './reservation.service';
export { default as userService, userService as userApi } from './user.service';
export { default as facilityService, facilityService as facilityApi } from './facility.service';
export { default as ratingAndReviewService, ratingAndReviewService as ratingAndReviewApi } from './ratingAndReview.service';
