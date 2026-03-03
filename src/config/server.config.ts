import * as path from 'path';

/**
 * 服务器配置接口
 * @description 定义服务器相关的配置选项
 */
export interface ServerConfig {
  /** 服务端口号 */
  port: number;
  /** 主机地址 */
  host: string;
  /** 静态文件目录配置 */
  static: {
    /** 图片输出目录路径 */
    imagesDir: string;
    /** 静态文件路由前缀 */
    imagesRoute: string;
  };
  /** 请求体配置 */
  bodyParser: {
    /** JSON 请求体大小限制 */
    jsonLimit: string;
    /** URL 编码请求体大小限制 */
    urlEncodedLimit: string;
  };
}

/**
 * 获取项目根目录的绝对路径
 * @description 返回项目根目录路径，用于解析相对路径
 * @returns 项目根目录的绝对路径
 */
function getProjectRoot(): string {
  return path.resolve(__dirname, '..', '..');
}

/**
 * 默认服务器配置
 * @description 服务器运行所需的默认配置项
 */
export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || 'localhost',
  static: {
    imagesDir: path.join(getProjectRoot(), 'output', 'images'),
    imagesRoute: '/images',
  },
  bodyParser: {
    jsonLimit: '10mb',
    urlEncodedLimit: '10mb',
  },
};

/**
 * 获取完整的服务器地址
 * @returns 格式化的服务器地址字符串
 */
export function getServerAddress(): string {
  return `http://${serverConfig.host}:${serverConfig.port}`;
}

/**
 * 获取图片静态文件的完整 URL
 * @param filename - 图片文件名
 * @returns 完整的图片 URL
 */
export function getImageUrl(filename: string): string {
  return `${getServerAddress()}${serverConfig.static.imagesRoute}/${filename}`;
}

export default serverConfig;
