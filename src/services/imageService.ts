/**
 * @fileoverview 图片生成业务逻辑服务
 * @description 整合图片生成流程，处理图片生成请求，调用工具函数完成图片生成
 */

import { createLogger } from '../utils/logger';
import { createTextImage, CreateImageOptions } from '../utils/imageGenerator';
import { getAvailableFonts } from '../utils/fontLoader';
import { imageConfig } from '../config/image.config';
import { TextToImageRequest } from '../types/request.types';
import { ImageData, TextToImageResponse, ErrorResponse } from '../types/response.types';
import { ImageFormat } from '../types/image.types';

const logger = createLogger('ImageService');

/**
 * 图片生成服务选项接口
 * @description 图片生成服务的配置选项
 */
export interface ImageServiceOptions {
  /**
   * 是否启用字体重试
   * @description 当字体加载失败时是否尝试其他字体
   * @default true
   */
  enableFontRetry?: boolean;

  /**
   * 最大重试次数
   * @description 字体加载失败时的最大重试次数
   * @default 5
   */
  maxRetryAttempts?: number;

  /**
   * 是否启用日志
   * @description 是否记录详细日志
   * @default true
   */
  enableLogging?: boolean;
}

/**
 * 图片生成结果接口
 * @description 图片生成服务的返回结果
 */
export interface ServiceImageGenerationResult {
  /**
   * 是否成功
   */
  success: boolean;

  /**
   * 图片数据
   * @description 成功时返回图片数据
   */
  data?: ImageData;

  /**
   * 错误信息
   * @description 失败时返回错误信息
   */
  error?: string;

  /**
   * 错误详情
   * @description 失败时返回详细错误信息
   */
  errorDetails?: string;
}

/**
 * 图片生成服务类
 * @description 提供图片生成的业务逻辑处理
 * @class ImageService
 */
export class ImageService {
  private options: ImageServiceOptions;

  /**
   * 创建图片服务实例
   * @param options - 服务配置选项
   *
   * @example
   * ```typescript
   * const imageService = new ImageService({
   *   enableFontRetry: true,
   *   maxRetryAttempts: 5,
   * });
   * ```
   */
  constructor(options: ImageServiceOptions = {}) {
    this.options = {
      enableFontRetry: options.enableFontRetry ?? true,
      maxRetryAttempts: options.maxRetryAttempts ?? imageConfig.fontRetry.maxAttempts,
      enableLogging: options.enableLogging ?? true,
    };
    logger.info('图片服务已初始化', this.options);
  }

  /**
   * 处理文字转图片请求
   * @description 将请求参数转换为图片生成选项并生成图片
   * @param request - 文字转图片请求参数
   * @returns 图片生成响应
   *
   * @example
   * ```typescript
   * const response = await imageService.textToImage({
   *   text: 'Hello World',
   *   width: 800,
   *   height: 600,
   * });
   * ```
   */
  async textToImage(request: TextToImageRequest): Promise<TextToImageResponse | ErrorResponse> {
    logger.info('处理文字转图片请求', { text: request.text?.substring(0, 50) });

    const validationResult = this.validateRequest(request);
    if (!validationResult.valid) {
      return {
        success: false,
        error: '参数验证失败',
        message: validationResult.errors.join('; '),
      };
    }

    const imageOptions = this.buildImageOptions(request);

    try {
      const result = await this.generateImage(request.text, imageOptions);

      if (!result.success || !result.data) {
        return {
          success: false,
          error: '图片生成失败',
          message: result.error || '未知错误',
        };
      }

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.error('图片生成失败', error);

      return {
        success: false,
        error: '图片生成异常',
        message: errorMessage,
      };
    }
  }

  /**
   * 验证请求参数
   * @description 验证文字转图片请求的参数是否有效
   * @param request - 请求参数
   * @returns 验证结果
   */
  private validateRequest(request: TextToImageRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!request.text || typeof request.text !== 'string') {
      errors.push('text 参数是必需的且必须为字符串');
    }

    if (request.text && request.text.trim().length === 0) {
      errors.push('text 参数不能为空');
    }

    if (request.width !== undefined && (request.width < 100 || request.width > 4096)) {
      errors.push('width 必须在 100 到 4096 之间');
    }

    if (request.height !== undefined && (request.height < 100 || request.height > 4096)) {
      errors.push('height 必须在 100 到 4096 之间');
    }

    if (request.fontSize !== undefined && (request.fontSize < 8 || request.fontSize > 200)) {
      errors.push('fontSize 必须在 8 到 200 之间');
    }

