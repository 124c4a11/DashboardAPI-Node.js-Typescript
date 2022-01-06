import { inject, injectable } from 'inversify';

import { TYPES } from '../../types';
import { IConfigService } from '../../config/config.service.interface';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { User } from '../user.entity';
import { IUserService } from './users.service.interface';
import { IUsersRepository } from '../respository/users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.ConfigService) private configService: IConfigService,
    @inject(TYPES.UsersRepository) private userRepository: IUsersRepository,
  ) {}

  async createUser({ name, email, password }: UserRegisterDto): Promise<UserModel | null> {
    const newUser = new User(name, email);
    const salt = this.configService.get('SALT');
    const existedUser = await this.userRepository.find(email);

    if (existedUser) return null;

    await newUser.setPassword(password, Number(salt));

    return this.userRepository.create(newUser);
  }

  async validateUser({ email, password }: UserLoginDto): Promise<boolean> {
    const existedUser = await this.userRepository.find(email);

    if (!existedUser) return false;

    const newUser = new User(existedUser.email, existedUser.name, existedUser.password);

    return newUser.comparePassword(password);
  }

  async getUserInfo(email: string): Promise<UserModel | null> {
    return this.userRepository.find(email);
  }
}
