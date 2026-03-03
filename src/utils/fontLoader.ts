/**
 * @fileoverview 字体加载工具
 * @description 提供字体加载、缓存和管理功能
 */

import * as fs from 'fs';
import * as PImage from 'pureimage';
import { createLogger } from './logger';
import { listFiles, fileExists, getFileBaseName } from './fileManager';
import { FontData, FontInfo, FontSelectionStrategy } from '../types/font.types';
import { fontConfig, getFontFilePath } from '../config/font.config';

const logger = createLogger('FontLoader');

/**
 * 字体缓存类
 * @description 管理已加载字体的缓存
 * @class FontCache
 */
class FontCache {
  private cache: Map<string, FontData> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  /**
   * 获取缓存的字体
   * @param key - 缓存键
   * @returns 字体数据或 undefined
   */
  get(key: string): FontData | undefined {
    return this.cache.get(key);
  }

  /**
   * 设置字体缓存
   * @param key - 缓存键
   * @param fontData - 字体数据
   */
  set(key: string, fontData: FontData): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
        logger.debug(`缓存已满，移除: ${firstKey}`);
      }
    }
    this.cache.set(key, fontData);
    logger.debug(`字体已缓存: ${key}`);
  }

  /**
   * 检查缓存是否存在
   * @param key - 缓存键
   * @returns 是否存在
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
    logger.info('字体缓存已清空');
  }

  /**
   * 获取缓存大小
   * @returns 缓存中的字体数量
   */
  size(): number {
    return this.cache.size;
  }
}

const fontCache = new FontCache(fontConfig.cache.maxSize);

/**
 * 获取可用字体列表
 * @description 获取字体目录中所有可用的字体文件
 * @returns 字体信息数组
 *
 * @example
 * ```typescript
 * const fonts = getAvailableFonts();
 * console.log(`找到 ${fonts.length} 个字体`);
 * ```
 */
export function getAvailableFonts(): FontInfo[] {
  const fontsDir = fontConfig.directory.path;

  if (!fs.existsSync(fontsDir)) {
    logger.warn(`字体目录不存在: ${fontsDir}`);
    return [];
  }

  const files = listFiles(fontsDir, fontConfig.directory.extensions);

  const fonts: FontInfo[] = files.map(fileName => ({
    fileName,
    fontName: getFileBaseName(fileName),
    filePath: getFontFilePath(fileName),
  }));

  logger.debug(`找到 ${fonts.length} 个可用字体`);
  return fonts;
}

/**
 * 获取随机字体
 * @description 从可用字体中随机选择一个
 * @param excludeFonts - 要排除的字体列表
 * @returns 字体信息
 * @throws 当没有可用字体时抛出错误
 *
 * @example
 * ```typescript
 * const font = getRandomFont(['font1.ttf']);
 * console.log(`选择字体: ${font.fileName}`);
 * ```
 */
export function getRandomFont(excludeFonts: string[] = []): FontInfo {
  const fonts = getAvailableFonts().filter(font => !excludeFonts.includes(font.fileName));

  if (fonts.length === 0) {
    throw new Error('没有可用的字体文件');
  }

  const randomIndex = Math.floor(Math.random() * fonts.length);
  const selectedFont = fonts[randomIndex];

  logger.debug(`随机选择字体: ${selectedFont.fileName}`);
  return selectedFont;
}

/**
 * 加载字体
 * @description 加载指定的字体文件
 * @param fileName - 字体文件名
 * @param useCache - 是否使用缓存
 * @returns 字体数据
 * @throws 当字体加载失败时抛出错误
 *
 * @example
 * ```typescript
 * const fontData = await loadFont('SourceHanSansCN-Bold.ttf');
 * console.log(`字体名称: ${fontData.fontName}`);
 * ```
 */
export async function loadFont(fileName: string, useCache: boolean = true): Promise<FontData> {
  const cacheKey = fileName;

  if (useCache && fontCache.has(cacheKey)) {
    logger.debug(`从缓存加载字体: ${fileName}`);
    return fontCache.get(cacheKey)!;
  }

  const fontPath = getFontFilePath(fileName);

  if (!fileExists(fontPath)) {
    const error = new Error(`字体文件不存在: ${fontPath}`);
    logger.error(`字体文件不存在: ${fontPath}`);
    throw error;
  }

  try {
    logger.info(`正在加载字体: ${fontPath}`);

    const fontName = getFileBaseName(fileName);
    const font = PImage.registerFont(fontPath, fontName);
    await font.load();

    const fontData: FontData = {
      font,
      fontName,
      fileName,
    };

    if (useCache) {
      fontCache.set(cacheKey, fontData);
    }

    logger.info(`成功加载字体: ${fileName} (名称: ${fontName})`);
    return fontData;
  } catch (error) {
    logger.error(`加载字体失败: ${fileName}`, error);
    throw error;
  }
}

