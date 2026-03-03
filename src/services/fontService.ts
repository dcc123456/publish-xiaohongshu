/**
 * @fileoverview 字体管理业务逻辑服务
 * @description 提供字体列表获取、字体选择、字体缓存管理等业务逻辑
 */

import { createLogger } from '../utils/logger';
import {
  getAvailableFonts,
  getRandomFont,
  loadFont,
  selectFont,
  loadFontWithRetry,
  loadFonts,
  isFontAvailable,
  clearFontCache,
  getFontCacheSize,
  getDefaultFont,
} from '../utils/fontLoader';
import { fontConfig } from '../config/font.config';
import { FontInfo, FontData, FontSelectionStrategy, FontLoadResult } from '../types/font.types';
import { GetFontsResponse, ErrorResponse } from '../types/response.types';

const logger = createLogger('FontService');

/**
 * 字体服务选项接口
 * @description 字体服务的配置选项
 */
export interface FontServiceOptions {
  /** 是否启用缓存，默认 true */
  enableCache?: boolean;
  /** 最大缓存数量，默认 50 */
  maxCacheSize?: number;
  /** 默认选择策略，默认 'random' */
  defaultStrategy?: FontSelectionStrategy;
}

/**
 * 字体列表结果接口
 * @description 获取字体列表的结果
 */
export interface FontListResult {
  /** 是否成功 */
  success: boolean;
  /** 字体列表 */
  fonts?: FontInfo[];
  /** 字体数量 */
  count?: number;
  /** 错误信息 */
  error?: string;
}

/**
 * 字体加载结果接口
 * @description 加载字体的结果
 */
export interface FontLoadServiceResult {
  /** 是否成功 */
  success: boolean;
  /** 字体数据 */
  fontData?: FontData;
  /** 错误信息 */
  error?: string;
}

/**
 * 字体服务类
 * @description 提供字体管理的业务逻辑处理
 * @class FontService
 */
export class FontService {
  private options: Required<FontServiceOptions>;

  /**
   * 创建字体服务实例
   * @param options - 服务配置选项
   */
  constructor(options: FontServiceOptions = {}) {
    this.options = {
      enableCache: options.enableCache ?? fontConfig.cache.enabled,
      maxCacheSize: options.maxCacheSize ?? fontConfig.cache.maxSize,
      defaultStrategy: options.defaultStrategy ?? 'random',
    };
    logger.info('字体服务已初始化', this.options);
  }

