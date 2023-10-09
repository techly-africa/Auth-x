import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

@Schema({ timestamps: true })
export class UserRole {
    user: ObjectId
    role: ObjectId
}

 export const userRoleSchema = SchemaFactory.createForClass(UserRole)