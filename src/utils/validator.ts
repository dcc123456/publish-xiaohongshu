/**
 * @fileoverview 参数验证工具
 * @description 提供图片、文本、字体等参数的验证功能
 */

import { ImageFormat } from '../types/image.types';

/**
 * 验证结果接口
 * @description 验证操作的返回结果
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 图片尺寸验证选项
 * @description 图片尺寸验证的配置选项
 */
export interface SizeValidationOptions {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

/**
 * 验证颜色格式
 * @description 验证是否为有效的十六进制颜色值
 * @param color - 颜色字符串
 * @returns 是否为有效的颜色格式
 *
 * @example
 * ```typescript
 * isValidColor('#FFFFFF'); // true
 * isValidColor('#FF6B6B'); // true
 * isValidColor('invalid'); // false
 * ```
 */
export function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false;
  }

  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexPattern.test(color);
}

/**
 * 验证图片尺寸
 * @description 验证图片宽度和高度是否在有效范围内
 * @param width - 图片宽度
 * @param height - 图片高度
 * @param options - 验证选项
 * @returns 验证结果
 *
 * @example
 * ```typescript
 * const result = validateImageSize(800, 600, { minWidth: 100, maxWidth: 2000 });
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateImageSize(
  width: number,
  height: number,
  options: SizeValidationOptions = {}
): ValidationResult {
  const errors: string[] = [];
  const { minWidth = 1, maxWidth = 10000, minHeight = 1, maxHeight = 10000 } = options;

  if (!Number.isInteger(width) || width < minWidth || width > maxWidth) {
    errors.push(`宽度必须是 ${minWidth} 到 ${maxWidth} 之间的整数`);
  }

  if (!Number.isInteger(height) || height < minHeight || height > maxHeight) {
    errors.push(`高度必须是 ${minHeight} 到 ${maxHeight} 之间的整数`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证图片格式
 * @description 验证是否为支持的图片格式
 * @param format - 图片格式字符串
 * @returns 是否为有效的图片格式
 *
 * @example
 * ```typescript
 * isValidImageFormat('png'); // true
 * isValidImageFormat('jpeg'); // true
 * isValidImageFormat('gif'); // false
 * ```
 */
export function isValidImageFormat(format: string): format is ImageFormat {
  const validFormats: ImageFormat[] = ['png', 'jpeg', 'webp'];
  return (
    validFormats.includes(format.toLowerCase() as ImageFormat) || format.toLowerCase() === 'jpg'
  );
}

/**
 * 验证字体大小
 * @description 验证字体大小是否在合理范围内
 * @param fontSize - 字体大小（点）
 * @param minSize - 最小字体大小
 * @param maxSize - 最大字体大小
 * @returns 验证结果
 *
 * @example
 * ```typescript
 * const result = validateFontSize(32, 8, 200);
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateFontSize(
  fontSize: number,
  minSize: number = 8,
  maxSize: number = 200
): ValidationResult {
  const errors: string[] = [];

  if (typeof fontSize !== 'number' || isNaN(fontSize)) {
    errors.push('字体大小必须是数字');
  } else if (fontSize < minSize || fontSize > maxSize) {
    errors.push(`字体大小必须在 ${minSize} 到 ${maxSize} 之间`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证文本内容
 * @description 验证文本是否有效
 * @param text - 文本内容
 * @param options - 验证选项
 * @returns 验证结果
 *
 * @example
 * ```typescript
 * const result = validateText('Hello World', { minLength: 1, maxLength: 1000 });
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateText(
  text: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
  } = {}
): ValidationResult {
  const errors: string[] = [];
  const { minLength = 0, maxLength = 10000, required = true } = options;

  if (!text || typeof text !== 'string') {
    if (required) {
      errors.push('文本内容不能为空');
    }
    return { valid: errors.length === 0, errors };
  }

  if (text.length < minLength) {
    errors.push(`文本长度不能少于 ${minLength} 个字符`);
  }

  if (text.length > maxLength) {
    errors.push(`文本长度不能超过 ${maxLength} 个字符`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证透明度值
 * @description 验证透明度是否在 0-1 范围内
 * @param opacity - 透明度值
 * @returns 是否为有效的透明度值
 *
 * @example
 * ```typescript
 * isValidOpacity(0.5); // true
 * isValidOpacity(1.5); // false
 * ```
 */
