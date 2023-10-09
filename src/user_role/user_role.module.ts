import { Module } from '@nestjs/common';
import { UserRoleService } from './user_role.service';
import { UserRoleController } from './user_role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRole, userRoleSchema } from './schemas/user_role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: UserRole.name, schema: userRoleSchema}])
  ],
  controllers: [UserRoleController],
  providers: [UserRoleService],
})
export class UserRoleModule {}
