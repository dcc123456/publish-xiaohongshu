# 文字转图片 API 服务

一个基于 Node.js 和 PureImage 的文字转图片 API 服务，**完美支持中文**，无需额外二进制依赖。

## ✨ 功能特性

- ✅ 文字转图片生成
- ✅ **完美支持中文显示**（自动加载系统字体）
- ✅ 支持自定义尺寸（默认 800x600）
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

| 参数            | 类型   | 必填 | 默认值  | 说明                 |
| --------------- | ------ | ---- | ------- | -------------------- |
| text            | string | 是   | -       | 要渲染的文字内容     |
| width           | number | 否   | 800     | 图片宽度（像素）     |
| height          | number | 否   | 600     | 图片高度（像素）     |
| format          | string | 否   | png     | 图片格式（png/jpeg） |
| fontSize        | number | 否   | 32      | 字体大小             |
| color           | string | 否   | #000000 | 文字颜色（十六进制） |
| backgroundColor | string | 否   | #ffffff | 背景颜色（十六进制） |

**请求示例：**

```bash
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{
    "text": "这是一个测试文本",
    "width": 800,
    "height": 600,
    "format": "png"
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
    "format": "png"
  }
}
```

### 访问生成的图片

生成的图片可以通过以下 URL 访问：

```
http://localhost:3000/images/{filename}
```

例如：`http://localhost:3000/images/1772420546235_1vbd6.png`

## 🎨 中文字体支持

### 自动加载字体

服务会自动检测并加载系统中的中文字体：

- **Windows**: 黑体 (simhei.ttf)、宋体 (simsun.ttc) 等
- **macOS**: 苹方字体 (PingFang.ttc)
- **Linux**: Noto Sans CJK、Droid Sans Fallback

### 自定义字体

如果需要使用自定义字体，可以将字体文件（.ttf 格式）保存到 `fonts/chinese.ttf`。

## 📁 项目结构

```
.
├── server.js                 # 服务入口文件
├── routes/
│   └── textToImage.js       # API 路由
├── utils/
│   └── imageGenerator.js    # 图片生成核心功能
├── fonts/                    # 字体文件目录（可选）
│   └── chinese.ttf          # 自定义中文字体
├── output/
│   └── images/              # 生成的图片存储目录
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

## 🌟 快速测试

```bash
# 启动服务
npm run dev

# 测试中文
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"你好世界"}'

# 测试英文
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World"}'

# 测试 JPEG 格式
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json" \
  -d '{"text":"测试JPEG","format":"jpeg"}'
```

## 📝 License

ISC
