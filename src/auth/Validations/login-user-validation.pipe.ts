import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { LoginUserDto } from '../login-user.dto';

@Injectable()
export class LoginUserValidationPipe implements PipeTransform {
  transform(value: LoginUserDto, metadata: ArgumentMetadata): LoginUserDto {
    if (!value.email && !value.phone) {
      throw new BadRequestException('Either email or phone must be provided.');
    }

    return value;
  }
}
