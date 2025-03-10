import { Module } from '@nestjs/common';
import { FoodEntryService } from './food-entry.service';
import { FoodEntryController } from './food-entry.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [FoodEntryService, PrismaService, UserService],
  controllers: [FoodEntryController],
})
export class FoodEntryModule {}
