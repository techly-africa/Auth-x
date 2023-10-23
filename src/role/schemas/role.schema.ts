import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Role {
  @Prop()
  @IsNotEmpty()
  roleName: string;

  @Prop()
  description: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Permission' }],
  })
  permissions: Types.ObjectId[];

  @Prop({default: false})
  isDeleted: boolean
}

export const roleSchema = SchemaFactory.createForClass(Role);