/**
 * 选择字体
 * @description 根据策略选择字体
 * @param strategy - 选择策略
 * @param options - 选择选项
 * @returns 字体信息
 * @throws 当无法选择字体时抛出错误
 *
 * @example
 * ```typescript
 * const font = selectFont('random', { excludeFonts: ['font1.ttf'] });
 * ```
 */
export function selectFont(
  strategy: FontSelectionStrategy = 'random',
  options: {
    specifiedFont?: string;
    excludeFonts?: string[];
  } = {}
): FontInfo {
  switch (strategy) {
    case 'specified': {
      if (!options.specifiedFont) {
        throw new Error('指定字体策略需要提供 specifiedFont 参数');
      }
      const fonts = getAvailableFonts();
      const font = fonts.find(f => f.fileName === options.specifiedFont);
      if (!font) {
        throw new Error(`指定的字体不存在: ${options.specifiedFont}`);
      }
      return font;
    }

    case 'sequential': {
      const availableFonts = getAvailableFonts().filter(
        f => !options.excludeFonts?.includes(f.fileName)
      );
      if (availableFonts.length === 0) {
        throw new Error('没有可用的字体文件');
      }
      return availableFonts[0];
    }

    case 'random':
    default:
      return getRandomFont(options.excludeFonts);
  }
}

/**
 * 加载字体并处理错误
 * @description 加载字体，支持失败重试
 * @param fileName - 字体文件名
 * @param retryWithRandom - 失败后是否随机选择其他字体
 * @returns 字体数据
 * @throws 当所有尝试都失败时抛出错误
 *
 * @example
 * ```typescript
 * const fontData = await loadFontWithRetry('font.ttf', true);
 * ```
 */
export async function loadFontWithRetry(
  fileName: string,
  retryWithRandom: boolean = true
): Promise<FontData> {
  try {
    return await loadFont(fileName);
  } catch (error) {
    if (retryWithRandom) {
      logger.warn(`字体加载失败，尝试随机字体: ${fileName}`);
      const availableFonts = getAvailableFonts();
      const otherFonts = availableFonts.filter(f => f.fileName !== fileName);

      if (otherFonts.length > 0) {
        const randomFont = otherFonts[Math.floor(Math.random() * otherFonts.length)];
        return await loadFont(randomFont.fileName);
      }
    }
    throw error;
  }
}

/**
 * 批量加载字体
 * @description 批量加载多个字体文件
 * @param fileNames - 字体文件名数组
 * @returns 字体数据数组
 *
 * @example
 * ```typescript
 * const fonts = await loadFonts(['font1.ttf', 'font2.ttf']);
 * ```
 */
export async function loadFonts(fileNames: string[]): Promise<FontData[]> {
  const results: FontData[] = [];
  const errors: string[] = [];

  for (const fileName of fileNames) {
    try {
      const fontData = await loadFont(fileName);
      results.push(fontData);
    } catch (error) {
      errors.push(fileName);
      logger.error(`批量加载字体失败: ${fileName}`, error);
    }
  }

  if (errors.length > 0) {
    logger.warn(`${errors.length} 个字体加载失败: ${errors.join(', ')}`);
  }

  return results;
}

/**
 * 检查字体是否可用
 * @description 检查指定的字体文件是否存在且可加载
 * @param fileName - 字体文件名
 * @returns 字体是否可用
 *
 * @example
 * ```typescript
 * const available = isFontAvailable('font.ttf');
 * ```
 */
export function isFontAvailable(fileName: string): boolean {
  const fontPath = getFontFilePath(fileName);
  return fileExists(fontPath);
}

/**
 * 清空字体缓存
 * @description 清空所有已缓存的字体
 *
 * @example
 * ```typescript
 * clearFontCache();
 * ```
 */
export function clearFontCache(): void {
  fontCache.clear();
}

/**
 * 获取字体缓存大小
 * @description 获取当前缓存中的字体数量
 * @returns 缓存大小
 *
 * @example
 * ```typescript
 * const size = getFontCacheSize();
 * console.log(`缓存中有 ${size} 个字体`);
 * ```
 */
export function getFontCacheSize(): number {
  return fontCache.size();
}

/**
 * 获取默认字体
 * @description 获取默认字体，优先使用配置中的默认字体
 * @returns 字体信息
 * @throws 当没有可用字体时抛出错误
 *
 * @example
 * ```typescript
 * const defaultFont = getDefaultFont();
 * ```
 */
export function getDefaultFont(): FontInfo {
  const availableFonts = getAvailableFonts();

  for (const defaultFontName of fontConfig.defaultFonts) {
    const font = availableFonts.find(f => f.fileName === defaultFontName);
    if (font) {
      logger.debug(`使用默认字体: ${font.fileName}`);
      return font;
    }
  }

  logger.warn('未找到配置的默认字体，使用随机字体');
  return getRandomFont();
}

export default {
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
};
