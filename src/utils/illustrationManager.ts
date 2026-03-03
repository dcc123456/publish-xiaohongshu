/**
 * @fileoverview 插画管理工具
 * @description 提供插画加载和管理功能
 */

import * as path from 'path';
import * as fs from 'fs';
import * as PImage from 'pureimage';
import { createLogger } from './logger';
import { listFiles, fileExists, ensureDirectoryExists } from './fileManager';
import { imageConfig } from '../config/image.config';

const logger = createLogger('IllustrationManager');

const ILLUSTRATIONS_DIR = path.resolve(__dirname, '../../illustrations');

ensureDirectoryExists(ILLUSTRATIONS_DIR);

/**
 * 获取可用插画列表
 * @description 获取插画目录中的所有可用插画文件
 * @returns 插画文件名数组
 *
 * @example
 * ```typescript
 * const illustrations = getAvailableIllustrations();
 * ```
 */
export function getAvailableIllustrations(): string[] {
  if (!fs.existsSync(ILLUSTRATIONS_DIR)) {
    logger.warn(`插画目录不存在: ${ILLUSTRATIONS_DIR}`);
    return [];
  }

  const files = listFiles(ILLUSTRATIONS_DIR, imageConfig.illustration.extensions);
  logger.debug(`找到 ${files.length} 个插画文件`);
  return files;
}

/**
 * 获取随机插画
 * @description 随机选择一个插画文件
 * @returns 插画文件名或 null
 *
 * @example
 * ```typescript
 * const illustration = getRandomIllustration();
 * ```
 */
export function getRandomIllustration(): string | null {
  const illustrations = getAvailableIllustrations();

  if (illustrations.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * illustrations.length);
  return illustrations[randomIndex];
}

/**
 * 加载插画图片
 * @description 加载指定的插画图片文件
 * @param fileName - 插画文件名
 * @returns 图片对象或 null
 *
 * @example
 * ```typescript
 * const img = await loadIllustration('background.png');
 * ```
 */
export async function loadIllustration(fileName: string): Promise<PImage.Bitmap | null> {
  const illustrationPath = path.join(ILLUSTRATIONS_DIR, fileName);

  if (!fileExists(illustrationPath)) {
    logger.warn(`插画文件不存在: ${illustrationPath}`);
    return null;
  }

  try {
    const img = await PImage.decodePNGFromStream(fs.createReadStream(illustrationPath));
    logger.debug(`加载插画成功: ${fileName}`);
    return img;
  } catch (error) {
    logger.error(`加载插画失败: ${fileName}`, error);
    return null;
  }
}

/**
 * 检查插画是否可用
 * @description 检查指定的插画文件是否存在
 * @param fileName - 插画文件名
 * @returns 插画是否可用
 *
 * @example
 * ```typescript
 * const available = isIllustrationAvailable('background.png');
 * ```
 */
export function isIllustrationAvailable(fileName: string): boolean {
  const illustrationPath = path.join(ILLUSTRATIONS_DIR, fileName);
  return fileExists(illustrationPath);
}

/**
 * 获取插画文件路径
 * @description 获取插画文件的完整路径
 * @param fileName - 插画文件名
 * @returns 插画文件完整路径
 *
 * @example
 * ```typescript
 * const path = getIllustrationPath('background.png');
 * ```
 */
export function getIllustrationPath(fileName: string): string {
  return path.join(ILLUSTRATIONS_DIR, fileName);
}

export default {
  getAvailableIllustrations,
  getRandomIllustration,
  loadIllustration,
  isIllustrationAvailable,
  getIllustrationPath,
};
