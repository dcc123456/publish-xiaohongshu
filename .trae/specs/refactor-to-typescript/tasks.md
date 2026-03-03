# Tasks

- [x] Task 1: 配置 TypeScript 环境
  - [x] SubTask 1.1: 安装 TypeScript 相关依赖（typescript, @types/node, ts-node, nodemon）
  - [x] SubTask 1.2: 创建 tsconfig.json 配置文件，配置编译选项
  - [x] SubTask 1.3: 配置 ESLint 和 Prettier（@typescript-eslint/parser, @typescript-eslint/eslint-plugin, prettier, eslint-config-prettier）
  - [x] SubTask 1.4: 创建 .eslintrc.json 配置文件
  - [x] SubTask 1.5: 创建 .prettierrc 配置文件
  - [x] SubTask 1.6: 更新 package.json，添加 TypeScript 相关脚本（build, dev, lint, format）

- [x] Task 2: 规划并创建项目结构
  - [x] SubTask 2.1: 创建 src 目录
  - [x] SubTask 2.2: 创建 src/types 目录，用于存放类型定义
  - [x] SubTask 2.3: 创建 src/config 目录，用于存放配置文件
  - [x] SubTask 2.4: 创建 src/routes 目录，用于存放路由定义
  - [x] SubTask 2.5: 创建 src/controllers 目录，用于存放控制器
  - [x] SubTask 2.6: 创建 src/services 目录，用于存放业务逻辑
  - [x] SubTask 2.7: 创建 src/utils 目录，用于存放工具函数
  - [x] SubTask 2.8: 创建 src/middlewares 目录，用于存放中间件
  - [x] SubTask 2.9: 创建 src/constants 目录，用于存放常量定义

- [x] Task 3: 创建类型定义文件
  - [x] SubTask 3.1: 创建 src/types/index.ts，导出所有类型
  - [x] SubTask 3.2: 创建 src/types/request.types.ts，定义请求参数类型
  - [x] SubTask 3.3: 创建 src/types/response.types.ts，定义响应数据类型
  - [x] SubTask 3.4: 创建 src/types/image.types.ts，定义图片相关类型
  - [x] SubTask 3.5: 创建 src/types/font.types.ts，定义字体相关类型

- [x] Task 4: 重构配置文件
  - [x] SubTask 4.1: 创建 src/config/index.ts，统一导出配置
  - [x] SubTask 4.2: 创建 src/config/server.config.ts，服务器配置
  - [x] SubTask 4.3: 创建 src/config/image.config.ts，图片生成配置
  - [x] SubTask 4.4: 创建 src/config/font.config.ts，字体配置

- [x] Task 5: 重构常量定义
  - [x] SubTask 5.1: 创建 src/constants/index.ts，导出所有常量
  - [x] SubTask 5.2: 创建 src/constants/image.constants.ts，图片相关常量
  - [x] SubTask 5.3: 创建 src/constants/font.constants.ts，字体相关常量
  - [x] SubTask 5.4: 创建 src/constants/http.constants.ts，HTTP 相关常量

- [x] Task 6: 重构工具函数
  - [x] SubTask 6.1: 创建 src/utils/imageGenerator.ts，图片生成核心功能
  - [x] SubTask 6.2: 创建 src/utils/fontLoader.ts，字体加载功能
  - [x] SubTask 6.3: 创建 src/utils/fileManager.ts，文件管理功能
  - [x] SubTask 6.4: 创建 src/utils/logger.ts，日志工具
  - [x] SubTask 6.5: 创建 src/utils/validator.ts，参数验证工具

- [x] Task 7: 重构业务逻辑
  - [x] SubTask 7.1: 创建 src/services/imageService.ts，图片生成业务逻辑
  - [x] SubTask 7.2: 创建 src/services/fontService.ts，字体管理业务逻辑

- [x] Task 8: 重构控制器
  - [x] SubTask 8.1: 创建 src/controllers/imageController.ts，图片生成控制器

- [x] Task 9: 重构中间件
  - [x] SubTask 9.1: 创建 src/middlewares/errorHandler.ts，错误处理中间件
  - [x] SubTask 9.2: 创建 src/middlewares/validator.ts，参数验证中间件

- [x] Task 10: 重构路由
  - [x] SubTask 10.1: 创建 src/routes/index.ts，路由汇总
  - [x] SubTask 10.2: 创建 src/routes/imageRoutes.ts，图片相关路由

- [x] Task 11: 重构入口文件
  - [x] SubTask 11.1: 创建 src/app.ts，Express 应用配置
  - [x] SubTask 11.2: 创建 src/server.ts，服务器启动入口

- [x] Task 12: 迁移资源文件
  - [x] SubTask 12.1: 确认 fonts 目录位置
  - [x] SubTask 12.2: 确认 illustrations 目录位置
  - [x] SubTask 12.3: 确认 stickers 目录位置
  - [x] SubTask 12.4: 确认 output/images 目录位置

- [x] Task 13: 配置构建和开发脚本
  - [x] SubTask 13.1: 配置 build 脚本，编译 TypeScript 到 dist 目录
  - [x] SubTask 13.2: 配置 dev 脚本，使用 ts-node 和 nodemon 开发模式
  - [x] SubTask 13.3: 配置 lint 脚本，运行 ESLint 检查
  - [x] SubTask 13.4: 配置 format 脚本，运行 Prettier 格式化
  - [x] SubTask 13.5: 配置 lint:fix 脚本，自动修复 ESLint 问题

- [x] Task 14: 测试验证
  - [x] SubTask 14.1: 运行 TypeScript 编译，确保无类型错误
  - [x] SubTask 14.2: 运行 ESLint 检查，确保代码符合规范
  - [x] SubTask 14.3: 运行 Prettier 格式化，确保代码风格统一
  - [x] SubTask 14.4: 启动开发服务器，确保服务正常运行
  - [x] SubTask 14.5: 测试 API 接口，确保功能正常

# Task Dependencies

- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 2
- Task 5 depends on Task 2
- Task 6 depends on Task 3, Task 4, Task 5
- Task 7 depends on Task 6
- Task 8 depends on Task 7
- Task 9 depends on Task 3
- Task 10 depends on Task 8, Task 9
- Task 11 depends on Task 10
- Task 12 depends on Task 11
- Task 13 depends on Task 11
- Task 14 depends on Task 13
