/**
 * 配置模块统一导出
 * @description 集中导出所有配置模块，提供统一的配置访问入口
 */

export { ServerConfig, serverConfig, getServerAddress, getImageUrl } from './server.config';

export {
  ImageFormat,
  ImageConfig,
  ColorConfig,
  SizeConfig,
  IllustrationConfig,
  imageConfig,
  isValidImageFormat,
  normalizeImageFormat,
} from './image.config';

export {
  FontConfig,
  FontInfo,
  FontLoadOptions,
  FontDirectoryConfig,
  fontConfig,
  getFontExtension,
  isSupportedFontFile,
  getFontNameFromFileName,
  getFontFilePath,
} from './font.config';

import { serverConfig } from './server.config';
import { imageConfig } from './image.config';
import { fontConfig } from './font.config';

/**
 * 应用配置接口
 * @description 整合所有配置的统一接口
 */
export interface AppConfig {
  server: typeof serverConfig;
  image: typeof imageConfig;
  font: typeof fontConfig;
}

/**
 * 应用配置对象
 * @description 整合所有配置模块的统一配置对象
 */
export const config: AppConfig = {
  server: serverConfig,
  image: imageConfig,
  font: fontConfig,
};

export default config;
