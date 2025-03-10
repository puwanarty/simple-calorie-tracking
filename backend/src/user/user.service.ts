import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { USERS_SEED } from './user.constant';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(args?: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async seedUsers(): Promise<User[]> {
    await this.prisma.foodEntry.deleteMany();

    await this.prisma.user.deleteMany();

    return Promise.all(USERS_SEED.map((user) => this.createUser(user)));
  }
}