  /**
   * 获取可用字体列表
   * @description 获取所有可用的字体文件列表
   * @returns 字体列表响应
   */
  async getFonts(): Promise<GetFontsResponse | ErrorResponse> {
    try {
      const fonts = getAvailableFonts();
      logger.info(`获取字体列表成功，共 ${fonts.length} 个字体`);

      return {
        success: true,
        data: {
          fonts: fonts.map(f => f.fileName),
          count: fonts.length,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.error('获取字体列表失败', error);

      return {
        success: false,
        error: '获取字体列表失败',
        message: errorMessage,
      };
    }
  }

  /**
   * 获取字体详细信息列表
   * @description 获取所有字体的详细信息
   * @returns 字体列表结果
   */
  async getFontDetails(): Promise<FontListResult> {
    try {
      const fonts = getAvailableFonts();
      return { success: true, fonts, count: fonts.length };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.error('获取字体详细信息失败', error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 选择字体
   * @description 根据策略选择合适的字体
   * @param strategy - 选择策略
   * @param options - 选择选项
   * @returns 字体信息
   */
  selectFontByStrategy(
    strategy?: FontSelectionStrategy,
    options?: { specifiedFont?: string; excludeFonts?: string[] }
  ): FontInfo {
    const actualStrategy = strategy ?? this.options.defaultStrategy;
    logger.debug(`使用策略选择字体: ${actualStrategy}`);
    return selectFont(actualStrategy, options);
  }

  /**
   * 加载指定字体
   * @description 加载指定的字体文件
   * @param fileName - 字体文件名
   * @param useCache - 是否使用缓存
   * @returns 字体加载结果
   */
  async loadFontByName(fileName: string, useCache?: boolean): Promise<FontLoadServiceResult> {
    const shouldUseCache = useCache ?? this.options.enableCache;
    logger.info(`加载字体: ${fileName}, 使用缓存: ${shouldUseCache}`);

    try {
      const fontData = await loadFont(fileName, shouldUseCache);
      return { success: true, fontData };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.error(`加载字体失败: ${fileName}`, error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 加载字体（带重试）
   * @description 加载字体，失败时尝试其他字体
   * @param fileName - 字体文件名
   * @returns 字体加载结果
   */
  async loadFontWithRetryService(fileName: string): Promise<FontLoadServiceResult> {
    logger.info(`加载字体（带重试）: ${fileName}`);

    try {
      const fontData = await loadFontWithRetry(fileName, true);
      return { success: true, fontData };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.error(`加载字体失败（带重试）: ${fileName}`, error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * 批量加载字体
   * @description 批量加载多个字体文件
   * @param fileNames - 字体文件名数组
   * @returns 字体数据数组
   */
  async loadFontsBatch(fileNames: string[]): Promise<FontData[]> {
    logger.info(`批量加载 ${fileNames.length} 个字体`);
    const fonts = await loadFonts(fileNames);
    logger.info(`批量加载完成: ${fonts.length}/${fileNames.length} 成功`);
    return fonts;
  }

  /**
   * 检查字体是否可用
   * @description 检查指定的字体文件是否存在
   * @param fileName - 字体文件名
   * @returns 字体是否可用
   */
  checkFontAvailable(fileName: string): boolean {
    return isFontAvailable(fileName);
  }

  /**
   * 获取随机字体
   * @description 获取一个随机字体
   * @param excludeFonts - 要排除的字体列表
   * @returns 字体信息
   */
  getRandomFont(excludeFonts?: string[]): FontInfo {
    return getRandomFont(excludeFonts);
  }

  /**
   * 获取默认字体
   * @description 获取配置的默认字体
   * @returns 字体信息
   */
  getDefaultFont(): FontInfo {
    return getDefaultFont();
  }

  /**
   * 清空字体缓存
   * @description 清空所有已缓存的字体
   */
  clearCache(): void {
    clearFontCache();
    logger.info('字体缓存已清空');
  }

  /**
   * 获取缓存大小
   * @description 获取当前缓存中的字体数量
   * @returns 缓存大小
   */
  getCacheSize(): number {
    return getFontCacheSize();
  }

  /**
   * 获取字体配置
   * @description 获取当前字体配置
   * @returns 字体配置
   */
  getConfig(): typeof fontConfig {
    return { ...fontConfig };
  }

  /**
   * 预加载默认字体
   * @description 预加载配置中的默认字体
   * @returns 加载结果数组
   */
  async preloadDefaultFonts(): Promise<FontLoadResult[]> {
    logger.info('开始预加载默认字体');
    const results: FontLoadResult[] = [];

    for (const fileName of fontConfig.defaultFonts) {
      try {
        const fontData = await loadFont(fileName, true);
        results.push({ success: true, data: fontData });
        logger.debug(`预加载字体成功: ${fileName}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        results.push({ success: false, error: errorMessage });
        logger.warn(`预加载字体失败: ${fileName} - ${errorMessage}`);
      }
    }

    const successCount = results.filter(r => r.success).length;
    logger.info(`预加载完成: ${successCount}/${results.length} 成功`);
    return results;
  }
}

const defaultFontService = new FontService();

/**
 * 获取字体列表
 * @description 使用默认字体服务实例获取字体列表
 * @returns 字体列表响应
 */
export async function getFontList(): Promise<GetFontsResponse | ErrorResponse> {
  return defaultFontService.getFonts();
}

/**
 * 加载字体
 * @description 使用默认字体服务实例加载字体
 * @param fileName - 字体文件名
 * @returns 字体加载结果
 */
export async function loadFontByName(fileName: string): Promise<FontLoadServiceResult> {
  return defaultFontService.loadFontByName(fileName);
}

/**
 * 选择字体
 * @description 使用默认字体服务实例选择字体
 * @param strategy - 选择策略
 * @param options - 选择选项
 * @returns 字体信息
 */
export function selectFontByStrategy(
  strategy?: FontSelectionStrategy,
  options?: { specifiedFont?: string; excludeFonts?: string[] }
): FontInfo {
  return defaultFontService.selectFontByStrategy(strategy, options);
}

/**
 * 获取字体服务实例
 * @description 获取默认的字体服务实例
 * @returns 字体服务实例
 */
export function getFontService(): FontService {
  return defaultFontService;
}

export default {
  FontService,
  getFontList,
  loadFontByName,
  selectFontByStrategy,
  getFontService,
};
