/**
 * @fileoverview 图片生成核心工具
 * @description 提供图片创建、绘制、保存等功能
 */

import * as path from 'path';
import * as fs from 'fs';
import * as PImage from 'pureimage';
import { createLogger } from './logger';
import { ensureDirectoryExists, generateUniqueFilePath } from './fileManager';
import { loadFont, getRandomFont, getAvailableFonts } from './fontLoader';
import { getRandomIllustration, loadIllustration } from './illustrationManager';
import { calculateOptimalFontSize, drawText } from './textRenderer';
import { validateImageParams } from './validator';
import { FontData } from '../types/font.types';
import {
  ImageFormat,
  ImageOptions,
  HighlightOptions,
  IllustrationOptions,
  ImageContext,
} from '../types/image.types';
import { imageConfig } from '../config/image.config';

const logger = createLogger('ImageGenerator');

const OUTPUT_DIR = path.resolve(__dirname, '../../output/images');

ensureDirectoryExists(OUTPUT_DIR);

/**
 * 图片生成选项接口
 * @description 图片生成时的完整配置选项
 */
export interface CreateImageOptions extends ImageOptions {
  fontSize: number;
  color: string;
  fontFile?: string | null;
  illustration: IllustrationOptions;
  highlight: HighlightOptions;
}

/**
 * 图片生成结果接口
 * @description 图片生成操作的结果
 */
export interface ImageGenerationResult {
  url: string;
  filepath: string;
  fontUsed: string;
  fontName: string;
  illustrationUsed: string | null;
}

/**
 * 创建图片画布
 * @description 创建指定尺寸的图片画布
 * @param width - 图片宽度
 * @param height - 图片高度
 * @returns 图片对象和上下文
 *
 * @example
 * ```typescript
 * const { img, ctx } = createCanvas(800, 600);
 * ```
 */
export function createCanvas(
  width: number,
  height: number
): {
  img: PImage.Bitmap;
  ctx: ImageContext;
} {
  const img = PImage.make(width, height);
  const ctx = img.getContext('2d') as ImageContext;

  logger.debug(`创建画布: ${width}x${height}`);
  return { img, ctx };
}

/**
 * 绘制背景
 * @description 在画布上绘制背景颜色
 * @param ctx - 图片上下文
 * @param width - 图片宽度
 * @param height - 图片高度
 * @param backgroundColor - 背景颜色
 *
 * @example
 * ```typescript
 * drawBackground(ctx, 800, 600, '#1a1a2e');
 * ```
 */
export function drawBackground(
  ctx: ImageContext,
  width: number,
  height: number,
  backgroundColor: string
): void {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  logger.debug(`绘制背景: ${backgroundColor}`);
}

/**
 * 绘制插画
 * @description 在画布上绘制插画背景
 * @param ctx - 图片上下文
 * @param width - 图片宽度
 * @param height - 图片高度
 * @param illustration - 插画图片对象
 * @param opacity - 插画透明度
 *
 * @example
 * ```typescript
 * await drawIllustration(ctx, 800, 600, illustrationImg, 0.15);
 * ```
 */
export function drawIllustration(
  ctx: ImageContext,
  width: number,
  height: number,
  illustration: PImage.Bitmap,
  opacity: number
): void {
  const scaleX = width / illustration.width;
  const scaleY = height / illustration.height;
  const scale = Math.max(scaleX, scaleY);

  const scaledWidth = Math.floor(illustration.width * scale);
  const scaledHeight = Math.floor(illustration.height * scale);
  const x = (width - scaledWidth) / 2;
  const y = (height - scaledHeight) / 2;

  ctx.globalAlpha = opacity;
  ctx.drawImage(illustration, x, y, scaledWidth, scaledHeight);
  ctx.globalAlpha = 1.0;

  logger.debug(
    `绘制插画: 位置(${x}, ${y}), 尺寸(${scaledWidth}x${scaledHeight}), 透明度${opacity}`
  );
}

/**
 * 保存图片
 * @description 将图片保存到文件
 * @param img - 图片对象
 * @param filepath - 文件路径
 * @param format - 图片格式
 * @returns 是否成功保存
 *
 * @example
 * ```typescript
 * await saveImage(img, './output/image.png', 'png');
 * ```
 */
export async function saveImage(
  img: PImage.Bitmap,
  filepath: string,
  format: ImageFormat | 'jpg'
): Promise<boolean> {
  try {
    const dir = path.dirname(filepath);
    ensureDirectoryExists(dir);

    if (format === 'jpeg' || format === 'jpg') {
      await PImage.encodeJPEGToStream(img, fs.createWriteStream(filepath), 90);
    } else {
      await PImage.encodePNGToStream(img, fs.createWriteStream(filepath));
    }

    logger.info(`图片已保存: ${filepath}`);
    return true;
  } catch (error) {
    logger.error(`保存图片失败: ${filepath}`, error);
    return false;
  }
}

