import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";

@Schema({ timestamps: true })
export class Permission {
    @Prop()
    @IsNotEmpty()
    permissionName: string
}

export const permissionSchema = SchemaFactory.createForClass(Permission)
