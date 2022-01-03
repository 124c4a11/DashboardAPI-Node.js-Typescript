import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { LoggerService } from '../logger/logger.service';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(@inject(TYPES.LoggerService) private logger: LoggerService) {
    const result: DotenvConfigOutput = config();

    if (result.error) {
      this.logger.error('[ConfigService] Could not read the .env file or is missing');
    } else {
      this.config = result.parsed as DotenvParseOutput;

      this.logger.log('[ConfigService] .env config is loaded');
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
