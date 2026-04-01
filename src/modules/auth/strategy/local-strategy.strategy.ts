
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ResponseUserDto } from 'src/modules/usuarios/dto/user/response-user.dto';

import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<ResponseUserDto> {
   const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return user;;
  }
}
