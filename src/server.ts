import http from 'http';
import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';

const PORT = config.server.port;
const HOST = config.server.host;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info('='.repeat(60));
  logger.info(`🚀 服务器启动成功！`);
  logger.info(`📡 服务地址: http://${HOST}:${PORT}`);
  logger.info(`🖼️  图片访问: http://${HOST}:${PORT}/images/`);
  logger.info(`📝 API 文档: http://${HOST}:${PORT}/api/`);
  logger.info('='.repeat(60));
});

server.on('error', (error: Error & { code?: string }) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`❌ 端口 ${PORT} 已被占用，请更换端口或关闭占用该端口的程序`);
  } else {
    logger.error('❌ 服务器启动失败:', error);
  }
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('收到 SIGTERM 信号，正在关闭服务器...');
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('收到 SIGINT 信号，正在关闭服务器...');
  server.close(() => {
    logger.info('服务器已关闭');
    process.exit(0);
  });
});

export { server };
