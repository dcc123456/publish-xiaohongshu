/**
 * @fileoverview 图片生成控制器
 * @description 处理图片生成相关的 HTTP 请求，包括参数验证、业务逻辑调用和响应返回
 * @module controllers/image
 */

import { Request, Response, NextFunction } from 'express';
import { createTextImage } from '../utils/imageGenerator';
import { createLogger } from '../utils/logger';
import {
  validateText,
  validateImageSize,
  isValidColor,
  isValidImageFormat,
  isValidOpacity,
} from '../utils/validator';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { getServerAddress } from '../config/server.config';
import { TextToImageRequest, ImageGenerationOptions } from '../types/request.types';
import { TextToImageResponse, ErrorResponse, ImageData } from '../types/response.types';
import { ImageFormat } from '../types/image.types';
import { imageConfig } from '../config/image.config';

const logger = createLogger('ImageController');

/**
 * 验证文字转图片请求参数
 * @description 验证请求参数的完整性和有效性
 * @param requestBody - 请求体对象
 * @returns 验证结果，包含是否有效和错误消息列表
 *
 * @example
 * ```typescript
 * const result = validateTextToImageRequest({ text: 'Hello' });
 * if (!result.valid) {
 *   console.error(result.errors);
 * }
 * ```
 */
function validateTextToImageRequest(requestBody: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!requestBody || typeof requestBody !== 'object') {
    return { valid: false, errors: ['请求体不能为空'] };
  }

  const body = requestBody as Partial<TextToImageRequest>;

  const textValidation = validateText(body.text ?? '', { required: true });
  if (!textValidation.valid) {
    errors.push(...textValidation.errors);
  }

  if (body.width !== undefined) {
    const sizeValidation = validateImageSize(
      body.width,
      body.height || imageConfig.defaultSize.height
    );
    if (!sizeValidation.valid) {
      errors.push(...sizeValidation.errors);
    }
  }

  if (body.height !== undefined) {
    const sizeValidation = validateImageSize(
      body.width || imageConfig.defaultSize.width,
      body.height
    );
    if (!sizeValidation.valid) {
      errors.push(...sizeValidation.errors);
    }
  }

  if (body.format !== undefined && !isValidImageFormat(body.format)) {
    errors.push(`图片格式无效，支持的格式: png, jpeg, webp`);
  }

  if (body.fontSize !== undefined) {
    if (typeof body.fontSize !== 'number' || body.fontSize < 8 || body.fontSize > 200) {
      errors.push('字体大小必须在 8 到 200 之间');
    }
  }

  if (body.color !== undefined && !isValidColor(body.color)) {
    errors.push('文字颜色格式无效，请使用十六进制颜色值（如 #FFFFFF）');
  }

  if (body.backgroundColor !== undefined && !isValidColor(body.backgroundColor)) {
    errors.push('背景颜色格式无效，请使用十六进制颜色值（如 #1a1a2e）');
  }

  if (body.illustrationOpacity !== undefined && !isValidOpacity(body.illustrationOpacity)) {
    errors.push('插画透明度必须在 0 到 1 之间');
  }

  if (body.highlightKeywords !== undefined) {
    if (!Array.isArray(body.highlightKeywords)) {
      errors.push('高亮关键词必须是数组');
    } else {
      for (const keyword of body.highlightKeywords) {
        if (typeof keyword !== 'string' || keyword.trim().length === 0) {
          errors.push('高亮关键词必须是非空字符串');
          break;
        }
      }
    }
  }

  if (body.highlightColor !== undefined && !isValidColor(body.highlightColor)) {
    errors.push('高亮颜色格式无效，请使用十六进制颜色值（如 #FF6B6B）');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 构建图片生成选项
 * @description 将请求参数转换为图片生成选项
 * @param request - 请求参数对象
 * @returns 图片生成选项对象
 *
 * @example
 * ```typescript
 * const options = buildImageOptions({ text: 'Hello', width: 800 });
 * ```
 */
function buildImageOptions(request: TextToImageRequest): Partial<ImageGenerationOptions> {
  return {
    width: request.width ?? imageConfig.defaultSize.width,
    height: request.height ?? imageConfig.defaultSize.height,
    format: (request.format as ImageFormat) ?? imageConfig.defaultFormat,
    fontSize: request.fontSize ?? imageConfig.defaultFontSize,
    color: request.color ?? imageConfig.colors.text,
    backgroundColor: request.backgroundColor ?? imageConfig.colors.background,
    fontFile: request.fontFile ?? null,
    useIllustration: request.useIllustration ?? imageConfig.illustration.enabled,
    illustrationOpacity: request.illustrationOpacity ?? imageConfig.illustration.opacity,
    highlightKeywords: request.highlightKeywords ?? [],
    highlightColor: request.highlightColor ?? imageConfig.colors.highlight,
  };
}

/**
 * 发送错误响应
 * @description 统一处理错误响应的发送
 * @param response - Express 响应对象
 * @param statusCode - HTTP 状态码
 * @param error - 错误类型
 * @param message - 错误消息
 */
function sendErrorResponse(
  response: Response,
  statusCode: number,
  error: string,
  message: string
): void {
  const errorResponse: ErrorResponse = {
    success: false,
    error,
    message,
  };

  logger.error(`响应错误: ${statusCode} - ${error} - ${message}`);
  response.status(statusCode).json(errorResponse);
}

/**
 * 发送成功响应
 * @description 统一处理成功响应的发送
 * @param response - Express 响应对象
 * @param data - 响应数据
 */
function sendSuccessResponse(response: Response, data: ImageData): void {
  const successResponse: TextToImageResponse = {
    success: true,
    data,
  };

  logger.info(`图片生成成功: ${data.url}`);
  response.status(HTTP_STATUS.OK).json(successResponse);
}

/**
 * 文字转图片控制器
 * @description 处理 POST /api/text-to-image 请求，将文本转换为图片
 * @param request - Express 请求对象
 * @param response - Express 响应对象
 * @param next - Express 下一个中间件函数
 * @returns Promise<Response>
 *
 * @example
 * ```typescript
 * // 在路由中使用
 * router.post('/text-to-image', textToImageHandler);
 *
 * // 请求示例
 * // POST /api/text-to-image
 * // Body: { "text": "Hello World", "width": 800, "height": 600 }
 * ```
 */
export async function textToImageHandler(
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> {
  const startTime = Date.now();

  try {
    logger.info('收到文字转图片请求', {
      body: request.body,
      ip: request.ip,
      userAgent: request.get('user-agent'),
    });

    const validation = validateTextToImageRequest(request.body);

    if (!validation.valid) {
      logger.warn('参数验证失败', { errors: validation.errors });
      sendErrorResponse(
        response,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.INVALID_PARAM_FORMAT,
        validation.errors.join('; ')
      );
      return;
    }

    const requestBody = request.body as TextToImageRequest;

    if (!requestBody.text || requestBody.text.trim().length === 0) {
      sendErrorResponse(
        response,
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.MISSING_REQUIRED_PARAM,
        '文本内容不能为空'
      );
      return;
    }

    const imageOptions = buildImageOptions(requestBody);

    logger.debug('图片生成选项', imageOptions);

    const result = await createTextImage(requestBody.text, {
      width: imageOptions.width!,
      height: imageOptions.height!,
      format: imageOptions.format!,
      backgroundColor: imageOptions.backgroundColor!,
      fontSize: imageOptions.fontSize!,
      color: imageOptions.color!,
      fontFile: imageOptions.fontFile!,
      illustration: {
        enabled: imageOptions.useIllustration!,
        fileName: requestBody.illustrationFile ?? null,
        opacity: imageOptions.illustrationOpacity!,
      },
      highlight: {
        keywords: imageOptions.highlightKeywords!,
        color: imageOptions.highlightColor!,
      },
    });

    const serverAddress = getServerAddress();
    const imageUrl = `${serverAddress}${result.url}`;
    const relativeUrl = result.url;

    const responseData: ImageData = {
      url: imageUrl,
      relativeUrl,
      width: imageOptions.width!,
      height: imageOptions.height!,
      format: imageOptions.format!,
      fontUsed: result.fontUsed,
      fontName: result.fontName,
      illustrationUsed: result.illustrationUsed,
    };

    const processingTime = Date.now() - startTime;
    logger.info(`图片生成完成，耗时: ${processingTime}ms`, {
      url: responseData.url,
      fontUsed: responseData.fontUsed,
      illustrationUsed: responseData.illustrationUsed,
    });

    sendSuccessResponse(response, responseData);
  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error('图片生成失败', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      processingTime,
    });

    if (error instanceof Error) {
      if (error.message.includes('所有字体都尝试失败') || error.message.includes('尝试了')) {
        sendErrorResponse(
          response,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          ERROR_MESSAGES.ALL_FONTS_FAILED,
          error.message
        );
        return;
      }

      if (error.message.includes('参数验证失败')) {
        sendErrorResponse(
          response,
          HTTP_STATUS.BAD_REQUEST,
          ERROR_MESSAGES.INVALID_PARAM_FORMAT,
          error.message
        );
        return;
      }

      sendErrorResponse(
        response,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGES.IMAGE_GENERATION_FAILED,
        error.message
      );
      return;
    }

    sendErrorResponse(
      response,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      '图片生成过程中发生未知错误'
    );
  }
}

/**
 * 获取图片生成配置信息
 * @description 处理 GET /api/image-config 请求，返回当前图片生成的配置信息
 * @param request - Express 请求对象
 * @param response - Express 响应对象
 * @param next - Express 下一个中间件函数
 *
 * @example
 * ```typescript
 * // 在路由中使用
 * router.get('/image-config', getImageConfigHandler);
 * ```
 */
export function getImageConfigHandler(
  request: Request,
  response: Response,
  _next: NextFunction
): void {
  try {
    logger.info('收到获取图片配置请求');

    const configData = {
      defaultSize: imageConfig.defaultSize,
      defaultFormat: imageConfig.defaultFormat,
      defaultFontSize: imageConfig.defaultFontSize,
      colors: imageConfig.colors,
      illustration: {
        enabled: imageConfig.illustration.enabled,
        opacity: imageConfig.illustration.opacity,
      },
      supportedFormats: ['png', 'jpeg', 'webp'],
    };

    logger.debug('返回图片配置', configData);

    response.status(HTTP_STATUS.OK).json({
      success: true,
      data: configData,
      message: SUCCESS_MESSAGES.OK,
    });
  } catch (error) {
    logger.error('获取图片配置失败', error);

    sendErrorResponse(
      response,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      '获取图片配置失败'
    );
  }
}

/**
 * 健康检查控制器
 * @description 处理 GET /health 请求，返回服务健康状态
 * @param request - Express 请求对象
 * @param response - Express 响应对象
 * @param next - Express 下一个中间件函数
 *
 * @example
 * ```typescript
 * // 在路由中使用
 * router.get('/health', healthCheckHandler);
 * ```
 */
export function healthCheckHandler(
  request: Request,
  response: Response,
  _next: NextFunction
): void {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: process.memoryUsage().heapUsed,
      heapTotal: process.memoryUsage().heapTotal,
      rss: process.memoryUsage().rss,
    },
  };

  response.status(HTTP_STATUS.OK).json({
    success: true,
    data: healthData,
    message: '服务运行正常',
  });
}

/**
 * 图片控制器默认导出
 * @description 导出所有控制器处理函数
 */
export default {
  textToImageHandler,
  getImageConfigHandler,
  healthCheckHandler,
};
