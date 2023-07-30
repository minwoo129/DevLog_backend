import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUserBasicDTO {
  @IsString()
  readonly name: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly nickname: string;
}

export class CreateUserDTO extends CreateUserBasicDTO {
  @IsOptional()
  @IsBoolean()
  readonly isAdmin: boolean;

  @IsOptional()
  @IsString()
  readonly adminConfirmPwd: string;
}
