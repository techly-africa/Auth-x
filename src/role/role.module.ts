import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, roleSchema } from './schemas/role.schema';
import {
  Permission,
  permissionSchema,
} from 'src/permission/schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: roleSchema }]),
    MongooseModule.forFeature([
      { name: Permission.name, schema: permissionSchema },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
