import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private connection: mysql.Connection;

  async onModuleInit() {
    await this.connect();
    await this.runMigrations();
  }

  private async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'app',
        password: process.env.DB_PASSWORD || 'app',
        database: process.env.DB_NAME || 'app',
      });
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to database:', error);
      throw error;
    }
  }

  private async runMigrations() {
    try {
      // Create migrations table if it doesn't exist
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Run migrations
      await this.createUserMessagesTable();
      await this.seedUserMessages();
      
      this.logger.log('Migrations completed successfully');
    } catch (error) {
      this.logger.error('Migration failed:', error);
      throw error;
    }
  }

  private async createUserMessagesTable() {
    const migrationName = 'create_user_messages_table';
    
    // Check if migration already executed
    const [rows] = await this.connection.execute(
      'SELECT id FROM migrations WHERE name = ?',
      [migrationName]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      this.logger.log(`Migration ${migrationName} already executed`);
      return;
    }

    // Create user_messages table
    await this.connection.execute(`
      CREATE TABLE IF NOT EXISTS user_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message TEXT NOT NULL,
        created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Record migration as executed
    await this.connection.execute(
      'INSERT INTO migrations (name) VALUES (?)',
      [migrationName]
    );

    this.logger.log(`Migration ${migrationName} executed successfully`);
  }

  async getConnection(): Promise<mysql.Connection> {
    return this.connection;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    return this.connection.execute(sql, params);
  }

  private async seedUserMessages() {
    const seederName = 'seed_user_messages';
    
    // Check if seeder already executed
    const [rows] = await this.connection.execute(
      'SELECT id FROM migrations WHERE name = ?',
      [seederName]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      this.logger.log(`Seeder ${seederName} already executed`);
      return;
    }

    // Sample messages to seed
    const sampleMessages = [
      'Hello! Welcome to our platform.',
      'This is a test message for the user messages feature.',
      'We hope you enjoy using our application.',
      'Feel free to explore all the available features.',
      'If you have any questions, please contact support.',
      'Thank you for choosing our service.',
      'We value your feedback and suggestions.',
      'Stay tuned for new features and updates.',
      'Your data is secure and protected.',
      'Have a great day!'
    ];

    // Insert sample messages
    for (const message of sampleMessages) {
      await this.connection.execute(
        'INSERT INTO user_messages (message) VALUES (?)',
        [message]
      );
    }

    // Record seeder as executed
    await this.connection.execute(
      'INSERT INTO migrations (name) VALUES (?)',
      [seederName]
    );

    this.logger.log(`Seeder ${seederName} executed successfully - added ${sampleMessages.length} messages`);
  }
} 