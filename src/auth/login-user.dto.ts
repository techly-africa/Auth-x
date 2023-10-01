import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ required: false })
  email?: string;
  @ApiProperty()
  phone?: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
