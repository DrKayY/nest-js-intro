import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).*$/,
    { message: 'Password is too weak' },
  )
  password: string;
}
