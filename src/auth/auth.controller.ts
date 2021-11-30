import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dtos/user-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authServ: AuthService) {}

  @Post('signup')
  signUp(@Body(ValidationPipe) userCreds: UserCredentialsDto): Promise<void> {
    return this.authServ.signup(userCreds);
  }

  @Post('signin')
  signIn(
    @Body(ValidationPipe) userCreds: UserCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authServ.signin(userCreds);
  }
}
