import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);

    if (!user || !compareSync(password, user.password)) throw new UnauthorizedException();

    const { password: _, ...result } = user;

    const dto = { sub: user.id, username: user.username, roles: user.roles };

    return { access_token: await this.jwtService.signAsync(dto) };
  }
}
