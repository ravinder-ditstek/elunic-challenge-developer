import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export interface UserMessage {
  id: number;
  message: string;
  created_date: Date;
}

export interface CreateUserMessageDto {
  message: string;
}

export interface PaginationDto {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class UserMessagesService {
  private readonly logger = new Logger(UserMessagesService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async create(createUserMessageDto: CreateUserMessageDto): Promise<UserMessage> {
    const [result] = await this.databaseService.query(
      'INSERT INTO user_messages (message) VALUES (?)',
      [createUserMessageDto.message]
    );

    const [rows] = await this.databaseService.query(
      'SELECT * FROM user_messages WHERE id = ?',
      [result.insertId]
    );

    return rows[0] as UserMessage;
  }

  async findAll(): Promise<UserMessage[]> {
    const [rows] = await this.databaseService.query(
      'SELECT * FROM user_messages ORDER BY created_date DESC'
    );
    return rows as UserMessage[];
  }

  async findAllPaginated(paginationDto: PaginationDto): Promise<PaginatedResponse<UserMessage>> {
    const { page, limit } = paginationDto;
    const offset = (page - 1) * limit;

    try {
      // Get total count
      const [countResult] = await this.databaseService.query(
        'SELECT COUNT(*) as total FROM user_messages'
      );
      console.log('Count result:', countResult);
      const total = Number(countResult[0].total);

      // Get paginated data using string interpolation for LIMIT and OFFSET
      const [rows] = await this.databaseService.query(
        `SELECT * FROM user_messages ORDER BY created_date DESC LIMIT ${parseInt(limit.toString())} OFFSET ${parseInt(offset.toString())}`
      );

      const totalPages = Math.ceil(total / limit);

      return {
        data: rows as UserMessage[],
        pagination: {
          page,
          limit,
          total: total,
          totalPages: totalPages,
        },
      };
    } catch (error) {
      this.logger.error('Error in findAllPaginated:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<UserMessage | null> {
    const [rows] = await this.databaseService.query(
      'SELECT * FROM user_messages WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? (rows[0] as UserMessage) : null;
  }

  async update(id: number, updateUserMessageDto: CreateUserMessageDto): Promise<UserMessage | null> {
    await this.databaseService.query(
      'UPDATE user_messages SET message = ? WHERE id = ?',
      [updateUserMessageDto.message, id]
    );

    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const [result] = await this.databaseService.query(
      'DELETE FROM user_messages WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
} 