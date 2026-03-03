/**
 * @fileoverview 文件管理工具
 * @description 提供文件和目录的管理功能，包括创建、删除、检查等操作
 */

import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from './logger';

const logger = createLogger('FileManager');

/**
 * 文件信息接口
 * @description 文件的基本信息
 */
export interface FileInfo {
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  isFile: boolean;
  createdAt: Date;
  modifiedAt: Date;
}

/**
 * 目录创建选项
 * @description 创建目录时的配置选项
 */
export interface CreateDirectoryOptions {
  recursive?: boolean;
  mode?: number;
}

/**
 * 确保目录存在
 * @description 如果目录不存在则创建
 * @param dirPath - 目录路径
 * @param options - 创建选项
 * @returns 目录是否成功创建或已存在
 *
 * @example
 * ```typescript
 * await ensureDirectoryExists('./output/images');
 * ```
 */
export function ensureDirectoryExists(
  dirPath: string,
  options: CreateDirectoryOptions = {}
): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: options.recursive ?? true });
      logger.info(`目录已创建: ${dirPath}`);
      return true;
    }
    return true;
  } catch (error) {
    logger.error(`创建目录失败: ${dirPath}`, error);
    return false;
  }
}

/**
 * 创建目录
 * @description 创建新目录
 * @param dirPath - 目录路径
 * @param options - 创建选项
 * @returns 是否成功创建
 *
 * @example
 * ```typescript
 * const success = createDirectory('./output/images');
 * ```
 */
export function createDirectory(dirPath: string, options: CreateDirectoryOptions = {}): boolean {
  try {
    fs.mkdirSync(dirPath, {
      recursive: options.recursive ?? true,
      mode: options.mode,
    });
    logger.info(`目录已创建: ${dirPath}`);
    return true;
  } catch (error) {
    logger.error(`创建目录失败: ${dirPath}`, error);
    return false;
  }
}

/**
 * 生成唯一文件名
 * @description 基于时间戳和随机字符串生成唯一文件名
 * @param extension - 文件扩展名（包含点号）
 * @param prefix - 文件名前缀
 * @returns 唯一文件名
 *
 * @example
 * ```typescript
 * const filename = generateUniqueFileName('.png');
 * // 返回: '1678901234567_abc123.png'
 * ```
 */
export function generateUniqueFileName(extension: string, prefix: string = ''): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const prefixPart = prefix ? `${prefix}_` : '';

  return `${prefixPart}${timestamp}_${randomStr}${extension}`;
}

/**
 * 生成完整文件路径
 * @description 在指定目录下生成唯一的文件路径
 * @param directory - 目录路径
 * @param extension - 文件扩展名
 * @param prefix - 文件名前缀
 * @returns 完整的文件路径
 *
 * @example
 * ```typescript
 * const filepath = generateUniqueFilePath('./output/images', '.png');
 * ```
 */
export function generateUniqueFilePath(
  directory: string,
  extension: string,
  prefix: string = ''
): string {
  const fileName = generateUniqueFileName(extension, prefix);
  return path.join(directory, fileName);
}

/**
 * 检查文件是否存在
 * @description 检查指定路径的文件是否存在
 * @param filePath - 文件路径
 * @returns 文件是否存在
 *
 * @example
 * ```typescript
 * const exists = fileExists('./output/image.png');
 * ```
 */
export function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    logger.error(`检查文件存在失败: ${filePath}`, error);
    return false;
  }
}

/**
 * 检查目录是否存在
 * @description 检查指定路径的目录是否存在
 * @param dirPath - 目录路径
 * @returns 目录是否存在
 *
 * @example
 * ```typescript
 * const exists = directoryExists('./output/images');
 * ```
 */
export function directoryExists(dirPath: string): boolean {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    logger.error(`检查目录存在失败: ${dirPath}`, error);
    return false;
  }
}

/**
 * 删除文件
 * @description 删除指定路径的文件
 * @param filePath - 文件路径
 * @returns 是否成功删除
 *
 * @example
 * ```typescript
 * const success = deleteFile('./output/image.png');
 * ```
 */
export function deleteFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`文件已删除: ${filePath}`);
      return true;
    }
    logger.warn(`文件不存在，无需删除: ${filePath}`);
    return true;
  } catch (error) {
    logger.error(`删除文件失败: ${filePath}`, error);
    return false;
  }
}

/**
 * 删除目录
 * @description 删除指定路径的目录
 * @param dirPath - 目录路径
 * @param recursive - 是否递归删除
 * @returns 是否成功删除
 *
 * @example
 * ```typescript
 * const success = deleteDirectory('./output/temp', true);
 * ```
 */
export function deleteDirectory(dirPath: string, recursive: boolean = false): boolean {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive, force: true });
      logger.info(`目录已删除: ${dirPath}`);
      return true;
    }
    logger.warn(`目录不存在，无需删除: ${dirPath}`);
    return true;
  } catch (error) {
    logger.error(`删除目录失败: ${dirPath}`, error);
    return false;
  }
}

/**
 * 获取文件信息
 * @description 获取文件的详细信息
 * @param filePath - 文件路径
 * @returns 文件信息或 null
 *
 * @example
 * ```typescript
 * const info = getFileInfo('./output/image.png');
 * if (info) {
 *   console.log(`文件大小: ${info.size} 字节`);
 * }
 * ```
 */
