# Tasks

- [x] Task 1: 初始化 Node.js 项目
  - [x] SubTask 1.1: 创建 package.json，配置项目信息
  - [x] SubTask 1.2: 安装依赖：express, jimp, cors
  - [x] SubTask 1.3: 创建基础目录结构（routes, utils, output/images）

- [x] Task 2: 创建 Express 服务基础框架
  - [x] SubTask 2.1: 创建 server.js 入口文件
  - [x] SubTask 2.2: 配置静态文件服务（/images 路由）
  - [x] SubTask 2.3: 配置 JSON body 解析和 CORS

- [x] Task 3: 实现文字转图片核心功能
  - [x] SubTask 3.1: 创建 imageGenerator.js 工具模块
  - [x] SubTask 3.2: 实现 createTextImage 函数（使用 Jimp）
  - [x] SubTask 3.3: 实现文字自动换行和居中绘制
  - [x] SubTask 3.4: 实现多种图片格式支持（PNG、JPEG、WEBP）
  - [x] SubTask 3.5: 实现字体选择和加载功能
  - [x] SubTask 3.6: 实现图片保存功能

- [x] Task 4: 创建 API 接口
  - [x] SubTask 4.1: 创建 POST /api/text-to-image 接口
  - [x] SubTask 4.2: 实现参数验证（text 必填，width/height/format/font 可选）
  - [x] SubTask 4.3: 设置默认参数值（width: 800, height: 600, format: png）
  - [x] SubTask 4.4: 调用图片生成功能并返回链接

- [x] Task 5: 测试验证
  - [x] SubTask 5.1: 启动服务测试
  - [x] SubTask 5.2: 使用 API 测试图片生成（不同格式）
  - [x] SubTask 5.3: 测试字体渲染功能

# Task Dependencies

- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 2, Task 3
- Task 5 depends on Task 4