    if (
      request.illustrationOpacity !== undefined &&
      (request.illustrationOpacity < 0 || request.illustrationOpacity > 1)
    ) {
      errors.push('illustrationOpacity 必须在 0 到 1 之间');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * 构建图片生成选项
   * @description 将请求参数转换为图片生成选项
   * @param request - 请求参数
   * @returns 图片生成选项
   */
  private buildImageOptions(request: TextToImageRequest): Partial<CreateImageOptions> {
    return {
      width: request.width ?? imageConfig.defaultSize.width,
      height: request.height ?? imageConfig.defaultSize.height,
      format: (request.format as ImageFormat) ?? imageConfig.defaultFormat,
      fontSize: request.fontSize ?? imageConfig.defaultFontSize,
      color: request.color ?? imageConfig.colors.text,
      backgroundColor: request.backgroundColor ?? imageConfig.colors.background,
      fontFile: request.fontFile ?? null,
      illustration: {
        enabled: request.useIllustration ?? imageConfig.illustration.enabled,
        fileName: request.illustrationFile ?? null,
        opacity: request.illustrationOpacity ?? imageConfig.illustration.opacity,
      },
      highlight: {
        keywords: request.highlightKeywords ?? [],
        color: request.highlightColor ?? imageConfig.colors.highlight,
      },
    };
  }

  /**
   * 生成图片
   * @description 调用图片生成工具生成图片
   * @param text - 文本内容
   * @param options - 图片选项
   * @returns 图片生成结果
   */
  private async generateImage(
    text: string,
    options: Partial<CreateImageOptions>
  ): Promise<ServiceImageGenerationResult> {
    let attempts = 0;
    const maxAttempts = this.options.maxRetryAttempts!;
    const triedFonts = new Set<string>();

    while (attempts < maxAttempts) {
      try {
        const result = await createTextImage(text, options);

        return {
          success: true,
          data: {
            url: this.buildFullUrl(result.url),
            relativeUrl: result.url,
            width: options.width ?? imageConfig.defaultSize.width,
            height: options.height ?? imageConfig.defaultSize.height,
            format: (options.format as ImageFormat) ?? imageConfig.defaultFormat,
            fontUsed: result.fontUsed,
            fontName: result.fontName,
            illustrationUsed: result.illustrationUsed,
          },
        };
      } catch (error) {
        attempts++;
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        logger.warn(`图片生成尝试 ${attempts}/${maxAttempts} 失败: ${errorMessage}`);

        if (attempts < maxAttempts && this.options.enableFontRetry) {
          const availableFonts = getAvailableFonts().filter(f => !triedFonts.has(f.fileName));

          if (availableFonts.length > 0) {
            const randomFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];
            options.fontFile = randomFont.fileName;
            triedFonts.add(randomFont.fileName);
            logger.info(`尝试使用字体: ${randomFont.fileName}`);
          } else {
            logger.error('没有更多可用字体');
            break;
          }
        } else {
          break;
        }
      }
    }

    return {
      success: false,
      error: `尝试了 ${attempts} 次后仍然失败`,
      errorDetails: '所有字体尝试均失败，请检查字体文件是否正确',
    };
  }

  /**
   * 构建完整 URL
   * @description 将相对 URL 转换为完整 URL
   * @param relativeUrl - 相对 URL
   * @returns 完整 URL
   */
  private buildFullUrl(relativeUrl: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}${relativeUrl}`;
  }

  /**
   * 批量生成图片
   * @description 批量生成多张图片
   * @param requests - 请求参数数组
   * @returns 图片生成结果数组
   *
   * @example
   * ```typescript
   * const results = await imageService.batchTextToImage([
   *   { text: 'Hello' },
   *   { text: 'World' },
   * ]);
   * ```
   */
  async batchTextToImage(
    requests: TextToImageRequest[]
  ): Promise<(TextToImageResponse | ErrorResponse)[]> {
    logger.info(`开始批量生成 ${requests.length} 张图片`);

    const results = await Promise.all(requests.map(request => this.textToImage(request)));

    const successCount = results.filter(r => r.success).length;
    logger.info(`批量生成完成: ${successCount}/${requests.length} 成功`);

    return results;
  }

  /**
   * 获取图片生成配置
   * @description 获取当前图片生成的默认配置
   * @returns 图片生成配置
   */
  getConfig(): typeof imageConfig {
    return { ...imageConfig };
  }
}

const defaultImageService = new ImageService();

/**
 * 处理文字转图片请求
 * @description 使用默认图片服务实例处理请求
 * @param request - 文字转图片请求参数
 * @returns 图片生成响应
 *
 * @example
 * ```typescript
 * const response = await processTextToImage({
 *   text: 'Hello World',
 * });
 * ```
 */
export async function processTextToImage(
  request: TextToImageRequest
): Promise<TextToImageResponse | ErrorResponse> {
  return defaultImageService.textToImage(request);
}

/**
 * 批量处理文字转图片请求
 * @description 使用默认图片服务实例批量处理请求
 * @param requests - 请求参数数组
 * @returns 图片生成响应数组
 *
 * @example
 * ```typescript
 * const responses = await batchProcessTextToImage([
 *   { text: 'Hello' },
 *   { text: 'World' },
 * ]);
 * ```
 */
export async function batchProcessTextToImage(
  requests: TextToImageRequest[]
): Promise<(TextToImageResponse | ErrorResponse)[]> {
  return defaultImageService.batchTextToImage(requests);
}

/**
 * 获取图片服务实例
 * @description 获取默认的图片服务实例
 * @returns 图片服务实例
 */
export function getImageService(): ImageService {
  return defaultImageService;
}

export default {
  ImageService,
  processTextToImage,
  batchProcessTextToImage,
  getImageService,
};
