import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({timestamps: true})


export class Permission extends Document {
    @Prop()
    name: string

    @Prop()
    description: string
}

export const permissionSchema = SchemaFactory.createForClass(Permission)