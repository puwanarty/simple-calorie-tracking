import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { FoodEntryService } from './food-entry/food-entry.service';
import { FoodEntryController } from './food-entry/food-entry.controller';
import { FoodEntryModule } from './food-entry/food-entry.module';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './role/role.guard';

@Module({
  imports: [FoodEntryModule, UserModule, AdminModule, AuthModule],
  controllers: [AppController, FoodEntryController, UserController, AdminController],
  providers: [
    AppService,
    PrismaService,
    FoodEntryService,
    UserService,
    AdminService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
