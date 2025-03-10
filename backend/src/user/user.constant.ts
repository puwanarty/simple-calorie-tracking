import { Prisma } from '@prisma/client';
import { Role } from 'src/role/role.enum';
import { hashSync } from 'bcrypt';

const saltRounds = 10;

export const USERS_SEED: Prisma.UserCreateInput[] = [
  {
    username: 'admin',
    password: hashSync('admin', saltRounds),
    roles: [Role.Admin],
  },
  {
    username: 'johndoe',
    password: hashSync('johndoe', saltRounds),
    roles: [Role.User],
  },
  {
    username: 'samsmith',
    password: hashSync('samsmith', saltRounds),
    roles: [Role.User],
  },
  {
    username: 'janedoe',
    password: hashSync('janedoe', saltRounds),
    roles: [Role.User],
  },
  {
    username: 'mikesmith',
    password: hashSync('mikesmith', saltRounds),
    roles: [Role.User],
  },
  {
    username: 'janesmith',
    password: hashSync('janesmith', saltRounds),
    roles: [Role.User],
  },
  {
    username: 'johnsmith',
    password: hashSync('johnsmith', saltRounds),
    roles: [Role.User],
  },
];
