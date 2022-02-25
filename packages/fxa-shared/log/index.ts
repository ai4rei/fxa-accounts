export interface ILogger {
  info(...args: any): void;
  trace(...args: any): void;
  warn(...args: any): void;
  error(...args: any): void;
  debug(...args: any): void;
}
