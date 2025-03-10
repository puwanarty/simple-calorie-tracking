import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { SignInDto } from './auth.dto';
import { User } from 'src/user/user.decorator';
import { UserEntity } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() body: SignInDto) {
    return this.authService.signIn(body.username, body.password);
  }

  @Get('me')
  async me(@User() user: UserEntity) {
    return user;
  }
}
