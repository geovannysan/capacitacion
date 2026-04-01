import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseAuthDto } from './dtos/response-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from './interfaces/cookies-request.interface';
import { loginTokenDecorator, refresTokenDecorator } from './decorators';
import { LocalAuthGuard } from './guard';

@ApiTags('auth')
@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }


  @UseGuards(LocalAuthGuard)
  @loginTokenDecorator()
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }
  @refresTokenDecorator()
  @Post('refresh')
  refreshToken(@Request() token: string): Promise<ResponseAuthDto> {
    return this.authService.refreshToken(token);
  }
}
