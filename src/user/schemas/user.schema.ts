import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  @IsNotEmpty()
  name: string;

  @Prop({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Prop()
  @IsNotEmpty()
  password: string;

  @Prop({
    default: 2,
  })
  role: number;

  @Prop()
  phone: string;

  @Prop()
  gender: string;

  @Prop()
  isVerified: boolean;

  @Prop()
  verificationToken: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Role' }],
  })
  roles: Types.ObjectId[];
  @Prop({
    default: false,
  })
  isDeleted: boolean;
}

export const userSchema = SchemaFactory.createForClass(User);