/**
 * 创建文本图片
 * @description 创建包含文本的图片
 * @param text - 文本内容
 * @param options - 图片选项
 * @returns 图片生成结果
 * @throws 当图片生成失败时抛出错误
 *
 * @example
 * ```typescript
 * const result = await createTextImage('Hello World', {
 *   width: 800,
 *   height: 600,
 *   format: 'png',
 *   fontSize: 32,
 *   color: '#FFFFFF',
 *   backgroundColor: '#1a1a2e'
 * });
 * ```
 */
export async function createTextImage(
  text: string,
  options: Partial<CreateImageOptions>
): Promise<ImageGenerationResult> {
  const {
    width = imageConfig.defaultSize.width,
    height = imageConfig.defaultSize.height,
    format = imageConfig.defaultFormat,
    fontSize = imageConfig.defaultFontSize,
    color = imageConfig.colors.text,
    backgroundColor = imageConfig.colors.background,
    fontFile = null,
    illustration = {
      enabled: imageConfig.illustration.enabled,
      opacity: imageConfig.illustration.opacity,
      fileName: null,
    },
    highlight = {
      keywords: [],
      color: imageConfig.colors.highlight,
    },
  } = options;

  logger.info('开始生成图片', { text, width, height, format, fontSize });

  const validation = validateImageParams({
    text,
    width,
    height,
    fontSize,
    backgroundColor,
    color,
    format,
    opacity: illustration.opacity,
    highlightKeywords: highlight.keywords,
  });

  if (!validation.valid) {
    throw new Error(`参数验证失败: ${validation.errors.join(', ')}`);
  }

  let selectedFontFile: string | null = fontFile || null;
  let fontData: FontData;
  let attempts = 0;
  const maxAttempts = imageConfig.fontRetry.maxAttempts;
  const triedFonts = new Set<string>();

  // 如果指定了字体文件，添加到已尝试集合
  if (selectedFontFile) {
    triedFonts.add(selectedFontFile);
  }

  while (attempts < maxAttempts) {
    try {
      if (!selectedFontFile) {
        const fontInfo = getRandomFont(Array.from(triedFonts));
        selectedFontFile = fontInfo.fileName;
      }

      logger.debug(`选择字体: ${selectedFontFile}`);
      if (!triedFonts.has(selectedFontFile)) {
        triedFonts.add(selectedFontFile);
      }

      fontData = await loadFont(selectedFontFile);

      const { img, ctx } = createCanvas(width, height);

      drawBackground(ctx, width, height, backgroundColor);

      if (illustration.enabled) {
        const illustrationFile = illustration.fileName || getRandomIllustration();
        if (illustrationFile) {
          const illustrationImg = await loadIllustration(illustrationFile);
          if (illustrationImg) {
            drawIllustration(ctx, width, height, illustrationImg, illustration.opacity);
          }
        }
      }

      const optimalFontSize = calculateOptimalFontSize(
        ctx,
        text,
        width,
        height,
        imageConfig.text.targetCoverage,
        fontData.fontName
      );

      drawText(
        ctx,
        text,
        width,
        height,
        optimalFontSize,
        fontData.fontName,
        color,
        highlight.keywords,
        highlight.color
      );

      const extension = format === 'jpeg' ? '.jpg' : `.${format}`;
      const filepath = generateUniqueFilePath(OUTPUT_DIR, extension);
      const filename = path.basename(filepath);

      await saveImage(img, filepath, format);

      return {
        url: `/images/${filename}`,
        filepath,
        fontUsed: selectedFontFile,
        fontName: fontData.fontName,
        illustrationUsed: illustration.enabled
          ? illustration.fileName || getRandomIllustration()
          : null,
      };
    } catch (error) {
      logger.error(`使用字体 ${selectedFontFile} 失败`, error);
      attempts++;

      if (attempts < maxAttempts) {
        const availableFonts = getAvailableFonts().filter(f => !triedFonts.has(f.fileName));

        if (availableFonts.length > 0) {
          selectedFontFile =
            availableFonts[Math.floor(Math.random() * availableFonts.length)].fileName;
          logger.info(`尝试下一个字体: ${selectedFontFile}`);
        } else {
          throw new Error('所有字体都尝试失败', { cause: error });
        }
      } else {
        throw new Error(`尝试了 ${maxAttempts} 个字体都失败`, { cause: error });
      }
    }
  }

  throw new Error('图片生成失败');
}

export default {
  createCanvas,
  drawBackground,
  drawIllustration,
  saveImage,
  createTextImage,
};
