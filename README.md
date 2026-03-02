# 文字转图片 API 服务

一个基于 Node.js 和 PureImage 的文字转图片 API 服务，**完美支持中文**，无需额外二进制依赖。

## ✨ 功能特性

- ✅ 文字转图片生成
- ✅ **完美支持中文显示**（自动加载系统字体）
- ✅ **自适应字体大小**（文字自动充满图片60%以上面积）
- ✅ **矢量插画背景**（随机选择精美插画作为背景）
- ✅ **卡通贴图装饰**（随机添加可爱贴图点缀）
- ✅ 支持自定义尺寸（默认 400x500）
- ✅ 支持多种图片格式（PNG、JPEG）
- ✅ 文字自动换行和居中绘制
- ✅ 纯 JavaScript 实现，无需额外二进制依赖
- ✅ 自动检测并加载系统中文字体

## 📦 安装

```bash
npm install
```

## 🚀 启动服务

```bash
npm run dev
```

服务将在 `http://localhost:3000` 启动。

## 📖 API 使用说明

### POST /api/text-to-image

生成文字图片。

**请求参数：**

| 参数                  | 类型    | 必填 | 默认值  | 说明                           |
| --------------------- | ------- | ---- | ------- | ------------------------------ |
| text                  | string  | 是   | -       | 要渲染的文字内容               |
| width                 | number  | 否   | 400     | 图片宽度（像素）               |
| height                | number  | 否   | 500     | 图片高度（像素）               |
| format                | string  | 否   | png     | 图片格式（png/jpeg）           |
| fontSize              | number  | 否   | 32      | 字体大小（会被自适应算法调整） |
| color                 | string  | 否   | #000000 | 文字颜色（十六进制）           |
| backgroundColor       | string  | 否   | #ffffff | 背景颜色（十六进制）           |
| useIllustration       | boolean | 否   | true    | 是否使用插画背景               |
| illustrationFile      | string  | 否   | 随机    | 指定插画文件名                 |
| illustrationOpacity   | number  | 否   | 0.3     | 插画透明度（0-1）              |
| addSticker            | boolean | 否   | true    | 是否添加贴图装饰               |
| stickerFile           | string  | 否   | 随机    | 指定贴图文件名                 |
| stickerScale          | number  | 否   | 0.15    | 贴图缩放比例                   |

**请求示例：**

```bash
# 基础用法（自动添加插画背景和贴图）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "早安，新的一天开始了！",
    "width": 400,
    "height": 500
  }'

# 纯文字图片（不使用插画和贴图）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "这是一段测试文字",
    "width": 800,
    "height": 600,
    "useIllustration": false,
    "addSticker": false
  }'

# 自定义插画透明度
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "生日快乐！",
    "illustrationOpacity": 0.2
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
    "illustrationUsed": "bg15.png",
    "stickerUsed": "heart_eyes.png"
  }
}
```

### 访问生成的图片

生成的图片可以通过以下 URL 访问：

```
http://localhost:3000/images/{filename}
```

例如：`http://localhost:3000/images/1772420546235_1vbd6.png`

## 🎨 核心功能详解

### 1. 自适应字体大小

系统会根据文字数量和图片尺寸自动计算最佳字体大小，确保文字充满图片面积的 60% 以上。

**算法特点：**
- 基于文字面积占比的迭代优化
- 自动处理多行文本换行
- 动态调整确保最佳视觉效果

### 2. 矢量插画背景

内置 19 张精美矢量插画，自动随机选择作为背景：

| 类型     | 文件                      | 说明               |
| -------- | ------------------------- | ------------------ |
| 背景插画 | bg1.png - bg15.png        | 各种风格的背景图案 |
| 角色插画 | character-bg.png          | 人物角色背景       |
| 浮动元素 | coffee-float.png 等       | 可爱的浮动装饰     |
| 场景插画 | perspective.png, path2.png | 场景背景           |

### 3. 卡通贴图装饰

内置 40 个可爱卡通贴图，随机添加到图片中：

| 类型   | 示例                           |
| ------ | ------------------------------ |
| 表情类 | heart_eyes, party, clap        |
| 动物类 | cat, dog, panda, koala         |
| 物品类 | star, sparkles, fire, rocket   |
| 自然类 | rainbow, sun, moon, cloud      |

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
├── server.js                 # 服务入口文件
├── routes/
│   └── textToImage.js        # API 路由
├── utils/
│   └── imageGenerator.js     # 图片生成核心功能
├── fonts/                    # 字体文件目录
├── illustrations/            # 矢量插画目录（19张）
├── stickers/                 # 卡通贴图目录（40个）
├── output/
│   └── images/               # 生成的图片存储目录
├── scripts/
│   ├── downloadStickers.js   # 贴图下载脚本
│   └── downloadIllustrations.js # 插画下载脚本
├── package.json
└── README.md
```

## 🔧 技术栈

- **Express.js** - Web 框架
- **PureImage** - 纯 JavaScript 图像处理库，完美支持中文
- **CORS** - 跨域支持

## 🆚 为什么选择 PureImage？

| 特性         | Jimp                    | PureImage                |
| ------------ | ----------------------- | ------------------------ |
| **中文支持** | ❌ 需要生成 BMFont 文件 | ✅ 直接支持 TTF 字体     |
| **字体格式** | 仅 BMFont (.fnt + .png) | TTF/OTF 字体文件         |
| **使用难度** | 复杂（需生成字体文件）  | 简单（自动加载系统字体） |
| **字符限制** | 只包含生成时的字符      | 支持所有 Unicode 字符    |
| **原生依赖** | 无                      | 无                       |

## ⚠️ 注意事项

1. 生成的图片保存在 `output/images/` 目录下
2. 图片文件名格式：`{timestamp}_{random}.{format}`
3. PureImage 是纯 JavaScript 实现，无需安装额外的二进制依赖
4. 自动加载系统字体，开箱即用
5. 支持 PNG 和 JPEG 格式
6. 插画和贴图作为背景，不会遮挡文字

## 🌟 快速测试

```bash
# 启动服务
npm run dev

# 测试中文（自动添加插画和贴图）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"你好世界"}'

# 测试纯文字
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","useIllustration":false,"addSticker":false}'

# 测试 JPEG 格式
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"测试JPEG","format":"jpeg"}'
```

## 📝 License

ISC
