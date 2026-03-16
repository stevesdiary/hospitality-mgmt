# Modular Architecture Refactoring - Implementation Guide

## Overview

This document provides a comprehensive guide to the modular architecture refactoring of the hospitality management system. The refactoring implements domain-driven design principles with clear separation of concerns, dependency injection patterns, and reusable components.

## ✅ Completed Infrastructure

### 1. **Directory Structure** ✓

```
src/
├── modules/           # Domain-specific business logic
│   ├── hotels/       # Hotel management module
│   ├── rooms/        # Room management module
│   ├── reservations/ # Reservation management module
│   ├── users/        # User management module
│   ├── facilities/   # Facility management module
│   ├── ratings/      # Ratings and reviews module
│   └── auth/         # Authentication module
├── shared/           # Shared infrastructure
│   ├── middleware/   # Express middleware
│   ├── utils/        # Utility functions
│   ├── database/     # Database configuration & repositories
│   └── types/        # TypeScript type definitions
└── config/           # Application configuration
```

### 2. **Shared Infrastructure** ✓

#### Configuration (`src/config/`)
- **`environment.ts`**: Centralized environment variable management
  - Type-safe configuration object
  - Database, JWT, Cloudinary, and email settings
  - Default values and validation

#### Utilities (`src/shared/utils/`)
- **`responseHelper.ts`**: Standardized response formatting
  - `sendSuccess()`, `sendError()`, `sendValidationError()`
  - `sendNotFound()`, `sendUnauthorized()`, `sendForbidden()`
  - Generic response handling with consistent format

- **`validationSchemas.ts`**: Joi validation schemas
  - User validation (register, login, update)
  - Hotel validation (create, update)
  - Room validation (create)
  - Reservation validation (create)
  - Rating validation (create)
  - Facility validation (create)
  - Password reset validation
  - Query parameter validation

#### Middleware (`src/shared/middleware/`)
- **`authentication.ts`**: JWT authentication
  - `authenticate` middleware - requires valid JWT
  - `optionalAuth` middleware - attaches user if token valid
  - `AuthRequest` interface extending Express Request

- **`authorization.ts`**: Role-based access control
  - `authorize(...types)` - factory function for role authorization
  - `requireAdmin` - admin-only access
  - `requireAuth` - any authenticated user

- **`validation.ts`**: Request validation middleware
  - `validate(schema, property)` - generic validator
  - `validateBody()`, `validateQuery()`, `validateParams()`
  - `validateUuid()` - UUID parameter validation

- **`errorHandler.ts`**: Global error handling
  - `AppError` base class with status codes
  - Specific error types: `NotFoundError`, `BadRequestError`, etc.
  - Sequelize error handling
  - Consistent error response format

#### Database Layer (`src/shared/database/`)
- **`dbConfig.ts`**: Sequelize connection setup
  - Environment-based configuration
  - SSL support for production
  - Logging configuration

- **`repositories/base.repository.ts`**: Generic repository pattern
  - `findAll()`, `findAndCountAll()`, `findById()`, `findOne()`
  - `create()`, `update()`, `destroy()`
  - `count()`, `exists()`
  - Type-safe generic operations

## 🏗️ Module Architecture Pattern

Each module follows this consistent structure:

```
module-name/
├── module.controller.ts    # HTTP request handlers
├── module.service.ts       # Business logic
├── module.routes.ts        # Route definitions
├── module.validators.ts    # Route-specific validators (optional)
└── index.ts                # Module facade (exports public API)
```

### Module Responsibilities

1. **Controller**: Handle HTTP requests/responses, call services
2. **Service**: Business logic, data transformation, orchestration
3. **Routes**: Express router with route definitions
4. **Validators**: Route-specific validation schemas
5. **Index**: Clean public API for the module

## 📋 Implementation Template

### Creating a New Module

Here's a complete template for implementing each module:

#### 1. Controller (`hotels/hotel.controller.ts`)

```typescript
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../../shared/middleware/authentication';
import { hotelService } from './hotel.service';
import { sendSuccess, sendCreated, sendNoContent } from '../../../shared/utils/responseHelper';

export const hotelController = {
  async findAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const hotels = await hotelService.findAllHotels(req.query);
      sendSuccess(res, hotels);
    } catch (error) {
      next(error);
    }
  },

  async findOne(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const hotel = await hotelService.findHotelById(id);
      sendSuccess(res, hotel);
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const hotel = await hotelService.createHotel(req.body);
      sendCreated(res, hotel, 'Hotel created successfully');
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const hotel = await hotelService.updateHotel(id, req.body);
      sendSuccess(res, hotel, 'Hotel updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await hotelService.deleteHotel(id);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  },
};
```

#### 2. Service (`hotels/hotel.service.ts`)

