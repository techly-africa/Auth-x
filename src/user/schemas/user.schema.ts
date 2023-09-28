import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty } from "class-validator";
import { ObjectId } from "mongoose";


@Schema({ timestamps: true })
export class User {
    _id: ObjectId
    
    @Prop()
    @IsNotEmpty()
    name: string

    @Prop({
        unique: true
    })
    @IsEmail()
    email: string

    @Prop()
    @IsNotEmpty()
    password: string

    @Prop({
        default: 2
    })
    role: number

    @Prop()
    phone: string
}

export const userSchema = SchemaFactory.createForClass(User)