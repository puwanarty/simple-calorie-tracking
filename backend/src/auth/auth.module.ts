import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from './auth.constant';

@Module({
  imports: [UserModule, JwtModule.register({ global: true, secret: JWT_SECRET_KEY, signOptions: { expiresIn: '1h' } })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