```typescript
import { Hotel, Room, Facility, RatingAndReview } from '../../../shared/database/models';
import { BaseRepository } from '../../../shared/database/repositories/base.repository';
import { BadRequestError, NotFoundError } from '../../../shared/middleware/errorHandler';

class HotelService {
  private hotelRepository: BaseRepository<Hotel>;

  constructor() {
    this.hotelRepository = new BaseRepository(Hotel);
  }

  async findAllHotels(query: any) {
    // Build query based on filters
    const where = this.buildWhereClause(query);
    
    const hotels = await this.hotelRepository.findAll({
      where,
      include: [
        { model: Room, as: 'rooms' },
        { model: Facility, as: 'facilities' },
      ],
    });

    return hotels;
  }

  async findHotelById(id: string) {
    const hotel = await this.hotelRepository.findById(id, {
      include: [
        { model: Room, as: 'rooms' },
        { model: Facility, as: 'facilities' },
      ],
    });

    if (!hotel) {
      throw new NotFoundError('Hotel not found');
    }

    return hotel;
  }

  async createHotel(data: Partial<Hotel>) {
    try {
      return await this.hotelRepository.create(data);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  async updateHotel(id: string, data: Partial<Hotel>) {
    const [updated] = await this.hotelRepository.update(data, {
      where: { id },
    });

    if (!updated) {
      throw new NotFoundError('Hotel not found');
    }

    return this.findHotelById(id);
  }

  async deleteHotel(id: string) {
    const deleted = await this.hotelRepository.destroy({
      where: { id },
    });

    if (!deleted) {
      throw new NotFoundError('Hotel not found');
    }
  }

  private buildWhereClause(query: any) {
    const where: any = {};
    
    if (query.city) where.city = query.city;
    if (query.state) where.state = query.state;
    if (query.hotelType) where.hotelType = query.hotelType;
    
    return where;
  }
}

export const hotelService = new HotelService();
```

#### 3. Routes (`hotels/hotel.routes.ts`)

```typescript
import { Router } from 'express';
import { hotelController } from './hotel.controller';
import { authenticate } from '../../../shared/middleware/authentication';
import { authorize } from '../../../shared/middleware/authorization';
import { validateBody, validateUuid } from '../../../shared/middleware/validation';
import { hotelValidation } from '../../../shared/utils/validationSchemas';

const router = Router();

// Public routes
router.get('/', hotelController.findAll);
router.get('/:id', hotelController.findOne);

// Protected routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateBody(hotelValidation.create),
  hotelController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateUuid('id'),
  validateBody(hotelValidation.update),
  hotelController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validateUuid('id'),
  hotelController.delete
);

export const hotelRoutes = router;
```

#### 4. Module Index (`hotels/index.ts`)

```typescript
// Module facade - clean public API
export { hotelController } from './hotel.controller';
export { hotelService } from './hotel.service';
export { hotelRoutes } from './hotel.routes';
```

### 3. Main App Integration

Update `src/app.ts` to use the modular architecture:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/environment';
import { errorHandler } from './shared/middleware/errorHandler';
import { sequelize } from './shared/database/dbConfig';

// Import modules
import { hotelModule } from './modules/hotels';
import { roomModule } from './modules/rooms';
import { reservationModule } from './modules/reservations';
import { userModule } from './modules/users';
import { facilityModule } from './modules/facilities';
import { ratingModule } from './modules/ratings';
import { authModule } from './modules/auth';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Module routes
app.use('/api/hotels', hotelModule.routes);
app.use('/api/rooms', roomModule.routes);
app.use('/api/reservations', reservationModule.routes);
app.use('/api/users', userModule.routes);
app.use('/api/facilities', facilityModule.routes);
app.use('/api/ratings', ratingModule.routes);
app.use('/api/auth', authModule.routes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.port;
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

export default app;
```

## 🎯 Key Benefits

### 1. **Separation of Concerns**
- Each module is self-contained
- Clear boundaries between domains
- Easy to understand and maintain

### 2. **Reusability**
- Shared middleware across all modules
- Common utilities in one place
- DRY principle enforced

### 3. **Testability**
- Each module can be tested independently
- Mock dependencies easily
- Clear interfaces for testing

### 4. **Scalability**
- Add new features without affecting existing code
- Team members can work on different modules
- Easy to split into microservices if needed

### 5. **Type Safety**
- Full TypeScript support
- IntelliSense throughout the codebase
- Catch errors at compile time

## 📝 Remaining Work

To complete the refactoring:

1. **Implement All Modules** (Follow the templates above)
   - Hotels module
   - Rooms module
   - Reservations module
   - Users module
   - Facilities module
   - Ratings module
   - Auth module (login, register, password reset)

2. **Create Model Exports**
   - Move models to `src/shared/database/models/`
   - Create index file for easy imports

3. **Update Package.json**
   - Change start script to use `src/app.ts`
   - Add build script for TypeScript compilation

4. **Update tsconfig.json**
   - Set rootDir to `./src`
   - Configure path aliases if desired

5. **Migration Strategy**
   - Keep old code working while migrating
   - Test each module as it's converted
   - Switch to new architecture when ready

## 🔧 Development Workflow

```bash
# Install dependencies
npm install

# Run in development mode (with ts-node)
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Run tests (when implemented)
npm test
```

## 📚 Best Practices

1. **Always use the shared middleware** for authentication and validation
2. **Keep controllers thin** - business logic belongs in services
3. **Use repository pattern** for database operations
4. **Handle errors consistently** with AppError classes
5. **Validate all inputs** at the route level
6. **Document your modules** with README files
7. **Write tests** for services and controllers
8. **Use TypeScript strict mode** for better type safety

## 🚀 Next Steps

1. Review the completed infrastructure
2. Implement one module completely as an example
3. Use that module as a template for others
4. Gradually migrate existing functionality
5. Update documentation as you go
6. Test thoroughly before deploying

---

This modular architecture provides a solid foundation for building a maintainable, scalable, and type-safe application. Follow the patterns and templates provided to complete the implementation.
