# 文字转图片 API 服务 Spec

## Why

用户需要一个简单的文字转图片服务，通过传入文字内容、图片尺寸和格式，生成对应的图片并返回可访问的图片链接。该服务支持多种图片格式和字体渲染，将用于小红书文章发布等场景。

## What Changes

- 创建 Node.js Express 服务
- 使用 Jimp 库生成图片（纯 JavaScript 实现，无需额外二进制依赖）
- 提供 REST API 接口接收文字、尺寸、格式和字体参数
- 支持 PNG、JPEG、WEBP 等多种图片格式
- 支持多种字体渲染
- 生成的图片保存到本地并返回访问链接

## Impact

- Affected code: 新建服务端代码

## ADDED Requirements

### Requirement: 文字转图片 API

系统应提供文字转图片的 HTTP API 接口。

#### Scenario: 成功生成图片

- **WHEN** 用户发送 POST 请求到 `/api/text-to-image`，包含 text、width、height、format（可选）、font（可选）参数
- **THEN** 系统生成对应尺寸和格式的图片，包含指定文字
- **AND** 返回图片的访问链接

#### Scenario: 参数缺失

- **WHEN** 用户发送请求缺少必要参数（text）
- **THEN** 返回 400 错误，提示缺少的参数

#### Scenario: 使用默认参数

- **WHEN** 用户只提供 text 参数
- **THEN** 使用默认尺寸（800x600）、默认格式（png）、默认字体生成图片

### Requirement: 图片生成

系统应使用 Jimp 库生成图片。

#### Scenario: 生成图片

- **WHEN** 接收到有效的文字和尺寸参数
- **THEN** 使用 Jimp 创建指定尺寸的图片
- **AND** 将文字绘制到图片中心
- **AND** 支持文字自动换行

#### Scenario: 支持多种格式

- **WHEN** 用户指定 format 参数为 png、jpeg 或 webp
- **THEN** 生成对应格式的图片文件

### Requirement: 字体渲染

系统应支持多种字体渲染文字。

#### Scenario: 使用默认字体

- **WHEN** 用户未指定 font 参数
- **THEN** 使用系统默认字体渲染文字

#### Scenario: 使用自定义字体

- **WHEN** 用户指定 font 参数
- **THEN** 使用指定字体渲染文字（如果字体可用）

### Requirement: 图片存储和访问

系统应保存生成的图片并提供访问链接。

#### Scenario: 图片存储

- **WHEN** 图片生成成功
- **THEN** 保存到 `output/images/` 目录
- **AND** 文件名使用时间戳 + 随机字符串
- **AND** 返回 `/images/{filename}` 格式的访问链接