export function getFileInfo(filePath: string): FileInfo | null {
  try {
    if (!fs.existsSync(filePath)) {
      logger.warn(`文件不存在: ${filePath}`);
      return null;
    }

    const stats = fs.statSync(filePath);

    return {
      name: path.basename(filePath),
      path: filePath,
      size: stats.size,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  } catch (error) {
    logger.error(`获取文件信息失败: ${filePath}`, error);
    return null;
  }
}

/**
 * 列出目录中的文件
 * @description 列出目录中的所有文件
 * @param dirPath - 目录路径
 * @param extensions - 文件扩展名过滤（可选）
 * @returns 文件名数组
 *
 * @example
 * ```typescript
 * const files = listFiles('./fonts', ['.ttf']);
 * ```
 */
export function listFiles(dirPath: string, extensions?: string[]): string[] {
  try {
    if (!fs.existsSync(dirPath)) {
      logger.warn(`目录不存在: ${dirPath}`);
      return [];
    }

    const files = fs.readdirSync(dirPath);

    if (extensions && extensions.length > 0) {
      return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return extensions.includes(ext);
      });
    }

    return files;
  } catch (error) {
    logger.error(`列出文件失败: ${dirPath}`, error);
    return [];
  }
}

/**
 * 列出目录中的文件完整路径
 * @description 列出目录中所有文件的完整路径
 * @param dirPath - 目录路径
 * @param extensions - 文件扩展名过滤（可选）
 * @returns 文件完整路径数组
 *
 * @example
 * ```typescript
 * const filePaths = listFilePaths('./fonts', ['.ttf']);
 * ```
 */
export function listFilePaths(dirPath: string, extensions?: string[]): string[] {
  const files = listFiles(dirPath, extensions);
  return files.map(file => path.join(dirPath, file));
}

/**
 * 获取文件扩展名
 * @description 获取文件的扩展名
 * @param filePath - 文件路径或文件名
 * @returns 文件扩展名（小写，包含点号）
 *
 * @example
 * ```typescript
 * const ext = getFileExtension('image.png');
 * // 返回: '.png'
 * ```
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

/**
 * 获取文件名（不含扩展名）
 * @description 获取文件的基本名称，不包含扩展名
 * @param filePath - 文件路径或文件名
 * @returns 文件基本名称
 *
 * @example
 * ```typescript
 * const name = getFileBaseName('image.png');
 * // 返回: 'image'
 * ```
 */
export function getFileBaseName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

/**
 * 复制文件
 * @description 复制文件到目标路径
 * @param srcPath - 源文件路径
 * @param destPath - 目标文件路径
 * @returns 是否成功复制
 *
 * @example
 * ```typescript
 * const success = copyFile('./source.png', './dest.png');
 * ```
 */
export function copyFile(srcPath: string, destPath: string): boolean {
  try {
    fs.copyFileSync(srcPath, destPath);
    logger.info(`文件已复制: ${srcPath} -> ${destPath}`);
    return true;
  } catch (error) {
    logger.error(`复制文件失败: ${srcPath} -> ${destPath}`, error);
    return false;
  }
}

/**
 * 移动文件
 * @description 移动文件到目标路径
 * @param srcPath - 源文件路径
 * @param destPath - 目标文件路径
 * @returns 是否成功移动
 *
 * @example
 * ```typescript
 * const success = moveFile('./source.png', './dest.png');
 * ```
 */
export function moveFile(srcPath: string, destPath: string): boolean {
  try {
    fs.renameSync(srcPath, destPath);
    logger.info(`文件已移动: ${srcPath} -> ${destPath}`);
    return true;
  } catch (error) {
    logger.error(`移动文件失败: ${srcPath} -> ${destPath}`, error);
    return false;
  }
}

/**
 * 清空目录
 * @description 删除目录中的所有文件和子目录
 * @param dirPath - 目录路径
 * @returns 是否成功清空
 *
 * @example
 * ```typescript
 * const success = clearDirectory('./output/temp');
 * ```
 */
export function clearDirectory(dirPath: string): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      return true;
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        deleteDirectory(filePath, true);
      } else {
        deleteFile(filePath);
      }
    }

    logger.info(`目录已清空: ${dirPath}`);
    return true;
  } catch (error) {
    logger.error(`清空目录失败: ${dirPath}`, error);
    return false;
  }
}

/**
 * 获取目录大小
 * @description 计算目录的总大小（字节）
 * @param dirPath - 目录路径
 * @returns 目录大小（字节）
 *
 * @example
 * ```typescript
 * const size = getDirectorySize('./output');
 * console.log(`目录大小: ${size} 字节`);
 * ```
 */
export function getDirectorySize(dirPath: string): number {
  let totalSize = 0;

  try {
    if (!fs.existsSync(dirPath)) {
      return 0;
    }

    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        totalSize += getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  } catch (error) {
    logger.error(`计算目录大小失败: ${dirPath}`, error);
  }

  return totalSize;
}

export default {
  ensureDirectoryExists,
  createDirectory,
  generateUniqueFileName,
  generateUniqueFilePath,
  fileExists,
  directoryExists,
  deleteFile,
  deleteDirectory,
  getFileInfo,
  listFiles,
  listFilePaths,
  getFileExtension,
  getFileBaseName,
  copyFile,
  moveFile,
  clearDirectory,
  getDirectorySize,
};
