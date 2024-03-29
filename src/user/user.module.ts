import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schemas/user.schema';
import { AdminGuard } from 'src/auth/Guards/admin.guard';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { Role, roleSchema } from 'src/role/schemas/role.schema';
import { RoleCheckGuard } from 'src/auth/Guards/role.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: Role.name, schema: roleSchema }]),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, AdminGuard, RoleCheckGuard],
})
export class UserModule {}
