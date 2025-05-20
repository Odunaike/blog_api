import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RefreshGuard implements CanActivate{
    constructor(private jwtService: JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest()
        const authorization = request.headers.authorization

        const refreshToken = authorization.split(' ')[1]

        try {
            const tokenPayload =  await this.jwtService.verifyAsync(refreshToken, {secret: "JWT_REFRESH_SECRET"})
            request.user = {
                id: tokenPayload.id,
                refreshToken: refreshToken
            }
            return true
        } catch (error) {
            throw new UnauthorizedException
        }
    }
}