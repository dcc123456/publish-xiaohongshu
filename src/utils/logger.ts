/**
 * @fileoverview 日志工具类
 * @description 提供统一的日志输出功能，支持不同级别、时间戳和颜色输出
 */

/**
 * 日志级别枚举
 * @description 定义日志的不同级别
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * 日志颜色配置接口
 * @description 定义不同级别日志的颜色
 */
interface LogColors {
  debug: string;
  info: string;
  warn: string;
  error: string;
  reset: string;
}

/**
 * 日志配置接口
 * @description 日志工具的配置选项
 */
interface LoggerConfig {
  level: LogLevel;
  enableTimestamp: boolean;
  enableColors: boolean;
  timestampFormat: string;
}

/**
 * ANSI 颜色代码
 * @description 终端颜色输出的 ANSI 转义码
 */
const COLORS: LogColors = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
};

/**
 * 日志工具类
 * @class Logger
 * @description 提供格式化的日志输出功能，支持多级别、时间戳和颜色
 *
 * @example
 * ```typescript
 * const logger = new Logger('MyModule');
 * logger.info('操作成功');
 * logger.error('发生错误', new Error('错误详情'));
 * ```
 */
export class Logger {
  private module: string;
  private config: LoggerConfig;

  /**
   * 创建 Logger 实例
   * @constructor
   * @param module - 模块名称，用于标识日志来源
   * @param config - 日志配置选项
   */
  constructor(module: string, config?: Partial<LoggerConfig>) {
    this.module = module;
    this.config = {
      level: config?.level ?? LogLevel.INFO,
      enableTimestamp: config?.enableTimestamp ?? true,
      enableColors: config?.enableColors ?? true,
      timestampFormat: config?.timestampFormat ?? 'YYYY-MM-DD HH:mm:ss',
    };
  }

  /**
   * 格式化时间戳
   * @private
   * @returns 格式化后的时间戳字符串
   */
  private formatTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * 获取日志级别对应的标签
   * @private
   * @param level - 日志级别
   * @returns 日志级别标签
   */
  private getLevelLabel(level: LogLevel): string {
    const labels = {
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.WARN]: 'WARN',
      [LogLevel.ERROR]: 'ERROR',
    };
    return labels[level];
  }

  /**
   * 获取日志级别对应的颜色代码
   * @private
   * @param level - 日志级别
   * @returns ANSI 颜色代码
   */
  private getColorCode(level: LogLevel): string {
    const colorMap = {
      [LogLevel.DEBUG]: COLORS.debug,
      [LogLevel.INFO]: COLORS.info,
      [LogLevel.WARN]: COLORS.warn,
      [LogLevel.ERROR]: COLORS.error,
    };
    return colorMap[level];
  }

  /**
   * 格式化日志消息
   * @private
   * @param level - 日志级别
   * @param message - 日志消息
   * @param args - 额外参数
   * @returns 格式化后的日志消息数组
   */
  private formatMessage(level: LogLevel, message: string, ...args: unknown[]): unknown[] {
    const parts: unknown[] = [];

    if (this.config.enableTimestamp) {
      parts.push(`[${this.formatTimestamp()}]`);
    }

    const levelLabel = this.getLevelLabel(level);

    if (this.config.enableColors) {
      const colorCode = this.getColorCode(level);
      parts.push(`${colorCode}[${levelLabel}]${COLORS.reset}`);
    } else {
      parts.push(`[${levelLabel}]`);
    }

    parts.push(`[${this.module}]`);
    parts.push(message);

    if (args.length > 0) {
      parts.push(...args);
    }

    return parts;
  }

  /**
   * 输出日志
   * @private
   * @param level - 日志级别
   * @param message - 日志消息
   * @param args - 额外参数
   */
  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (level < this.config.level) {
      return;
    }

    const formattedMessage = this.formatMessage(level, message, ...args);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(...formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(...formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(...formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(...formattedMessage);
        break;
    }
  }

  /**
   * 输出调试级别日志
   * @param message - 日志消息
   * @param args - 额外参数
   *
   * @example
   * ```typescript
   * logger.debug('调试信息', { userId: 123 });
   * ```
   */
  debug(message: string, ...args: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  /**
   * 输出信息级别日志
   * @param message - 日志消息
   * @param args - 额外参数
   *
   * @example
   * ```typescript
   * logger.info('操作成功');
   * ```
   */
  info(message: string, ...args: unknown[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  /**
   * 输出警告级别日志
   * @param message - 日志消息
   * @param args - 额外参数
   *
   * @example
   * ```typescript
   * logger.warn('配置项缺失，使用默认值');
   * ```
   */
  warn(message: string, ...args: unknown[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  /**
   * 输出错误级别日志
   * @param message - 日志消息
   * @param error - 错误对象或额外参数
   * @param args - 额外参数
   *
   * @example
   * ```typescript
   * logger.error('操作失败', new Error('网络错误'));
   * ```
   */
  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    const errorArgs = error ? [error, ...args] : args;
    this.log(LogLevel.ERROR, message, ...errorArgs);
  }

  /**
   * 设置日志级别
   * @param level - 新的日志级别
   *
   * @example
   * ```typescript
   * logger.setLevel(LogLevel.DEBUG);
   * ```
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * 启用或禁用颜色输出
   * @param enable - 是否启用颜色
   */
  setColors(enable: boolean): void {
    this.config.enableColors = enable;
  }

  /**
   * 启用或禁用时间戳
   * @param enable - 是否启用时间戳
   */
  setTimestamp(enable: boolean): void {
    this.config.enableTimestamp = enable;
  }
}

/**
 * 创建 Logger 实例的工厂函数
 * @param module - 模块名称
 * @param config - 日志配置选项
 * @returns Logger 实例
 *
 * @example
 * ```typescript
 * const logger = createLogger('ImageGenerator');
 * logger.info('开始生成图片');
 * ```
 */
export function createLogger(module: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger(module, config);
}

export const logger = new Logger('App');

export default Logger;
