import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  role?: 0 | 1 | 2;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  gender?: string;
  verificationToken?: string;
  isVerified?: boolean;
  mfa_enabled?: boolean;
  mfa_code?: number;
  mfa_timeout?: Date;
}
