import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { LoginUserDto } from '../login-user.dto';

@Injectable()
export class LoginUserValidationPipe implements PipeTransform {
  transform(value: LoginUserDto, metadata: ArgumentMetadata): LoginUserDto {
    if (!value.email && !value.phone) {
      throw new BadRequestException('Either email or phone must be provided.');
    }

    if (value.email && !value.email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,4}$/)) {
      throw new BadRequestException('Invalid email format.');
    }

    return value;
  }
}
