import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    @Prop({unique: true, required: true})
    username: string

    @Prop({required: true, select: false})
    password?: string

    @Prop({required: false})
    email?: string

    @Prop({required: false, select: false})
    refreshToken?: string

    @Prop({default: 'user'})
    role: string
}

export const UserSchema = SchemaFactory.createForClass(User)