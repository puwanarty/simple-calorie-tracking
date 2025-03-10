import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from 'src/role/role.decorator';
import { Role } from 'src/role/role.enum';
import { GetUsersParams } from './user.dto';
import { Prisma } from '@prisma/client';
import { DEFAULT_SKIP, DEFAULT_TAKE } from 'src/common/common.constant';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Get()
  async getUsers(@Query() query: GetUsersParams) {
    const { q } = query;

    const args: Prisma.UserFindManyArgs = {
      where: {
        username: {
          contains: q,
          mode: 'insensitive',
        },
      },
      take: DEFAULT_TAKE,
      skip: DEFAULT_SKIP,
    };

    return this.userService.getUsers(args);
  }

  @Get('seed')
  @HttpCode(HttpStatus.CREATED)
  async seed() {
    return this.userService.seedUsers();
  }
}
