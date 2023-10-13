import { ApiProperty } from '@nestjs/swagger';

export class CreatePermDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
