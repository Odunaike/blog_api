import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate{

    constructor(
        private jwtService: JwtService
    ){}

    async canActivate(context: ExecutionContext):  Promise<boolean>  {
        const req = context.switchToHttp().getRequest()
        const authorization = req.headers.authorization
        const token = authorization?.split(' ')[1]

        if (!token)
            throw new UnauthorizedException

        try {
            const tokenPayload = await this.jwtService.verify(token)
            req.user = {
                id: tokenPayload.id,
                role: tokenPayload.role
            }
            return true
        } catch (error) {
            throw new HttpException(String(error), 409)
        }

    }
}