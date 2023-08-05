import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginSuccessVO } from './vo/login-success.vo';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(email: string, password: string): Promise<LoginSuccessVO> {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const pwdCheck = await bcrypt.compare(password, user.password);

    if (!pwdCheck) throw new UnauthorizedException();

    const { id, name, nickname, isAdmin } = user;
    return {
      id,
      name,
      email,
      nickname,
      isAdmin,
      authToken: '',
    };
  }
}
