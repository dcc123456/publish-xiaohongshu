/**
 * @fileoverview 图片相关路由
 * @description 处理图片生成和字体管理相关的 API 路由
 */

import { Router, type Request, type Response } from 'express';
import {
  createTextImage,
  type CreateImageOptions,
  type ImageGenerationResult,
} from '../utils/imageGenerator';
import { getAvailableFonts } from '../utils/fontLoader';
import { imageConfig } from '../config/image.config';
import { batchTextToImageHandler, textToImageHandler } from '../controllers/imageController';
import type { TextToImageRequest } from '../types/request.types';
import type {
  TextToImageResponse,
  GetFontsResponse,
  ErrorResponse,
  ImageData,
} from '../types/response.types';
import type { ImageFormat } from '../types/image.types';

/**
 * 图片路由器
 * @description Express Router 实例，处理图片相关请求
 */
const router: Router = Router();

/**
 * 处理文字转图片请求
 * @description 将文本内容转换为图片
 * @param req - Express 请求对象
 * @param res - Express 响应对象
 * @returns Promise<void>
 */
async function handleTextToImage(
  req: Request<object, TextToImageResponse | ErrorResponse, TextToImageRequest>,
  res: Response<TextToImageResponse | ErrorResponse>
): Promise<void> {
  try {
    const {
      text,
      width,
      height,
      format,
      fontSize,
      color,
      backgroundColor,
      fontFile,
      useIllustration,
      illustrationFile,
      illustrationOpacity,
      highlightKeywords,
      highlightColor,
    } = req.body;

    if (!text) {
      res.status(400).json({
        success: false,
        error: '缺少必要参数',
        message: 'text 参数是必填的',
      });
      return;
    }

    const normalizedFormat: ImageFormat =
      format === 'jpg' ? 'jpeg' : ((format ?? imageConfig.defaultFormat) as ImageFormat);

    const options: Partial<CreateImageOptions> = {
      width: width ?? imageConfig.defaultSize.width,
      height: height ?? imageConfig.defaultSize.height,
      format: normalizedFormat,
      fontSize: fontSize ?? imageConfig.defaultFontSize,
      color: color ?? imageConfig.colors.text,
      backgroundColor: backgroundColor ?? imageConfig.colors.background,
      fontFile: fontFile ?? null,
      illustration: {
        enabled: useIllustration ?? imageConfig.illustration.enabled,
        opacity: illustrationOpacity ?? imageConfig.illustration.opacity,
        fileName: illustrationFile ?? null,
      },
      highlight: {
        keywords: highlightKeywords ?? [],
        color: highlightColor ?? imageConfig.colors.highlight,
      },
    };

    const result: ImageGenerationResult = await createTextImage(text, options);

    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}${result.url}`;

    const responseData: ImageData = {
      url: fullUrl,
      relativeUrl: result.url,
      width: options.width!,
      height: options.height!,
      format: options.format!,
      fontUsed: result.fontUsed,
      fontName: result.fontName,
      illustrationUsed: result.illustrationUsed,
    };

    res.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    res.status(500).json({
      success: false,
      error: '生成图片失败',
      message: errorMessage,
    });
  }
}

/**
 * 处理获取字体列表请求
 * @description 返回所有可用字体列表
 * @param _req - Express 请求对象（未使用）
 * @param res - Express 响应对象
 * @returns void
 */
function handleGetFonts(_req: Request, res: Response<GetFontsResponse | ErrorResponse>): void {
  try {
    const fonts = getAvailableFonts();
    const fontNames = fonts.map((f: { fileName: string }) => f.fileName);

    res.json({
      success: true,
      data: {
        fonts: fontNames,
        count: fontNames.length,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误';
    res.status(500).json({
      success: false,
      error: '获取字体列表失败',
      message: errorMessage,
    });
  }
}

/**
 * POST /api/text-to-image
 * @description 文字转图片接口（支持单个和批量）
 * @requestBody {TextToImageRequest} 文字转图片请求参数
 * @requestBody {BatchTextToImageRequest} 批量文字转图片请求参数数组
 * @response {TextToImageResponse} 成功响应，包含图片信息
 * @response {BatchTextToImageResponse} 批量成功响应，包含图片信息数组
 * @response {ErrorResponse} 失败响应，包含错误信息
 */
router.post('/text-to-image', textToImageHandler);

/**
 * POST /api/text-to-image/batch
 * @description 批量文字转图片接口
 * @requestBody {BatchTextToImageRequest} 批量文字转图片请求参数数组
 * @response {BatchTextToImageResponse} 成功响应，包含图片信息数组
 * @response {ErrorResponse} 失败响应，包含错误信息
 */
router.post('/text-to-image/batch', batchTextToImageHandler);

/**
 * GET /api/fonts
 * @description 获取可用字体列表
 * @response {GetFontsResponse} 成功响应，包含字体列表
 * @response {ErrorResponse} 失败响应，包含错误信息
 */
router.get('/fonts', handleGetFonts);

export { handleTextToImage, handleGetFonts };
export default router;
