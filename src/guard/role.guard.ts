import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/decorator/role.decorator";
import { Role } from 'src/enum/roles'

@Injectable()
export class RoleGuard implements CanActivate{
    //I wiill use the reflector from @nestjs/core to extract the metadata set on the handler 
    // which was done by the Roles decorator that had been created using the SetMetaData
    constructor(private reflector: Reflector){}

    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const requiredRoles = this.reflector.get<Role[]>(ROLES_KEY,
            context.getHandler() //this only checks if the current handler method for the roles metadata
        )
        
        try {
            if(!requiredRoles) //if there is role decorator for the handler, then it is not role protected
                return true  
        
            const {user} = context.switchToHttp().getRequest() //get the user value from the request
            const haveAcess = requiredRoles.some(
                (role) => user.role == role
            )
            if (haveAcess) {
                return true
            }else{
                throw new HttpException("You do not have access", HttpStatus.FORBIDDEN)
            }
        } catch (error) {
            throw new HttpException("You do not have access", HttpStatus.FORBIDDEN)
        }

    }
}