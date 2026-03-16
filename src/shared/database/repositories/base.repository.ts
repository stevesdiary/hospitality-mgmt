/**
 * Base Repository
 * Generic repository pattern for database operations
 */

import { Model, ModelCtor, FindOptions, CreateOptions, UpdateOptions, DestroyOptions } from 'sequelize';

export class BaseRepository<T extends Model> {
  protected model: ModelCtor<T>;

  constructor(model: ModelCtor<T>) {
    this.model = model;
  }

  /**
   * Find all records
   */
  async findAll(options?: FindOptions<T>): Promise<T[]> {
    return this.model.findAll(options) as Promise<T[]>;
  }

  /**
   * Find and count all records (for pagination)
   */
  async findAndCountAll(options?: FindOptions<T>): Promise<{ count: number; rows: T[] }> {
    return this.model.findAndCountAll(options) as Promise<{ count: number; rows: T[] }>;
  }

  /**
   * Find by ID
   */
  async findById(id: string | number, options?: FindOptions<T>): Promise<T | null> {
    return this.model.findByPk(id, options) as Promise<T | null>;
  }

  /**
   * Find one record
   */
  async findOne(options?: FindOptions<T>): Promise<T | null> {
    return this.model.findOne(options) as Promise<T | null>;
  }

  /**
   * Create a new record
   */
  async create(data: Partial<T>, options?: CreateOptions<T>): Promise<T> {
    return this.model.create(data as any, options) as Promise<T>;
  }

  /**
   * Update records
   */
  async update(data: Partial<T>, options: Omit<UpdateOptions<T>, 'where'> & { where: any }): Promise<[number]> {
    const [affectedCount] = await this.model.update(data as any, options);
    return [affectedCount];
  }

  /**
   * Delete records
   */
  async destroy(options: DestroyOptions<T>): Promise<number> {
    return this.model.destroy(options);
  }

  /**
   * Count records
   */
  async count(options?: Omit<FindOptions<T>, 'attributes'>): Promise<number> {
    return this.model.count(options as any) as unknown as Promise<number>;
  }

  /**
   * Check if record exists
   */
  async exists(options: FindOptions<T>): Promise<boolean> {
    const count = await this.count(options);
    return count > 0;
  }
}
