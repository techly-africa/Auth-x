import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-facebook';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_SECRET_KEY,
        callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any, info?: any) => void,
      ) => {
        try {
          const { displayName, email } = profile;
          const user = await this.userModel.findOne({ email });
          if (user) {
            return done(null, user);
          }
          const newUser = await this.userModel.create({
            name: displayName,
            email,
            password: '',
            phone: '',
            isVerified: true,
            gender: '',
          });
          return done(null, newUser);
        } catch (error) {
          return done(error, false);
        }
      },
    );
  }
}
