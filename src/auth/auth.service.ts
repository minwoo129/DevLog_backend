import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginSuccessVO } from './vo/login-success.vo';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginSuccessVO> {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const pwdCheck = await bcrypt.compare(password, user.password);

    if (!pwdCheck) throw new UnauthorizedException();

    const { id, name, nickname, isAdmin } = user;
    let payload = {
      id,
      name,
      email,
      nickname,
      isAdmin,
    };
    const authToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    return {
      ...payload,
      authToken,
    };
  }
}
