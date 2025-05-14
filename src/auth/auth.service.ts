import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose"
import { User } from "src/user/schema/user.schema";
import { RegistrationDto } from "./dto/registration_dto";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login_dto";

@Injectable()
export class AuthService{

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ){}

    async register(registrationDto: RegistrationDto){
        try {
            // get existing username if the username exists
            const user = await this.userModel.exists({
                    username: registrationDto.username
                }
            ).exec()
            //if it exists 
            if (user){
                throw new HttpException("username already exists", HttpStatus.CONFLICT)
            }
            const newUser = new this.userModel(registrationDto)
            const tokens = await this.generateToken({id: newUser._id})
            newUser.save()
            return tokens
        } catch (error) {
            if (error instanceof HttpException){
                throw new HttpException(error.message, error.getStatus())
            }
            throw error;
        }
    }

    async login(loginDto: LoginDto){
        try {
            // Get user with from the databas
            const user = await this.userModel.findOne({
                username: loginDto.username
            })
            .select("+password")
            .exec()

            if (!user){
                throw new HttpException("Invalid Login details", HttpStatus.BAD_REQUEST)
            }

            //compare the passowrd
            if(!(user.password == loginDto.password)){
                throw new HttpException("Invalid Login details", HttpStatus.BAD_REQUEST)
            }
            const tokens = await this.generateToken({id: user._id})
            const currentUser = user.toObject()
            //remove the sensitive information from the returned object
            delete currentUser.refreshToken
            delete currentUser.password
            return {...tokens, user: currentUser}
        } catch (error) {
            console.log(error)
            if(error instanceof HttpException){
                throw new HttpException(error.message, error.getStatus())
            }
            throw error
        }
        
    }

    async generateToken(tokenPayload: Object): Promise<Object | null>{
        const token = await this.jwtService.signAsync(tokenPayload, {
            expiresIn: '10m',
            secret: "JWT_SECRET"
        }) 
        const refreshToken = await this.jwtService.signAsync(tokenPayload,{
            expiresIn: '7d',
            secret: "JWT_REFRESH_SECRET"
        })
        return {
            token: token,
            refreshToken: refreshToken
        }
    }

}