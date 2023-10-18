import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ObjectId, Types } from 'mongoose';
import { Role } from 'src/role/schemas/role.schema';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleCheckGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectModel(Role.name)
    private roleModel: Model<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = payload.id;
      const user = await this.userService.findOne(userId);
      if (user) {
        const userRoleIds: Types.ObjectId[] = user.roles;
        const userRoles: Role[] = await this.roleModel.find({
          _id: { $in: userRoleIds },
        });
        const requiredRole = 'Super Admin';
        if (userRoles.some((role) => role.roleName === requiredRole)) {
          return true;
        }
        throw new UnauthorizedException('Insufficient permissions');
      }
      throw new UnauthorizedException('User not found');
    } catch (error) {
      throw new UnauthorizedException('Not Authorized');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
