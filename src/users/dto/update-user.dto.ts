import { PartialType } from '@nestjs/mapped-types';
import { CreateUserBasicDTO } from './create-user.dto';

export class UpdateUserDTO extends PartialType(CreateUserBasicDTO) {}
