import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class RegistrationDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsEmail()
    @IsOptional()
    email?: string

    @IsBoolean()
    @IsOptional()
    isAdmin?: string
}