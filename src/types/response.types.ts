/**
 * @fileoverview 响应数据类型定义
 * @description 定义所有 API 响应的数据结构和接口
 */

import type { ImageFormat } from './image.types';

/**
 * 基础响应接口
 * @description 所有 API 响应的基础结构
 */
export interface BaseResponse {
  /**
   * 请求是否成功
   */
  success: boolean;
}

/**
 * 文字转图片成功响应
 * @description /text-to-image 接口成功时的响应结构
 */
export interface TextToImageResponse extends BaseResponse {
  /**
   * 响应是否成功
   */
  success: true;

  /**
   * 响应数据
   */
  data: ImageData;
}

/**
 * 图片数据接口
 * @description 生成的图片详细信息
 */
export interface ImageData {
  /**
   * 完整的图片 URL
   * @description 包含协议和主机的完整访问地址
   * @example "http://localhost:3000/images/1234567890_abc123.png"
   */
  url: string;

  /**
   * 相对 URL 路径
   * @description 不包含协议和主机的相对路径
   * @example "/images/1234567890_abc123.png"
   */
  relativeUrl: string;

  /**
   * 图片宽度（像素）
   */
  width: number;

  /**
   * 图片高度（像素）
   */
  height: number;

  /**
   * 图片格式
   */
  format: ImageFormat;

  /**
   * 使用的字体文件名
   * @description 实际用于渲染的字体文件
   * @example "SourceHanSansCN-Bold.ttf"
   */
  fontUsed: string;

  /**
   * 字体名称
   * @description 字体的显示名称
   * @example "SourceHanSansCN-Bold"
   */
  fontName: string;

  /**
   * 使用的插画文件名
   * @description 如果使用了插画背景，返回插画文件名；否则为 null
   */
  illustrationUsed: string | null;
}

/**
 * 错误响应接口
 * @description API 请求失败时的响应结构
 */
export interface ErrorResponse extends BaseResponse {
  /**
   * 响应是否成功
   */
  success: false;

  /**
   * 错误类型或错误码
   * @example "缺少必要参数"
   */
  error: string;

  /**
   * 错误详细信息
   * @description 人类可读的错误描述
   */
  message: string;
}

/**
 * 获取字体列表成功响应
 * @description /fonts 接口成功时的响应结构
 */
export interface GetFontsResponse extends BaseResponse {
  /**
   * 响应是否成功
   */
  success: true;

  /**
   * 字体列表数据
   */
  data: {
    /**
     * 字体文件名列表
     */
    fonts: string[];

    /**
     * 字体总数
     */
    count: number;
  };
}

/**
 * 图片生成结果接口
 * @description createTextImage 函数的返回值类型
 */
export interface ImageGenerationResult {
  /**
   * 图片相对 URL
   */
  url: string;

  /**
   * 使用的字体文件名
   */
  fontUsed: string;

  /**
   * 字体名称
   */
  fontName: string;

  /**
   * 使用的插画文件名
   */
  illustrationUsed: string | null;
}

/**
 * 统一响应类型
 * @description 支持成功和失败两种情况的联合类型
 */
export type ApiResponse<T = ImageData> = { success: true; data: T } | ErrorResponse;

/**
 * 批量文字转图片成功响应
 * @description 批量生成图片成功时的响应结构
 */
export interface BatchTextToImageResponse extends BaseResponse {
  success: true;
  data: ImageData[];
}

/**
 * 批量操作结果项
 * @description 批量操作中单个项的结果
 */
export type BatchResultItem = 
  | { success: true; data: ImageData }
  | { success: false; error: string; message: string };

/**
 * 批量操作的部分成功响应
 * @description 批量操作部分成功时的响应结构
 */
export interface PartialBatchResponse extends BaseResponse {
  success: boolean;
  data: {
    successCount: number;
    failedCount: number;
    results: BatchResultItem[];
  };
}
