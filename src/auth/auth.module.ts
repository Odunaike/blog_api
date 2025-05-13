import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import {AuthService} from "./auth.service"
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/schema/user.schema";
import { JwtModule } from "@nestjs/jwt";

@Module(
    {
        imports:[
            MongooseModule.forFeature(
                [
                    {name: User.name, schema: UserSchema}
                ]
            ),
            JwtModule.register(
                {
                    global: true,
                    secret: "JWT_SECRET"
                }
            )
        ],
        controllers:[AuthController],
        providers:[AuthService],
    }
)

export class AuthModule{}