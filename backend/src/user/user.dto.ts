import { IsOptional, IsString } from 'class-validator';
import { Role } from 'src/role/role.enum';

export class UserEntity {
  sub: string;
  username: string;
  roles: Role[];
}

export class GetUsersParams {
  @IsOptional()
  @IsString()
  q?: string;
}
