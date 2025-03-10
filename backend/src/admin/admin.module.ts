import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FoodEntryService } from 'src/food-entry/food-entry.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [AdminService, FoodEntryService, PrismaService, UserService],
  controllers: [AdminController],
})
export class AdminModule {}
