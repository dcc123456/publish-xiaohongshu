import * as path from 'path';

/**
 * 字体文件信息接口
 * @description 描述单个字体文件的相关信息
 */
export interface FontInfo {
  /** 字体文件名（包含扩展名） */
  fileName: string;
  /** 字体名称（不含扩展名） */
  fontName: string;
  /** 字体文件完整路径 */
  filePath: string;
}

/**
 * 字体加载选项接口
 * @description 字体加载时的配置选项
 */
export interface FontLoadOptions {
  /** 是否启用缓存 */
  useCache: boolean;
  /** 加载超时时间（毫秒） */
  timeout: number;
}

/**
 * 字体目录配置接口
 * @description 字体目录相关的配置
 */
export interface FontDirectoryConfig {
  /** 字体目录路径 */
  path: string;
  /** 支持的字体文件扩展名 */
  extensions: string[];
}

/**
 * 字体配置接口
 * @description 定义字体相关的所有配置选项
 */
export interface FontConfig {
  /** 字体目录配置 */
  directory: FontDirectoryConfig;
  /** 默认字体列表（优先使用的字体） */
  defaultFonts: string[];
  /** 字体加载配置 */
  loadOptions: FontLoadOptions;
  /** 字体缓存配置 */
  cache: {
    /** 是否启用字体缓存 */
    enabled: boolean;
    /** 最大缓存数量 */
    maxSize: number;
  };
}

/**
 * 获取项目根目录
 * @returns 项目根目录路径
 */
function getProjectRoot(): string {
  return path.resolve(__dirname, '..', '..');
}

/**
 * 默认字体配置
 * @description 字体加载和管理的默认配置项
 */
export const fontConfig: FontConfig = {
  directory: {
    path: path.join(getProjectRoot(), 'fonts'),
    extensions: ['.ttf', '.otf', '.ttc'],
  },
  defaultFonts: [
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
  ],
  loadOptions: {
    useCache: true,
    timeout: 5000,
  },
  cache: {
    enabled: true,
    maxSize: 50,
  },
};

/**
 * 获取字体文件扩展名
 * @param fileName - 字体文件名
 * @returns 文件扩展名（小写）
 */
export function getFontExtension(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  return ext;
}

/**
 * 检查文件是否为支持的字体文件
 * @param fileName - 文件名
 * @returns 是否为支持的字体文件
 */
export function isSupportedFontFile(fileName: string): boolean {
  const ext = getFontExtension(fileName);
  return fontConfig.directory.extensions.includes(ext);
}

/**
 * 从文件名获取字体名称
 * @param fileName - 字体文件名
 * @returns 字体名称（不含扩展名）
 */
export function getFontNameFromFileName(fileName: string): string {
  return path.basename(fileName, path.extname(fileName));
}

/**
 * 获取字体文件的完整路径
 * @param fileName - 字体文件名
 * @returns 字体文件的完整路径
 */
export function getFontFilePath(fileName: string): string {
  return path.join(fontConfig.directory.path, fileName);
}

export default fontConfig;
