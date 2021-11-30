import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { EntityRepository, Repository } from 'typeorm';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(userCredentials: UserCredentialsDto): Promise<void> {
    const { username, password } = userCredentials;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.genHash(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username already exists');
      else
        throw new InternalServerErrorException(
          'Error occurred while creating user',
        );
    }
  }

  private async genHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async validateUserPassword(userCreds: UserCredentialsDto) {
    const { username, password } = userCreds;

    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else return null;
  }
}
