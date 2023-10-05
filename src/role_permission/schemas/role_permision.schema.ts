import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { ObjectId } from "mongoose";

@Schema({ timestamps: true })
export class RolePermission {
    role: ObjectId
    permission: ObjectId
}

export const rolePermissionSchema = SchemaFactory.createForClass(RolePermission)