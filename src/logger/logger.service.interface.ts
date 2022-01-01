export interface ILogger {
  logger: unknown;
  log: (...args: unknown[]) => any;
  error: (...args: unknown[]) => any;
  warn: (...args: unknown[]) => any;
}
