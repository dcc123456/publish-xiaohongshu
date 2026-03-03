/**
 * @fileoverview 请求参数类型定义
 * @description 定义所有 API 请求的参数接口和类型
 */

import type { ImageFormat } from './image.types';

/**
 * 图片格式输入类型（包含 jpg 别名）
 * @description 用户输入的图片格式，支持 jpg 作为 jpeg 的别名
 */
export type ImageFormatInput = ImageFormat | 'jpg';

/**
 * 文字转图片请求参数接口
 * @description 用于 /text-to-image 接口的请求参数定义
 */
export interface TextToImageRequest {
  /**
   * 要渲染的文本内容
   * @description 必填参数，将转换为图片的文字内容
   */
  text: string;

  /**
   * 图片宽度（像素）
   * @description 可选参数，默认值 800
   */
  width?: number;

  /**
   * 图片高度（像素）
   * @description 可选参数，默认值 600
   */
  height?: number;

  /**
   * 输出图片格式
   * @description 可选参数，支持 png、jpeg、jpg、webp，默认值 'png'。jpg 会被自动转换为 jpeg
   */
  format?: ImageFormatInput;

  /**
   * 字体大小（点）
   * @description 可选参数，默认值 32。实际渲染时会根据文本长度自动调整
   */
  fontSize?: number;

  /**
   * 文字颜色
   * @description 可选参数，十六进制颜色值，默认值 '#FFFFFF'
   */
  color?: string;

  /**
   * 背景颜色
   * @description 可选参数，十六进制颜色值，默认值 '#1a1a2e'
   */
  backgroundColor?: string;

  /**
   * 指定字体文件名
   * @description 可选参数，不指定则随机选择 fonts 目录下的字体
   */
  fontFile?: string | null;

  /**
   * 是否使用插画背景
   * @description 可选参数，默认值 true
   */
  useIllustration?: boolean;

  /**
   * 指定插画文件名
   * @description 可选参数，不指定则随机选择 illustrations 目录下的插画
   */
  illustrationFile?: string | null;

  /**
   * 插画透明度
   * @description 可选参数，范围 0-1，默认值 0.15
   */
  illustrationOpacity?: number;

  /**
   * 高亮关键词列表
   * @description 可选参数，需要高亮显示的关键词数组
   */
  highlightKeywords?: string[];

  /**
   * 高亮颜色
   * @description 可选参数，十六进制颜色值，默认值 '#FF6B6B'
   */
  highlightColor?: string;
}

/**
 * 图片生成选项接口
 * @description 内部使用的图片生成配置选项
 */
export interface ImageGenerationOptions {
  /**
   * 图片宽度
   */
  width: number;

  /**
   * 图片高度
   */
  height: number;

  /**
   * 输出格式
   */
  format: ImageFormat;

  /**
   * 字体大小
   */
  fontSize: number;

  /**
   * 文字颜色
   */
  color: string;

  /**
   * 背景颜色
   */
  backgroundColor: string;

  /**
   * 字体文件
   */
  fontFile: string | null;

  /**
   * 是否使用插画
   */
  useIllustration: boolean;

  /**
   * 插画透明度
   */
  illustrationOpacity: number;

  /**
   * 高亮关键词
   */
  highlightKeywords: string[];

  /**
   * 高亮颜色
   */
  highlightColor: string;
}

/**
 * 获取字体列表请求参数
 * @description 用于 /fonts 接口的请求参数
 */
export interface GetFontsRequest {
  /**
   * 是否包含字体详细信息
   * @description 可选参数，是否返回字体的详细信息（路径、大小等）
   */
  includeDetails?: boolean;
}
