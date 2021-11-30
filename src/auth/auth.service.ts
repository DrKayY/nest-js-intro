import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDto } from './dtos/user-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepo: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signup(userCreds: UserCredentialsDto): Promise<void> {
    return this.userRepo.signUp(userCreds);
  }

  async signin(
    userCreds: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepo.validateUserPassword(userCreds);

    if (!username) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
