# 文字转图片 API 服务

一个基于 Node.js、TypeScript 和 PureImage 的文字转图片 API 服务，**完美支持中文**，无需额外二进制依赖。

## ✨ 功能特性

- ✅ 文字转图片生成
- ✅ **完美支持中文显示**（自动加载系统字体）
- ✅ **自适应字体大小**（文字自动充满图片60%以上面积）
- ✅ **深色主题**（默认深色背景 + 白色文字，视觉效果更佳）
- ✅ **关键词高亮**（支持指定关键词使用不同颜色）
- ✅ **矢量插画背景**（随机选择精美插画作为背景）
- ✅ **支持换行**（文本中使用 `\n` 即可换行）
- ✅ 支持自定义尺寸（默认 800x600）
- ✅ 支持多种图片格式（PNG、JPEG、WebP）
- ✅ 文字自动换行和居中绘制
- ✅ **TypeScript 重构**（完整的类型安全）
- ✅ **模块化设计**（单一职责原则）
- ✅ **代码质量保证**（ESLint + Prettier）

## 📦 安装

```bash
npm install
```

## 🚀 启动服务

### 开发模式

```bash
npm run dev
```

服务将在 `http://localhost:3000` 启动，支持热重载。

### 生产模式

```bash
npm run build
npm start
```

## 📖 API 使用说明

### POST /api/text-to-image

生成文字图片。

**请求参数：**

| 参数                | 类型    | 必填 | 默认值  | 说明                               |
| ------------------- | ------- | ---- | ------- | ---------------------------------- |
| text                | string  | 是   | -       | 要渲染的文字内容（支持 `\n` 换行） |
| width               | number  | 否   | 800     | 图片宽度（像素）                   |
| height              | number  | 否   | 600     | 图片高度（像素）                   |
| format              | string  | 否   | png     | 图片格式（png/jpeg/jpg/webp）      |
| fontSize            | number  | 否   | 32      | 字体大小（会被自适应算法调整）     |
| color               | string  | 否   | #FFFFFF | 文字颜色（十六进制）               |
| backgroundColor     | string  | 否   | #1a1a2e | 背景颜色（十六进制）               |
| useIllustration     | boolean | 否   | true    | 是否使用插画背景                   |
| illustrationFile    | string  | 否   | 随机    | 指定插画文件名                     |
| illustrationOpacity | number  | 否   | 0.15    | 插画透明度（0-1）                  |
| highlightKeywords   | array   | 否   | []      | 需要高亮的关键词数组               |
| highlightColor      | string  | 否   | #FF6B6B | 高亮颜色（十六进制）               |

**请求示例：**

```bash
# 基础用法（深色主题 + 插画背景）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "早安，新的一天开始了！",
    "width": 800,
    "height": 600
  }'

# 支持换行
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "OpenClaw爆火背后的真相\n从神器到争议的全解析",
    "width": 800,
    "height": 600
  }'

# 关键词高亮
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "普通人AI副业逆袭\n从月入2000到过万的真实路径",
    "highlightKeywords": ["AI副业", "逆袭", "过万"],
    "highlightColor": "#FF6B6B"
  }'

# 纯文字图片（不使用插画）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "这是一段测试文字",
    "width": 800,
    "height": 600,
    "useIllustration": false
  }'

# 自定义颜色
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "生日快乐！",
    "color": "#FFD700",
    "backgroundColor": "#2C3E50"
  }'
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "url": "/images/1772420546235_1vbd6.png",
    "width": 800,
    "height": 600,
    "format": "png",
    "fontUsed": "chinese111.ttf",
    "fontName": "chinese111",
    "illustrationUsed": "bg15.png"
  }
}
```

### 访问生成的图片

生成的图片可以通过以下 URL 访问：

```
http://localhost:3000/images/{filename}
```

例如：`http://localhost:3000/images/1772420546235_1vbd6.png`

### GET /api/fonts

获取所有可用字体列表。

**请求示例：**

```bash
curl http://localhost:3000/api/fonts
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "fonts": ["chinese111.ttf", "SourceHanSansCN-Bold.ttf", "simhei.ttf", "simsun.ttc"],
    "count": 4
  }
}
```

**用途：**

- 查看系统支持的所有字体
- 在文字转图片时指定 `fontFile` 参数使用特定字体
- 了解当前可用的中文字体资源

**使用特定字体示例：**

```bash
# 使用指定字体生成图片
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "使用特定字体",
    "fontFile": "SourceHanSansCN-Bold.ttf"
  }'
```

## 🎨 核心功能详解

### 1. 自适应字体大小

