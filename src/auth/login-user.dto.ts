import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ required: false })
  email?: string;
  @ApiPropertyOptional()
  phone?: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  isDeleted: boolean;
}