export function isValidOpacity(opacity: number): boolean {
  return typeof opacity === 'number' && opacity >= 0 && opacity <= 1;
}

/**
 * 验证字体文件名
 * @description 验证字体文件名格式是否正确
 * @param fileName - 字体文件名
 * @returns 是否为有效的字体文件名
 *
 * @example
 * ```typescript
 * isValidFontFileName('SourceHanSansCN-Bold.ttf'); // true
 * isValidFontFileName('font.txt'); // false
 * ```
 */
export function isValidFontFileName(fileName: string): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false;
  }

  const validExtensions = ['.ttf', '.otf', '.ttc'];
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));

  return validExtensions.includes(ext);
}

/**
 * 验证插画文件名
 * @description 验证插画文件名格式是否正确
 * @param fileName - 插画文件名
 * @returns 是否为有效的插画文件名
 *
 * @example
 * ```typescript
 * isValidIllustrationFileName('background.png'); // true
 * isValidIllustrationFileName('image.txt'); // false
 * ```
 */
export function isValidIllustrationFileName(fileName: string): boolean {
  if (!fileName || typeof fileName !== 'string') {
    return false;
  }

  const validExtensions = ['.png', '.jpg', '.jpeg'];
  const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));

  return validExtensions.includes(ext);
}

/**
 * 验证关键词数组
 * @description 验证高亮关键词数组是否有效
 * @param keywords - 关键词数组
 * @returns 验证结果
 *
 * @example
 * ```typescript
 * const result = validateKeywords(['重要', '关键']);
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateKeywords(keywords: string[]): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(keywords)) {
    errors.push('关键词必须是数组');
    return { valid: false, errors };
  }

  for (const keyword of keywords) {
    if (typeof keyword !== 'string' || keyword.trim().length === 0) {
      errors.push('关键词必须是非空字符串');
      break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证图片生成参数
 * @description 验证图片生成的所有参数
 * @param params - 图片生成参数
 * @returns 验证结果
 *
 * @example
 * ```typescript
 * const result = validateImageParams({
 *   text: 'Hello',
 *   width: 800,
 *   height: 600,
 *   fontSize: 32
 * });
 * ```
 */
export function validateImageParams(params: {
  text: string;
  width: number;
  height: number;
  fontSize?: number;
  backgroundColor?: string;
  color?: string;
  format?: string;
  opacity?: number;
  highlightKeywords?: string[];
}): ValidationResult {
  const errors: string[] = [];

  const textResult = validateText(params.text);
  errors.push(...textResult.errors);

  const sizeResult = validateImageSize(params.width, params.height);
  errors.push(...sizeResult.errors);

  if (params.fontSize !== undefined) {
    const fontSizeResult = validateFontSize(params.fontSize);
    errors.push(...fontSizeResult.errors);
  }

  if (params.backgroundColor !== undefined && !isValidColor(params.backgroundColor)) {
    errors.push('背景颜色格式无效');
  }

  if (params.color !== undefined && !isValidColor(params.color)) {
    errors.push('文本颜色格式无效');
  }

  if (params.format !== undefined && !isValidImageFormat(params.format)) {
    errors.push('图片格式无效');
  }

  if (params.opacity !== undefined && !isValidOpacity(params.opacity)) {
    errors.push('透明度必须在 0-1 之间');
  }

  if (params.highlightKeywords !== undefined) {
    const keywordsResult = validateKeywords(params.highlightKeywords);
    errors.push(...keywordsResult.errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 验证文件路径
 * @description 验证文件路径是否安全
 * @param filePath - 文件路径
 * @returns 是否为安全的文件路径
 *
 * @example
 * ```typescript
 * isValidFilePath('/path/to/file.txt'); // true
 * isValidFilePath('../etc/passwd'); // false
 * ```
 */
export function isValidFilePath(filePath: string): boolean {
  if (!filePath || typeof filePath !== 'string') {
    return false;
  }

  const dangerousPatterns = [/\.\./, /~/, /\0/];

  return !dangerousPatterns.some(pattern => pattern.test(filePath));
}

export default {
  isValidColor,
  validateImageSize,
  isValidImageFormat,
  validateFontSize,
  validateText,
  isValidOpacity,
  isValidFontFileName,
  isValidIllustrationFileName,
  validateKeywords,
  validateImageParams,
  isValidFilePath,
};
