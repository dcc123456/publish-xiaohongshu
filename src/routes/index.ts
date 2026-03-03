/**
 * @fileoverview 路由汇总模块
 * @description 集中导出所有 API 路由，提供统一的路由访问入口
 */

import { Router, type Router as RouterType } from 'express';
import imageRoutes, { handleTextToImage, handleGetFonts } from './imageRoutes';

/**
 * 创建并配置应用路由器
 * @description 汇总所有子路由，创建统一的应用路由器
 * @returns 配置完成的 Express Router 实例
 *
 * @example
 * ```typescript
 * import { createAppRouter } from './routes';
 *
 * const app = express();
 * const router = createAppRouter();
 * app.use('/api', router);
 * ```
 */
function createAppRouter(): RouterType {
  const router = Router();

  router.use(imageRoutes);

  return router;
}

export { imageRoutes, handleTextToImage, handleGetFonts, createAppRouter };

export default createAppRouter;
