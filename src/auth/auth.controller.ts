import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegistrationDto } from "./dto/registration_dto";
import { LoginDto } from "./dto/login_dto";
import { RefreshGuard } from "src/guard/refresh.guard";

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

    @Get('refresh')
    @UseGuards(RefreshGuard)
    refreshToken(@Req() req){
        return this.authService.refreshToken(req.user.id, req.user.refreshToken)
    }

}