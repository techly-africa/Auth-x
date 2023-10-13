import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