系统会根据文字数量和图片尺寸自动计算最佳字体大小，确保文字充满图片面积的 60% 以上。

**算法特点：**

- 基于文字面积占比的迭代优化
- 自动处理多行文本换行
- 动态调整确保最佳视觉效果

### 2. 深色主题

默认使用深色主题，视觉效果更佳：

- **背景色**：#1a1a2e（深蓝黑色）
- **文字色**：#FFFFFF（白色）
- **插画透明度**：0.15（柔和背景）

### 3. 关键词高亮

支持指定关键词使用不同颜色高亮显示：

```typescript
{
  "text": "普通人AI副业逆袭",
  "highlightKeywords": ["AI副业", "逆袭"],
  "highlightColor": "#FF6B6B"
}
```

### 4. 换行支持

文本中使用 `\n` 即可换行：

```typescript
{
  "text": "第一行内容\n第二行内容\n第三行内容"
}
```

### 5. 矢量插画背景

内置 19 张精美矢量插画，自动随机选择作为背景：

| 类型     | 文件                       | 说明               |
| -------- | -------------------------- | ------------------ |
| 背景插画 | bg1.png - bg15.png         | 各种风格的背景图案 |
| 角色插画 | character-bg.png           | 人物角色背景       |
| 浮动元素 | coffee-float.png 等        | 可爱的浮动装饰     |
| 场景插画 | perspective.png, path2.png | 场景背景           |

## 🎨 中文字体支持

### 自动加载字体

服务会自动检测并加载系统中的中文字体：

- **Windows**: 黑体 (simhei.ttf)、宋体 (simsun.ttc) 等
- **macOS**: 苹方字体 (PingFang.ttc)
- **Linux**: Noto Sans CJK、Droid Sans Fallback

### 自定义字体

如果需要使用自定义字体，可以将字体文件（.ttf 格式）保存到 `fonts/` 目录。

## 📁 项目结构

```
.
├── src/
│   ├── types/               # TypeScript 类型定义
│   │   ├── request.types.ts
│   │   ├── response.types.ts
│   │   ├── image.types.ts
│   │   └── font.types.ts
│   ├── config/              # 配置文件
│   │   ├── server.config.ts
│   │   ├── image.config.ts
│   │   └── font.config.ts
│   ├── constants/           # 常量定义
│   │   ├── image.constants.ts
│   │   ├── font.constants.ts
│   │   └── http.constants.ts
│   ├── utils/               # 工具函数
│   │   ├── imageGenerator.ts
│   │   ├── fontLoader.ts
│   │   ├── fileManager.ts
│   │   ├── logger.ts
│   │   ├── validator.ts
│   │   ├── textRenderer.ts
│   │   └── illustrationManager.ts
│   ├── services/            # 业务逻辑
│   │   ├── imageService.ts
│   │   └── fontService.ts
│   ├── controllers/         # 控制器
│   │   └── imageController.ts
│   ├── middlewares/         # 中间件
│   │   └── errorHandler.ts
│   ├── routes/              # 路由
│   │   └── imageRoutes.ts
│   ├── app.ts               # Express 应用配置
│   └── server.ts            # 服务器入口
├── fonts/                   # 字体文件目录
├── illustrations/           # 矢量插画目录（19张）
├── output/
│   └── images/              # 生成的图片存储目录
├── dist/                    # 编译输出目录
├── tsconfig.json            # TypeScript 配置
├── eslint.config.js         # ESLint 配置
├── .prettierrc              # Prettier 配置
├── package.json
└── README.md
```

## 🔧 技术栈

- **TypeScript** - 类型安全的 JavaScript 超集
- **Express.js** - Web 框架
- **PureImage** - 纯 JavaScript 图像处理库，完美支持中文
- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化

## 🛠️ 开发脚本

```bash
# 开发模式（热重载）
npm run dev

# 编译 TypeScript
npm run build

# 代码检查
npm run lint

# 自动修复代码问题
npm run lint:fix

# 代码格式化
npm run format
```

## 🆚 为什么选择 PureImage？

| 特性         | Jimp                    | PureImage                |
| ------------ | ----------------------- | ------------------------ |
| **中文支持** | ❌ 需要生成 BMFont 文件 | ✅ 直接支持 TTF 字体     |
| **字体格式** | 仅 BMFont (.fnt + .png) | TTF/OTF 字体文件         |
| **使用难度** | 复杂（需生成字体文件）  | 简单（自动加载系统字体） |
| **字符限制** | 只包含生成时的字符      | 支持所有 Unicode 字符    |
| **原生依赖** | 无                      | 无                       |

## 🌟 TypeScript 重构亮点

### 1. 完整的类型安全

