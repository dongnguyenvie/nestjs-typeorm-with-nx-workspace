import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { envFilePath } from './system.config';
import 'reflect-metadata';
import { UserEntity } from '../entities';
try {
  [...envFilePath].reverse().forEach((envFileNm) => {
    const dotenv_path = path.resolve(process.cwd(), `${envFileNm}`);
    const result = dotenv.config({ path: dotenv_path });
  });
} catch (error) {}

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logger: 'advanced-console',
  logging: false,
  cache: true,
  dropSchema: false,
  // maxQueryExecutionTime: 1000,
  migrationsRun: false,
  ssl: false,

  // ssl: true,
  /* Note : it is unsafe to use synchronize: true for schema synchronization
    on production once you get data in your database. */
  // synchronize: true,
  autoLoadEntities: true,
  // entities: ['dist/**/*.entity.js'],
};

const myDataSource = new DataSource({
  ...typeOrmModuleOptions,
  type: 'postgres',
  migrationsTableName: 'app_migrations',
  migrations: ['dist/migrations/*.js'],
  logging: false,
  synchronize: false,
  // subscribers: ['src/subscriber/**/*{.ts,.js}'],
});
export default myDataSource;
