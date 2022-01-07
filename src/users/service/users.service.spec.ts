import 'reflect-metadata';
import { Container } from 'inversify';

import { UserModel } from '@prisma/client';
import { App } from '../../app';
import { IConfigService } from '../../config/config.service.interface';
import { TYPES } from '../../types';
import { IUsersRepository } from '../respository/users.repository.interface';
import { User } from '../user.entity';
import { UserService } from './users.service';
import { IUserService } from './users.service.interface';

const ConfigServiceMoch: IConfigService = {
  get: jest.fn(),
};

const UsersRepositoryMoch: IUsersRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

beforeAll(() => {
  container.bind<IUserService>(TYPES.UserService).to(UserService);
  container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMoch);
  container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMoch);
  container.bind<App>(TYPES.Application).to(App);

  configService = container.get<IConfigService>(TYPES.ConfigService);
  usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
  usersService = container.get<IUserService>(TYPES.UserService);
});

let createdUser: UserModel | null;

describe('User Service', () => {
  it('createUser', async () => {
    configService.get = jest.fn().mockReturnValueOnce('1');
    usersRepository.create = jest.fn().mockImplementationOnce(
      (user: User): UserModel => ({
        name: user.name,
        email: user.email,
        password: user.password,
        id: 1,
      }),
    );

    createdUser = await usersService.createUser({
      email: 'user@email.mail',
      name: 'John',
      password: '1',
    });

    expect(createdUser?.id).toEqual(1);
    expect(createdUser?.password).not.toEqual('1');
  });

  it('validateUser - success', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

    const result = await usersService.validateUser({
      email: 'user@email.mail',
      password: '1',
    });

    expect(result).toBeTruthy();
  });

  it('validateUser - wrong password', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(createdUser);

    const result = await usersService.validateUser({
      email: 'user@email.mail',
      password: '2',
    });

    expect(result).toBeFalsy();
  });

  it('validateUser - wrong user', async () => {
    usersRepository.find = jest.fn().mockReturnValueOnce(null);

    const result = await usersService.validateUser({
      email: '1@l.mail',
      password: '2',
    });

    expect(result).toBeFalsy();
  });
});
