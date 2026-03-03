/**
 * @fileoverview HTTP 相关常量定义
 * @description 定义 HTTP 请求和响应相关的所有常量，包括状态码、错误消息和成功消息
 * @module constants/http
 */

/**
 * HTTP 状态码常量
 * @description 常用的 HTTP 状态码定义
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

/**
 * HTTP 状态码类型
 */
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

/**
 * 成功响应消息
 * @description API 成功响应时使用的消息模板
 */
export const SUCCESS_MESSAGES = {
  OK: '请求成功',
  CREATED: '资源创建成功',
  ACCEPTED: '请求已接受',
  NO_CONTENT: '无内容',
  IMAGE_GENERATED: '图片生成成功',
  FONT_LIST_LOADED: '字体列表获取成功',
  OPERATION_COMPLETED: '操作完成',
} as const;

/**
 * 错误响应消息
 * @description API 错误响应时使用的消息模板
 */
export const ERROR_MESSAGES = {
  BAD_REQUEST: '请求参数错误',
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '禁止访问',
  NOT_FOUND: '资源不存在',
  METHOD_NOT_ALLOWED: '请求方法不允许',
  CONFLICT: '资源冲突',
  UNPROCESSABLE_ENTITY: '无法处理的实体',
  TOO_MANY_REQUESTS: '请求过于频繁',
  INTERNAL_SERVER_ERROR: '服务器内部错误',
  NOT_IMPLEMENTED: '功能未实现',
  BAD_GATEWAY: '网关错误',
  SERVICE_UNAVAILABLE: '服务不可用',
  GATEWAY_TIMEOUT: '网关超时',
  MISSING_REQUIRED_PARAM: '缺少必要参数',
  INVALID_PARAM_FORMAT: '参数格式无效',
  IMAGE_GENERATION_FAILED: '图片生成失败',
  FONT_LOAD_FAILED: '字体加载失败',
  FONT_NOT_FOUND: '字体文件不存在',
  ILLUSTRATION_LOAD_FAILED: '插画加载失败',
  FILE_NOT_FOUND: '文件不存在',
  DIRECTORY_NOT_FOUND: '目录不存在',
  ALL_FONTS_FAILED: '所有字体尝试失败',
} as const;

/**
 * Content-Type 常量
 * @description 常用的 Content-Type 定义
 */
export const CONTENT_TYPES = {
  JSON: 'application/json',
  HTML: 'text/html',
  TEXT: 'text/plain',
  XML: 'application/xml',
  FORM_DATA: 'multipart/form-data',
  FORM_URLENCODED: 'application/x-www-form-urlencoded',
  PNG: 'image/png',
  JPEG: 'image/jpeg',
  GIF: 'image/gif',
  SVG: 'image/svg+xml',
  OCTET_STREAM: 'application/octet-stream',
} as const;

/**
 * Content-Type 类型
 */
export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES];

/**
 * 字符编码常量
 * @description 常用的字符编码定义
 */
export const CHARSETS = {
  UTF8: 'utf-8',
  ASCII: 'ascii',
  LATIN1: 'latin1',
  BINARY: 'binary',
  BASE64: 'base64',
  HEX: 'hex',
} as const;

/**
 * 默认字符编码
 */
export const DEFAULT_CHARSET = 'utf-8';

/**
 * HTTP 请求方法常量
 * @description 支持的 HTTP 请求方法
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
} as const;

/**
 * HTTP 请求方法类型
 */
export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];

/**
 * API 路由常量
 * @description API 端点路径定义
 */
export const API_ROUTES = {
  BASE: '/api',
  TEXT_TO_IMAGE: '/api/text-to-image',
  FONTS: '/api/fonts',
  IMAGES: '/images',
  HEALTH: '/health',
  ROOT: '/',
} as const;

/**
 * 请求超时配置
 * @description HTTP 请求超时相关配置
 */
export const REQUEST_TIMEOUT_MS = 30000;
export const CONNECTION_TIMEOUT_MS = 5000;

/**
 * 响应头常量
 * @description 常用的响应头名称
 */
export const RESPONSE_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  CONTENT_LENGTH: 'Content-Length',
  CONTENT_DISPOSITION: 'Content-Disposition',
  CACHE_CONTROL: 'Cache-Control',
  ACCESS_CONTROL_ALLOW_ORIGIN: 'Access-Control-Allow-Origin',
  ACCESS_CONTROL_ALLOW_METHODS: 'Access-Control-Allow-Methods',
  ACCESS_CONTROL_ALLOW_HEADERS: 'Access-Control-Allow-Headers',
} as const;

/**
 * 默认服务器配置
 * @description 服务器默认配置
 */
export const DEFAULT_PORT = 3000;
export const DEFAULT_HOST = 'localhost';

/**
 * CORS 配置常量
 * @description 跨域资源共享相关配置
 */
export const CORS_DEFAULTS = {
  ORIGIN: '*',
  METHODS: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  CREDENTIALS: true,
  OPTIONS_SUCCESS_STATUS: 204,
} as const;

/**
 * 创建标准成功响应
 * @param data 响应数据
 * @param message 响应消息
 * @returns 标准格式的成功响应对象
 */
export function createSuccessResponse<T>(data: T, message: string = SUCCESS_MESSAGES.OK) {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * 创建标准错误响应
 * @param error 错误类型
 * @param message 错误消息
 * @returns 标准格式的错误响应对象
 */
export function createErrorResponse(error: string, message: string) {
  return {
    success: false,
    error,
    message,
  };
}

/**
 * 获取 HTTP 状态码对应的默认消息
 * @param statusCode HTTP 状态码
 * @returns 对应的默认消息
 */
export function getStatusMessage(statusCode: HttpStatusCode): string {
  const messageMap: Record<number, string> = {
    [HTTP_STATUS.OK]: SUCCESS_MESSAGES.OK,
    [HTTP_STATUS.CREATED]: SUCCESS_MESSAGES.CREATED,
    [HTTP_STATUS.ACCEPTED]: SUCCESS_MESSAGES.ACCEPTED,
    [HTTP_STATUS.NO_CONTENT]: SUCCESS_MESSAGES.NO_CONTENT,
    [HTTP_STATUS.BAD_REQUEST]: ERROR_MESSAGES.BAD_REQUEST,
    [HTTP_STATUS.UNAUTHORIZED]: ERROR_MESSAGES.UNAUTHORIZED,
    [HTTP_STATUS.FORBIDDEN]: ERROR_MESSAGES.FORBIDDEN,
    [HTTP_STATUS.NOT_FOUND]: ERROR_MESSAGES.NOT_FOUND,
    [HTTP_STATUS.METHOD_NOT_ALLOWED]: ERROR_MESSAGES.METHOD_NOT_ALLOWED,
    [HTTP_STATUS.CONFLICT]: ERROR_MESSAGES.CONFLICT,
    [HTTP_STATUS.UNPROCESSABLE_ENTITY]: ERROR_MESSAGES.UNPROCESSABLE_ENTITY,
    [HTTP_STATUS.TOO_MANY_REQUESTS]: ERROR_MESSAGES.TOO_MANY_REQUESTS,
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    [HTTP_STATUS.NOT_IMPLEMENTED]: ERROR_MESSAGES.NOT_IMPLEMENTED,
    [HTTP_STATUS.BAD_GATEWAY]: ERROR_MESSAGES.BAD_GATEWAY,
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: ERROR_MESSAGES.SERVICE_UNAVAILABLE,
    [HTTP_STATUS.GATEWAY_TIMEOUT]: ERROR_MESSAGES.GATEWAY_TIMEOUT,
  };
  return messageMap[statusCode] || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
}
