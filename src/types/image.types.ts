/**
 * @fileoverview 图片相关类型定义
 * @description 定义图片格式、选项和渲染相关的类型
 */

/**
 * 支持的图片格式类型
 * @description 文字转图片支持的输出格式
 */
export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'jpg';

/**
 * 图片尺寸接口
 * @description 图片的宽度和高度定义
 */
export interface ImageSize {
  /**
   * 图片宽度（像素）
   */
  width: number;

  /**
   * 图片高度（像素）
   */
  height: number;
}

/**
 * 图片选项接口
 * @description 图片生成时的配置选项
 */
export interface ImageOptions extends ImageSize {
  /**
   * 输出图片格式
   * @default 'png'
   */
  format: ImageFormat;

  /**
   * 背景颜色
   * @description 十六进制颜色值
   * @default '#1a1a2e'
   */
  backgroundColor: string;
}

/**
 * 文字渲染选项接口
 * @description 文字在图片中的渲染配置
 */
export interface TextOptions {
  /**
   * 字体大小（点）
   * @description 实际渲染时可能会根据文本长度自动调整
   * @default 32
   */
  fontSize: number;

  /**
   * 文字颜色
   * @description 十六进制颜色值
   * @default '#FFFFFF'
   */
  color: string;

  /**
   * 字体名称
   * @description 用于渲染的字体名称
   */
  fontName: string;

  /**
   * 行高倍数
   * @description 相对于字体大小的行高倍数
   * @default 1.5
   */
  lineHeight?: number;
}

/**
 * 高亮选项接口
 * @description 关键词高亮显示的配置
 */
export interface HighlightOptions {
  /**
   * 需要高亮的关键词列表
   * @description 匹配这些关键词的字符将使用高亮颜色显示
   */
  keywords: string[];

  /**
   * 高亮颜色
   * @description 十六进制颜色值
   * @default '#FF6B6B'
   */
  color: string;
}

/**
 * 插画选项接口
 * @description 背景插画的配置选项
 */
export interface IllustrationOptions {
  /**
   * 是否使用插画背景
   * @default true
   */
  enabled: boolean;

  /**
   * 指定的插画文件名
   * @description 不指定则随机选择
   */
  fileName?: string | null;

  /**
   * 插画透明度
   * @description 范围 0-1，值越小越透明
   * @default 0.15
   */
  opacity: number;
}

/**
 * 文本行信息接口
 * @description 文本换行后的单行信息
 */
export interface TextLine {
  /**
   * 行内容
   */
  content: string;

  /**
   * 行宽度（像素）
   */
  width: number;

  /**
   * 行 Y 坐标位置
   */
  y: number;
}

/**
 * 图片上下文接口
 * @description Canvas 2D 渲染上下文的类型定义（简化版）
 */
export interface ImageContext {
  /**
   * 填充样式
   */
  fillStyle: string;

  /**
   * 字体设置
   */
  font: string;

  /**
   * 文本基线
   */
  textBaseline: string;

  /**
   * 全局透明度
   */
  globalAlpha: number;

  /**
   * 绘制填充矩形
   */
  fillRect(x: number, y: number, width: number, height: number): void;

  /**
   * 绘制填充文本
   */
  fillText(text: string, x: number, y: number): void;

  /**
   * 绘制图片
   */
  drawImage(image: unknown, dx: number, dy: number, dWidth?: number, dHeight?: number): void;

  /**
   * 测量文本宽度
   */
  measureText(text: string): TextMetrics;
}

/**
 * 文本测量结果接口
 * @description 测量文本尺寸的结果
 */
export interface TextMetrics {
  /**
   * 文本宽度
   */
  width: number;
}
