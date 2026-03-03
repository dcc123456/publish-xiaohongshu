/**
 * 图片格式类型
 * @description 支持的图片输出格式
 */
export type ImageFormat = 'png' | 'jpeg' | 'jpg';

/**
 * 颜色配置接口
 * @description 定义图片生成中使用的颜色配置
 */
export interface ColorConfig {
  /** 默认文本颜色 */
  text: string;
  /** 默认背景颜色 */
  background: string;
  /** 关键词高亮颜色 */
  highlight: string;
}

/**
 * 尺寸配置接口
 * @description 定义图片的尺寸配置
 */
export interface SizeConfig {
  /** 图片宽度（像素） */
  width: number;
  /** 图片高度（像素） */
  height: number;
}

/**
 * 插画配置接口
 * @description 定义插画相关的配置选项
 */
export interface IllustrationConfig {
  /** 是否默认使用插画 */
  enabled: boolean;
  /** 插画透明度（0-1） */
  opacity: number;
  /** 插画目录路径 */
  directory: string;
  /** 支持的插画文件扩展名 */
  extensions: string[];
}

/**
 * 图片生成配置接口
 * @description 定义图片生成相关的所有配置选项
 */
export interface ImageConfig {
  /** 默认图片尺寸 */
  defaultSize: SizeConfig;
  /** 默认图片格式 */
  defaultFormat: ImageFormat;
  /** 默认字体大小（点） */
  defaultFontSize: number;
  /** 颜色配置 */
  colors: ColorConfig;
  /** 插画配置 */
  illustration: IllustrationConfig;
  /** 文本渲染配置 */
  text: {
    /** 文本区域边距 */
    padding: number;
    /** 行高倍数 */
    lineHeightMultiplier: number;
    /** 目文本覆盖率 */
    targetCoverage: number;
  };
  /** 字体重试配置 */
  fontRetry: {
    /** 最大重试次数 */
    maxAttempts: number;
    /** 最小字体大小 */
    minFontSize: number;
  };
}

/**
 * 默认图片生成配置
 * @description 图片生成功能的默认配置项
 */
export const imageConfig: ImageConfig = {
  defaultSize: {
    width: 800,
    height: 600,
  },
  defaultFormat: 'png',
  defaultFontSize: 32,
  colors: {
    text: '#FFFFFF',
    background: '#1a1a2e',
    highlight: '#FF6B6B',
  },
  illustration: {
    enabled: true,
    opacity: 0.15,
    directory: 'illustrations',
    extensions: ['.png', '.jpg', '.jpeg'],
  },
  text: {
    padding: 40,
    lineHeightMultiplier: 1.5,
    targetCoverage: 0.6,
  },
  fontRetry: {
    maxAttempts: 5,
    minFontSize: 12,
  },
};

/**
 * 验证图片格式是否有效
 * @param format - 要验证的格式字符串
 * @returns 是否为有效的图片格式
 */
export function isValidImageFormat(format: string): format is ImageFormat {
  return ['png', 'jpeg', 'jpg'].includes(format.toLowerCase());
}

/**
 * 获取标准化的图片格式
 * @param format - 原始格式字符串
 * @returns 标准化的图片格式
 */
export function normalizeImageFormat(format: string): ImageFormat {
  const normalized = format.toLowerCase();
  if (normalized === 'jpg') {
    return 'jpeg';
  }
  return isValidImageFormat(normalized) ? normalized : 'png';
}

export default imageConfig;
