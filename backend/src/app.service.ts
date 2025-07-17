import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private connection: Connection) {}

  async checkDatabaseConnection(): Promise<string> {
    try {
      await this.connection.query('SELECT 1');
      return '✅ Conexión exitosa a MySQL';
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      return '❌ No se pudo conectar a MySQL';
    }
  }
}