所有函数都有完整的参数和返回值类型注解：

```typescript
export async function createTextImage(
  text: string,
  options: Partial<CreateImageOptions>
): Promise<ImageGenerationResult> {
  // ...
}
```

### 2. 模块化设计

遵循单一职责原则，每个文件只负责一个功能：

- **types/** - 类型定义
- **config/** - 配置管理
- **utils/** - 工具函数
- **services/** - 业务逻辑
- **controllers/** - 控制器
- **routes/** - 路由

### 3. 代码质量保证

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **TypeScript** - 类型检查

### 4. 详细的注释

所有方法都有完整的 JSDoc 注释：

```typescript
/**
 * 创建文字图片
 * @param text 要渲染的文字内容
 * @param options 图片生成选项
 * @returns 图片生成结果
 * @example
 * const result = await createTextImage('你好世界', { width: 800, height: 600 });
 */
```

## ⚠️ 注意事项

1. 生成的图片保存在 `output/images/` 目录下
2. 图片文件名格式：`{timestamp}_{random}.{format}`
3. PureImage 是纯 JavaScript 实现，无需安装额外的二进制依赖
4. 自动加载系统字体，开箱即用
5. 支持 PNG、JPEG 和 WebP 格式
6. 插画作为背景，不会遮挡文字
7. 文本中的 `\n` 会被识别为换行符
8. 关键词高亮功能可以让重要内容更突出
9. 所有文件代码行数不超过 500 行
10. 使用 TypeScript 确保类型安全

## 🌟 快速测试

```bash
# 启动服务
npm run dev

# 1. 获取可用字体列表
curl http://localhost:3000/api/fonts

# 2. 测试中文（深色主题 + 插画背景）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"你好世界"}'

# 3. 测试换行
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"第一行\n第二行\n第三行"}'

# 4. 测试关键词高亮
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"AI副业赚钱攻略","highlightKeywords":["AI副业","赚钱"]}'

# 5. 测试纯文字（无插画）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","useIllustration":false}'

# 6. 测试 JPEG 格式
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"测试JPEG","format":"jpeg"}'

# 7. 测试 WebP 格式
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"测试WebP","format":"webp"}'

# 8. 测试自定义颜色
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"自定义颜色","color":"#FFD700","backgroundColor":"#2C3E50"}'

# 9. 测试使用特定字体
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"使用特定字体","fontFile":"SourceHanSansCN-Bold.ttf"}'

# 10. 测试自定义插画
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"自定义插画背景","illustrationFile":"bg1.png","illustrationOpacity":0.2}'

# 11. 测试完整参数
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "完整参数测试\n多行文本支持",
    "width": 1000,
    "height": 800,
    "format": "png",
    "fontSize": 48,
    "color": "#FFFFFF",
    "backgroundColor": "#1a1a2e",
    "useIllustration": true,
    "illustrationOpacity": 0.15,
    "highlightKeywords": ["测试", "支持"],
    "highlightColor": "#FF6B6B"
  }'
```

## 📝 完整工作流示例

### 示例 1：生成小红书配图

```bash
# 1. 获取可用字体
curl http://localhost:3000/api/fonts

# 2. 生成小红书风格的配图
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "普通人AI副业逆袭\n从月入2000到过万的真实路径",
    "width": 800,
    "height": 600,
    "highlightKeywords": ["AI副业", "逆袭", "过万"],
    "highlightColor": "#FF6B6B"
  }'

# 3. 返回的图片 URL 可以直接使用
# 响应示例：
# {
#   "success": true,
#   "data": {
#     "url": "http://localhost:3000/images/xxx.png",
#     "relativeUrl": "/images/xxx.png",
#     "width": 800,
#     "height": 600,
#     "format": "png",
#     "fontUsed": "chinese111.ttf",
#     "fontName": "chinese111",
#     "illustrationUsed": "bg5.png"
#   }
# }
```

### 示例 2：批量生成不同尺寸的图片

```bash
# 生成横版图片（800x600）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"横版图片","width":800,"height":600}'

# 生成竖版图片（600x800）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"竖版图片","width":600,"height":800}'

# 生成正方形图片（800x800）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"正方形图片","width":800,"height":800}'
```

### 示例 3：错误处理

```bash
# 缺少必填参数（text）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{}'

# 响应：
# {
#   "success": false,
#   "error": "缺少必要参数",
#   "message": "text 参数是必填的"
# }

# 使用不存在的字体（会自动回退到默认字体）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"测试字体回退","fontFile":"not-exist.ttf"}'

# 系统会自动尝试其他可用字体
```

## 📝 License

ISC
