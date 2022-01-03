import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { ExceptionFilter } from './errors/exception.filter';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { LoggerService } from './logger/logger.service';
import { ILogger } from './logger/logger.service.interface';
import { TYPES } from './types';
import { UserController } from './users/user.controller';
import { IUserController } from './users/users.controller.interface';
import { UserService } from './users/users.service';
import { IUserService } from './users/users.service.interface';

export interface IBootstrap {
  appContainer: Container;
  app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILogger>(TYPES.LoggerService).to(LoggerService).inSingletonScope();
  bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter);
  bind<IUserController>(TYPES.UserController).to(UserController);
  bind<IUserService>(TYPES.UserService).to(UserService);
  bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
  bind<App>(TYPES.Application).to(App);
});

function bootstrap(): IBootstrap {
  const appContainer = new Container();
  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);
  app.init();

  return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
