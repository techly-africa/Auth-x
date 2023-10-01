import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schemas/user.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions:{
            expiresIn: config.get<string | number>('JWT_EXPIRE')
          }
        }
      }
    }),
    MongooseModule.forFeature([{name: User.name, schema: userSchema}])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
})
export class UserModule {}
