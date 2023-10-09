import { Injectable , BadRequestException} from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';
import { User } from 'src/user/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from 'src/role/schemas/role.schema';
import { Model } from 'mongoose';
import { UserRole } from './schemas/user_role.schema';

@Injectable()
export class UserRoleService {
  constructor(
   @InjectModel(UserRole.name)
   private userRoleModel : Model<UserRole>
  ){}
  async assignRoleToUser(userId: string, roleId: string):Promise<{message: string}> {
   return {
    message: 'User Assigned Role Successfully'
   }
  }
  
  findAll() {
    return `This action returns all userRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userRole`;
  }

  update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    return `This action updates a #${id} userRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} userRole`;
  }
}
