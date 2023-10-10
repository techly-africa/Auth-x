import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';

@Schema({ timestamps: true })
export class Role {
  @Prop()
  @IsNotEmpty()
  roleName: string;

  @Prop()
  description: string;
}

export const roleSchema = SchemaFactory.createForClass(Role);
