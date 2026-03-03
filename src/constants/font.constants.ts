/**
 * @fileoverview 字体相关常量定义
 * @description 定义字体加载和使用过程中需要的所有常量，包括字体列表、路径和默认配置
 * @module constants/font
 */

/**
 * 字体目录名称
 * @description 字体文件存放的目录名
 */
export const FONTS_DIR_NAME = 'fonts';

/**
 * 支持的字体文件格式
 * @description 系统支持的字体文件扩展名
 */
export const SUPPORTED_FONT_FORMATS = ['.ttf', '.otf', '.woff', '.woff2'] as const;

/**
 * 主要支持的字体格式
 * @description 当前项目主要使用的字体格式
 */
export const PRIMARY_FONT_FORMAT = '.ttf';

/**
 * 默认字体名称
 * @description 当没有指定字体时使用的默认字体
 */
export const DEFAULT_FONT_NAME = 'sans-serif';

/**
 * 可用字体列表
 * @description 项目中可用的字体文件名列表
 */
export const AVAILABLE_FONTS = [
  'AlimamaFangYuanTiVF-Thin-2.ttf',
  'MaoKenShiJinHei-2.ttf',
  'MaoKenZhuYuanTi-MaokenZhuyuanTi-2.ttf',
  'PingFangLaiJiangHuFeiYangTi-2.ttf',
  'YeZiGongChangXiaoShiTou-2.ttf',
  'YunFengFeiYunTi-2.ttf',
  'YunFengJingLongXingShu-2.ttf',
  'ZiTiQuanWeiJunHei-W2-2.ttf',
  'chinese.ttf',
  'chinese111.ttf',
] as const;

/**
 * 字体类型定义
 */
export type AvailableFont = (typeof AVAILABLE_FONTS)[number];

/**
 * 字体显示名称映射
 * @description 字体文件名到显示名称的映射
 */
export const FONT_DISPLAY_NAMES: Record<string, string> = {
  'AlimamaFangYuanTiVF-Thin-2.ttf': '阿里妈妈方圆体',
  'MaoKenShiJinHei-2.ttf': '猫啃什锦黑',
  'MaoKenZhuYuanTi-MaokenZhuyuanTi-2.ttf': '猫啃珠圆体',
  'PingFangLaiJiangHuFeiYangTi-2.ttf': '平方来江湖飞扬体',
  'YeZiGongChangXiaoShiTou-2.ttf': '叶子工厂小石头',
  'YunFengFeiYunTi-2.ttf': '云峰飞云体',
  'YunFengJingLongXingShu-2.ttf': '云峰景龙行书',
  'ZiTiQuanWeiJunHei-W2-2.ttf': '字体圈伟俊黑',
  'chinese.ttf': '中文字体',
  'chinese111.ttf': '中文字体111',
} as const;

/**
 * 字体加载重试配置
 * @description 字体加载失败时的重试相关配置
 */
export const FONT_LOAD_MAX_RETRIES = 5;
export const FONT_LOAD_RETRY_DELAY_MS = 100;

/**
 * 字体缓存配置
 * @description 字体缓存相关配置
 */
export const FONT_CACHE_ENABLED = true;
export const FONT_CACHE_MAX_SIZE = 50;

/**
 * 字体大小配置
 * @description 字体大小的默认值和限制
 */
export const DEFAULT_FONT_SIZE_PT = 32;
export const MIN_FONT_SIZE_PT = 12;
export const MAX_FONT_SIZE_PT = 200;

/**
 * 字体样式常量
 * @description 字体样式相关的常量定义
 */
export const FONT_STYLES = {
  NORMAL: 'normal',
  ITALIC: 'italic',
  OBLIQUE: 'oblique',
} as const;

/**
 * 字体粗细常量
 * @description 字体粗细相关的常量定义
 */
export const FONT_WEIGHTS = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  NORMAL: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900,
} as const;

/**
 * 字体类型
 */
export type FontStyle = (typeof FONT_STYLES)[keyof typeof FONT_STYLES];
export type FontWeight = (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS];

/**
 * 文字基线对齐方式
 * @description Canvas 文字渲染时的基线对齐选项
 */
export const TEXT_BASELINES = {
  TOP: 'top',
  HANGING: 'hanging',
  MIDDLE: 'middle',
  ALPHABETIC: 'alphabetic',
  IDEOGRAPHIC: 'ideographic',
  BOTTOM: 'bottom',
} as const;

/**
 * 默认文字基线
 */
export const DEFAULT_TEXT_BASELINE = 'top';

/**
 * 文字对齐方式
 * @description Canvas 文字渲染时的对齐选项
 */
export const TEXT_ALIGNS = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  START: 'start',
  END: 'end',
} as const;

/**
 * 默认文字对齐
 */
export const DEFAULT_TEXT_ALIGN = 'center';

/**
 * 验证字体文件格式
 * @param filename 字体文件名
 * @returns 是否为支持的字体格式
 */
export function isValidFontFormat(filename: string): boolean {
  const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));
  return SUPPORTED_FONT_FORMATS.includes(ext as (typeof SUPPORTED_FONT_FORMATS)[number]);
}

/**
 * 获取字体显示名称
 * @param filename 字体文件名
 * @returns 字体的显示名称，如果未找到则返回文件名（不含扩展名）
 */
export function getFontDisplayName(filename: string): string {
  if (FONT_DISPLAY_NAMES[filename]) {
    return FONT_DISPLAY_NAMES[filename];
  }
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * 从字体文件名提取字体名称
 * @param filename 字体文件名
 * @returns 字体名称（不含扩展名）
 */
export function extractFontName(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}
