import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegistrationDto } from "./dto/registration_dto";
import { LoginDto } from "./dto/login_dto";

@Controller('auth')
export class AuthController{

    constructor(
        private authService: AuthService
    ){}
    
    @Post('register')
    @UsePipes(ValidationPipe)
    register(@Body() registrationDto: RegistrationDto){
        console.log(registrationDto)
        return this.authService.register(registrationDto)
    }

    @Post('login')
    @UsePipes(ValidationPipe)
    login(@Body() loginDto: LoginDto){
        return this.authService.login(loginDto)
    }
}