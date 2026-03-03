/**
 * @fileoverview 图片相关常量定义
 * @description 定义图片生成过程中使用的所有常量，包括格式、尺寸、颜色和质量等
 * @module constants/image
 */

/**
 * 支持的图片格式列表
 * @description 图片生成器支持的输出格式
 */
export const SUPPORTED_IMAGE_FORMATS = ['png', 'jpg', 'jpeg'] as const;

/**
 * 支持的图片格式类型
 */
export type SupportedImageFormat = (typeof SUPPORTED_IMAGE_FORMATS)[number];

/**
 * 默认图片尺寸配置
 * @description 图片生成的默认宽度和高度
 */
export const DEFAULT_IMAGE_WIDTH = 800;
export const DEFAULT_IMAGE_HEIGHT = 600;

/**
 * 图片尺寸限制
 * @description 图片宽高的最小和最大值限制
 */
export const MIN_IMAGE_WIDTH = 100;
export const MAX_IMAGE_WIDTH = 4096;
export const MIN_IMAGE_HEIGHT = 100;
export const MAX_IMAGE_HEIGHT = 4096;

/**
 * 默认颜色配置
 * @description 文字、背景和高亮颜色的默认值
 */
export const DEFAULT_TEXT_COLOR = '#FFFFFF';
export const DEFAULT_BACKGROUND_COLOR = '#1a1a2e';
export const DEFAULT_HIGHLIGHT_COLOR = '#FF6B6B';

/**
 * 预定义颜色列表
 * @description 可供选择的预设颜色
 */
export const PRESET_COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  DARK_BLUE: '#1a1a2e',
  CORAL_RED: '#FF6B6B',
  SOFT_PINK: '#FFB6C1',
  SKY_BLUE: '#87CEEB',
  LAVENDER: '#E6E6FA',
  MINT_GREEN: '#98FB98',
  GOLD: '#FFD700',
  ORANGE: '#FFA500',
} as const;

/**
 * 图片质量相关常量
 * @description JPEG 编码质量和 PNG 压缩相关配置
 */
export const DEFAULT_JPEG_QUALITY = 90;
export const MIN_JPEG_QUALITY = 1;
export const MAX_JPEG_QUALITY = 100;

/**
 * 插画相关常量
 * @description 背景插画透明度和位置配置
 */
export const DEFAULT_ILLUSTRATION_OPACITY = 0.15;
export const MIN_ILLUSTRATION_OPACITY = 0;
export const MAX_ILLUSTRATION_OPACITY = 1;

/**
 * 支持的插画文件格式
 * @description 插画支持的图片格式
 */
export const SUPPORTED_ILLUSTRATION_FORMATS = ['png', 'jpg', 'jpeg'] as const;

/**
 * 文字渲染相关常量
 * @description 文字排版和渲染配置
 */
export const DEFAULT_FONT_SIZE = 32;
export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 200;
export const LINE_HEIGHT_RATIO = 1.5;
export const TEXT_PADDING = 40;

/**
 * 字体大小计算相关常量
 * @description 自动计算最佳字体大小时的配置
 */
export const DEFAULT_TEXT_COVERAGE = 0.6;
export const FONT_SIZE_CALCULATION_ITERATIONS = 20;
export const FONT_SIZE_COVERAGE_TOLERANCE = 0.05;

/**
 * 图片输出目录名称
 * @description 生成的图片保存的目录名
 */
export const OUTPUT_DIR_NAME = 'output/images';

/**
 * 插画目录名称
 * @description 背景插画文件存放的目录名
 */
export const ILLUSTRATIONS_DIR_NAME = 'illustrations';

/**
 * 贴纸目录名称
 * @description 贴纸文件存放的目录名
 */
export const STICKERS_DIR_NAME = 'stickers';

/**
 * 图片文件名生成配置
 * @description 生成唯一文件名时使用的配置
 */
export const FILENAME_RANDOM_LENGTH = 7;

/**
 * 验证颜色格式
 * @param color 颜色字符串
 * @returns 是否为有效的十六进制颜色格式
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * 验证图片格式
 * @param format 图片格式字符串
 * @returns 是否为支持的图片格式
 */
export function isValidImageFormat(format: string): format is SupportedImageFormat {
  return SUPPORTED_IMAGE_FORMATS.includes(format as SupportedImageFormat);
}
