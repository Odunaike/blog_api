import { createParamDecorator, SetMetadata } from "@nestjs/common";
import { Role } from "src/enum/roles";

//I am creatinga decorator for the handler to set the metadata for the request with a list of roles that handler wants to permit
export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)