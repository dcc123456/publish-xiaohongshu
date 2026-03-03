/**
 * @fileoverview 字体相关类型定义
 * @description 定义字体信息、配置和缓存相关的类型
 */

/**
 * 字体信息接口
 * @description 单个字体的基本信息
 */
export interface FontInfo {
  /**
   * 字体文件名
   * @description 包含扩展名的字体文件名
   * @example "SourceHanSansCN-Bold.ttf"
   */
  fileName: string;

  /**
   * 字体名称
   * @description 字体的显示名称
   * @example "SourceHanSansCN-Bold"
   */
  fontName: string;

  /**
   * 字体文件路径
   * @description 字体文件的完整文件系统路径
   */
  filePath: string;
}

/**
 * 字体数据接口
 * @description 加载后的字体数据结构
 */
export interface FontData {
  /**
   * 字体对象
   * @description pureimage 库的字体对象
   */
  font: unknown;

  /**
   * 字体名称
   * @description 字体的显示名称
   */
  fontName: string;

  /**
   * 字体文件名
   * @description 包含扩展名的字体文件名
   */
  fileName: string;
}

/**
 * 字体配置接口
 * @description 字体相关的配置选项
 */
export interface FontConfig {
  /**
   * 字体目录路径
   * @description 存放字体文件的目录
   */
  fontsDir: string;

  /**
   * 支持的字体扩展名
   * @description 允许的字体文件格式
   * @default ['.ttf']
   */
  supportedExtensions?: string[];

  /**
   * 默认字体
   * @description 当没有可用字体时使用的后备字体
   */
  defaultFont?: string;
}

/**
 * 字体缓存条目接口
 * @description 字体缓存中存储的单个条目
 */
export interface FontCacheEntry {
  /**
   * 字体数据
   */
  fontData: FontData;

  /**
   * 缓存时间戳
   */
  timestamp: number;

  /**
   * 缓存键
   * @description 用于标识缓存条目的唯一键
   */
  cacheKey: string;
}

/**
 * 字体加载选项接口
 * @description 加载字体时的配置选项
 */
export interface FontLoadOptions {
  /**
   * 是否使用缓存
   * @description 是否从缓存中读取已加载的字体
   * @default true
   */
  useCache?: boolean;

  /**
   * 字体文件名
   * @description 要加载的字体文件名
   */
  fileName: string;
}

/**
 * 字体选择策略类型
 * @description 选择字体的策略方式
 */
export type FontSelectionStrategy = 'random' | 'sequential' | 'specified';

/**
 * 字体选择选项接口
 * @description 选择字体时的配置选项
 */
export interface FontSelectionOptions {
  /**
   * 选择策略
   * @default 'random'
   */
  strategy: FontSelectionStrategy;

  /**
   * 指定的字体文件名
   * @description 当 strategy 为 'specified' 时使用
   */
  specifiedFont?: string;

  /**
   * 排除的字体列表
   * @description 不选择的字体文件名列表
   */
  excludeFonts?: string[];
}

/**
 * 字体加载结果接口
 * @description 字体加载操作的结果
 */
export interface FontLoadResult {
  /**
   * 是否成功
   */
  success: boolean;

  /**
   * 字体数据
   * @description 成功时返回字体数据
   */
  data?: FontData;

  /**
   * 错误信息
   * @description 失败时返回错误信息
   */
  error?: string;
}
