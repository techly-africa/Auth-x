import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

@Schema({ timestamps: true })
export class UserRole {
    user: ObjectId
    role: ObjectId
}

const userRoleSchema = SchemaFactory.createForClass(UserRole)