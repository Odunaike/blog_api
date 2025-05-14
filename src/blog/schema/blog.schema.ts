import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Blog{

    @Prop()
    title: string

    @Prop()
    content: string

    @Prop({unique: false})
    authorId: string

    @Prop()
    image?: string

    @Prop({default: false})
    status?: boolean

}

export const BlogSchema = SchemaFactory.createForClass(Blog)