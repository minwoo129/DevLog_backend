import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(readonly usersService: UsersService) {}

  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Get('/detail/:id')
  getOne(@Param('id') id: number) {
    return this.usersService.getOne(id);
  }

  @Post('/join')
  createUser(@Body() userData: CreateUserDTO) {
    return this.usersService.createUser(userData);
  }

  @Delete('/withdraw:id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() userData: UpdateUserDTO) {
    return this.usersService.update(id, userData);
  }
}
