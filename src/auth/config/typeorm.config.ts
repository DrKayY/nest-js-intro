import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { Task } from 'src/tasks/task.entity';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeormConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.HOST_NAME || dbConfig.host,
  port: process.env.PORT || dbConfig.port,
  username: process.env.USERNAME || dbConfig.username,
  password: process.env.PASSWORD || dbConfig.password,
  database: process.env.DB_NAME || dbConfig.database,
  // entities: [__dirname + '../**/*.entity.ts'],
  entities: [Task, User],
  synchronize: process.env.DB_SYNC || dbConfig.synchronize,
};
