/**
 * @fileoverview 文本渲染工具
 * @description 提供文本测量、换行和绘制功能
 */

import { createLogger } from './logger';
import { ImageContext } from '../types/image.types';
import { imageConfig } from '../config/image.config';

const logger = createLogger('TextRenderer');

/**
 * 测量文本宽度
 * @description 测量文本的总宽度
 * @param ctx - 图片上下文
 * @param text - 文本内容
 * @returns 文本宽度（像素）
 *
 * @example
 * ```typescript
 * const width = measureTextWidth(ctx, 'Hello World');
 * ```
 */
export function measureTextWidth(ctx: ImageContext, text: string): number {
  let width = 0;
  for (const char of text) {
    const metrics = ctx.measureText(char);
    width += metrics.width;
  }
  return width;
}

/**
 * 文本换行
 * @description 将文本按最大宽度进行换行处理
 * @param ctx - 图片上下文
 * @param text - 文本内容
 * @param maxWidth - 最大宽度
 * @returns 文本行数组
 *
 * @example
 * ```typescript
 * const lines = wrapText(ctx, '长文本内容...', 760);
 * ```
 */
export function wrapText(ctx: ImageContext, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let currentLine = '';

  for (const char of text) {
    if (char === '\n') {
      if (currentLine !== '') {
        lines.push(currentLine);
        currentLine = '';
      }
      continue;
    }

    const testLine = currentLine + char;
    const testWidth = measureTextWidth(ctx, testLine);

    if (testWidth > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine !== '') {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * 绘制带高亮的文本
 * @description 绘制单行文本，支持关键词高亮
 * @param ctx - 图片上下文
 * @param line - 文本行
 * @param width - 图片宽度
 * @param y - Y 坐标
 * @param fontSize - 字体大小
 * @param fontName - 字体名称
 * @param defaultColor - 默认颜色
 * @param highlightKeywords - 高亮关键词
 * @param highlightColor - 高亮颜色
 *
 * @example
 * ```typescript
 * drawTextWithHighlights(ctx, '重要内容', 800, 100, 32, 'Arial', '#FFFFFF', ['重要'], '#FF6B6B');
 * ```
 */
export function drawTextWithHighlights(
  ctx: ImageContext,
  line: string,
  width: number,
  y: number,
  fontSize: number,
  fontName: string,
  defaultColor: string,
  highlightKeywords: string[],
  highlightColor: string
): void {
  ctx.font = `${fontSize}pt ${fontName}`;
  ctx.textBaseline = 'top';

  const lineWidth = measureTextWidth(ctx, line);
  let x = (width - lineWidth) / 2;

  for (const char of line) {
    const isHighlighted = highlightKeywords.some(
      keyword => keyword.includes(char) && line.includes(keyword)
    );

    ctx.fillStyle = isHighlighted ? highlightColor : defaultColor;
    ctx.fillText(char, x, y);

    const charWidth = measureTextWidth(ctx, char);
    x += charWidth;
  }
}

/**
 * 计算最佳字体大小
 * @description 根据文本内容和图片尺寸计算最佳字体大小
 * @param ctx - 图片上下文
 * @param text - 文本内容
 * @param width - 图片宽度
 * @param height - 图片高度
 * @param targetCoverage - 目标覆盖率
 * @param fontName - 字体名称
 * @returns 最佳字体大小
 *
 * @example
 * ```typescript
 * const fontSize = calculateOptimalFontSize(ctx, '文本', 800, 600, 0.6, 'Arial');
 * ```
 */
export function calculateOptimalFontSize(
  ctx: ImageContext,
  text: string,
  width: number,
  height: number,
  targetCoverage: number = 0.6,
  fontName: string = 'sans-serif'
): number {
  const imageArea = width * height;
  const targetArea = imageArea * targetCoverage;
  const charCount = text.length;

  if (charCount === 0) return 32;

  const minFontSize = imageConfig.fontRetry.minFontSize;
  const maxFontSize = Math.min(width, height) / 2;

  const estimatedFontSize = Math.sqrt(targetArea / (charCount * 1.8));
  let fontSize = Math.max(minFontSize, Math.min(maxFontSize, estimatedFontSize));

  const maxIterations = 20;
  let iteration = 0;
  let bestFontSize = fontSize;
  let bestDiff = Infinity;

  while (iteration < maxIterations) {
    ctx.font = `${fontSize}pt ${fontName}`;

    const maxWidth = width - imageConfig.text.padding;
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = fontSize * imageConfig.text.lineHeightMultiplier;
    const totalTextHeight = lines.length * lineHeight;

    let totalTextWidth = 0;
    lines.forEach(line => {
      const lineWidth = measureTextWidth(ctx, line);
      totalTextWidth = Math.max(totalTextWidth, lineWidth);
    });

    const textArea = totalTextWidth * totalTextHeight;
    const coverage = textArea / imageArea;
    const diff = Math.abs(coverage - targetCoverage);

    if (diff < bestDiff) {
      bestDiff = diff;
      bestFontSize = fontSize;
    }

    if (diff < 0.05) {
      break;
    }

    if (coverage < targetCoverage) {
      fontSize = fontSize * 1.1;
    } else {
      fontSize = fontSize * 0.9;
    }

    fontSize = Math.max(minFontSize, Math.min(maxFontSize, fontSize));
    iteration++;
  }

  logger.debug(`计算最佳字体大小: ${Math.round(bestFontSize)}pt`);
  return Math.round(bestFontSize);
}

/**
 * 绘制文本
 * @description 在画布上绘制文本，支持自动换行和居中
 * @param ctx - 图片上下文
 * @param text - 文本内容
 * @param width - 图片宽度
 * @param height - 图片高度
 * @param fontSize - 字体大小
 * @param fontName - 字体名称
 * @param color - 文本颜色
 * @param highlightKeywords - 高亮关键词
 * @param highlightColor - 高亮颜色
 *
 * @example
 * ```typescript
 * drawText(ctx, '文本内容', 800, 600, 32, 'Arial', '#FFFFFF', [], '#FF6B6B');
 * ```
 */
export function drawText(
  ctx: ImageContext,
  text: string,
  width: number,
  height: number,
  fontSize: number,
  fontName: string,
  color: string,
  highlightKeywords: string[],
  highlightColor: string
): void {
  ctx.font = `${fontSize}pt ${fontName}`;
  ctx.textBaseline = 'top';

  const maxWidth = width - imageConfig.text.padding;
  const lines = wrapText(ctx, text, maxWidth);

  logger.debug(`文本换行: ${lines.length} 行`);

  const lineHeight = fontSize * imageConfig.text.lineHeightMultiplier;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2;

  lines.forEach((line, index) => {
    const y = startY + index * lineHeight;
    drawTextWithHighlights(
      ctx,
      line,
      width,
      y,
      fontSize,
      fontName,
      color,
      highlightKeywords,
      highlightColor
    );
  });
}

export default {
  measureTextWidth,
  wrapText,
  drawTextWithHighlights,
  calculateOptimalFontSize,
  drawText,
};
