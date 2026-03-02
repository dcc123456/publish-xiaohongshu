---
name: xiaohongshu_publish_skill
description: 用来生成小红书文章以及调用小红书mcp来发布小红书文章的skill
---

# 小红书爆款文章生成与发布 Skill

## 概述

本 Skill 提供完整的小红书爆款文章生成与发布流程，包括政策信息获取、内容创作、图片生成、发布全流程。

## 核心功能

1. **政策信息获取**：实时搜索最新政策信息
2. **爆款文章创作**：基于小红书平台特性生成高互动内容
3. **图片生成**：解决配图问题，确保图片符合内容主题
4. **发布流程**：通过 MCP 服务发布到小红书

## 操作步骤

### 步骤 1：搜索最新政策信息

**功能**：获取实时政策信息，确保内容时效性

**操作**：

- 使用 Web 搜索工具搜索最新政策
- 获取当前本地日期
- 搜索关键词：`上海最新政策` + 当前日期
- 筛选权威来源，提取核心信息

**示例**：

```
WebSearch("上海公积金最新政策 2026年2月", 10, "lang_zh-CN")
```

### 步骤 2：生成爆款文章

**功能**：基于小红书平台特性创作高互动内容

**爆款公式**：`利他价值 + 视觉吸引 + 情绪共鸣`

**内容结构**：

1. **标题**：20字以内，包含数字/情绪词/关键词
2. **正文**：
   - 开头：痛点场景 + 解决方案
   - 核心内容：模块化呈现，使用符号系统
   - 结尾：行动号召 + 福利

**示例**：

```json
{
  "title": "上海公积金新政破防了！最高贷324万",
  "content": "🔥 2月26日刚落地！上海公积金贷款新政重磅来袭\n\n这是上海2026年力度最大的公积金政策调整，打工人买房直接省几十万！\n\n📌 核心变化一：贷款额度全面上调\n✅ 首套房：家庭最高可贷240万（含补充公积金）\n✅ 二套房：家庭最高可贷200万\n✅ 多子女家庭：额度上浮20%\n✅ 绿色建筑：额度上浮15%\n✅ 叠加计算：最高可贷324万！\n\n📌 核心变化二：套数认定放宽\n✅ 上海无房=首套（不管之前有没有贷款记录）\n✅ 贷款已结清不影响认定\n✅ 取消终身只能贷两次限制\n\n📌 核心变化三：首付比例降低\n✅ 首套最低20%\n✅ 二套普通区域25%\n✅ 临港/嘉定/青浦等区域二套也只要20%\n\n💡 谁最受益？\n1️⃣ 多子女家庭：额度直接上浮20%\n2️⃣ 刚需首套：首付压力大幅降低\n3️⃣ 买绿色建筑：双重叠加最高35%\n\n⚠️ 注意事项\n• 2月26日起执行\n• 需连续缴存6个月以上\n• 绿色建筑需开发商提供二星级认证\n\n算一笔账：贷款100万、20年期，公积金比商贷省利息超20万！\n\n赶紧转发给准备买房的家人朋友！",
  "tags": ["上海公积金", "买房攻略", "公积金贷款", "上海买房", "刚需买房"]
}
```

### 步骤 3：生成配图

**重要**：生成图片必须使用json文件形式，发布成功后json文件删除
**功能**：解决配图问题，确保图片符合内容主题

**图片尺寸**：800x600（默认），可根据需要调整

**核心特性**：

- ✅ **自适应字体大小**：文字自动充满图片60%以上面积
- ✅ **深色主题**：默认深色背景 + 白色文字，视觉效果更佳
- ✅ **关键词高亮**：支持指定关键词使用不同颜色
- ✅ **支持换行**：文本中使用 `\n` 即可换行
- ✅ **矢量插画背景**：随机选择精美插画作为背景（透明度15%）
- ✅ **完美中文支持**：自动加载系统中文字体

**API 端点**：`POST http://localhost:3000/api/text-to-image`

**请求参数**：

| 参数                | 类型    | 必填 | 默认值      | 说明                           |
| ------------------- | ------- | ---- | ----------- | ------------------------------ |
| text                | string  | 是   | -           | 要渲染的文字内容（支持 `\n` 换行） |
| width               | number  | 否   | 800         | 图片宽度（像素）               |
| height              | number  | 否   | 600         | 图片高度（像素）               |
| format              | string  | 否   | png         | 图片格式（png/jpeg）           |
| fontSize            | number  | 否   | 32          | 字体大小（会被自适应算法调整） |
| color               | string  | 否   | #FFFFFF     | 文字颜色（十六进制）           |
| backgroundColor     | string  | 否   | #1a1a2e     | 背景颜色（十六进制）           |
| useIllustration     | boolean | 否   | true        | 是否使用插画背景               |
| illustrationFile    | string  | 否   | 随机        | 指定插画文件名                 |
| illustrationOpacity | number  | 否   | 0.15        | 插画透明度（0-1）              |
| highlightKeywords   | array   | 否   | []          | 需要高亮的关键词数组           |
| highlightColor      | string  | 否   | #FF6B6B     | 高亮颜色（十六进制）           |

**示例**：

```bash
# 创建请求文件（基础用法）
cat > image_request.json << 'EOF'
{
  "text": "早安，新的一天开始了！",
  "width": 800,
  "height": 600
}
EOF

# 使用文件发送请求（深色主题 + 插画背景）
curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @image_request.json

# 支持换行
cat > newline_example.json << 'EOF'
{
  "text": "OpenClaw爆火背后的真相\n从神器到争议的全解析",
  "width": 800,
  "height": 600
}
EOF

curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @newline_example.json

# 关键词高亮
cat > highlight_example.json << 'EOF'
{
  "text": "普通人AI副业逆袭\n从月入2000到过万的真实路径",
  "highlightKeywords": ["AI副业", "逆袭", "过万"],
  "highlightColor": "#FF6B6B"
}
EOF

curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @highlight_example.json

# 纯文字图片（不使用插画）
cat > plain_text.json << 'EOF'
{
  "text": "这是一段测试文字",
  "width": 800,
  "height": 600,
  "useIllustration": false
}
EOF

curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @plain_text.json
```

**响应示例**：

```json
{
  "success": true,
  "data": {
    "url": "/images/1772440124615_ip9l5n.png",
    "width": 800,
    "height": 600,
    "format": "png",
    "fontUsed": "chinese111.ttf",
    "fontName": "chinese111",
    "illustrationUsed": "bg15.png"
  }
}
```

**访问图片**：

```
http://localhost:3000/images/1772440124615_ip9l5n.png
```

### 步骤 4：检查登录状态

**功能**：确保小红书 MCP 服务已登录

**操作**：

- 调用 API 检查登录状态
- 确认 `is_logged_in` 为 `true`

**示例**：

```bash
curl -s http://localhost:18060/api/v1/login/status
```

**响应**：

```json
{
  "success": true,
  "data": { "is_logged_in": true, "username": "xiaohongshu-mcp" },
  "message": "检查登录状态成功"
}
```

### 步骤 5：发布到小红书

**功能**：通过 MCP 服务发布文章

**操作**：

- 准备发布参数（标题、内容、图片、标签）
- 调用发布 API
- 处理发布结果

**示例**：

```bash
curl -s -X POST http://localhost:18060/api/v1/publish \
-H "Content-Type: application/json; charset=utf-8" \
-d @article.json
```

## 常见问题与解决方案

### 问题 1：图片生成失败

**症状**：图片链接无法访问或显示错误
**解决方案**：

- 检查文字转图片服务是否正常运行
- 确认字体文件已正确加载
- 查看服务日志排查错误

### 问题 2：发布超时

**症状**：发布请求长时间无响应
**解决方案**：

- 检查 MCP 服务状态
- 确保网络连接稳定
- 简化内容或图片大小

### 问题 3：登录状态异常

**症状**：登录状态检查失败
**解决方案**：

- 重新运行登录工具
- 检查 cookies 文件
- 重启 MCP 服务

### 问题 4：内容审核失败

**症状**：发布成功但内容未显示
**解决方案**：

- 检查内容是否包含违规词
- 调整标题和内容表述
- 避免过度营销词汇

## 优化建议

1. **内容优化**：
   - 使用 emoji 增强视觉效果
   - 保持段落短小，每段≤3行
   - 核心信息前置，符合黄金三秒法则

2. **图片优化**：
   - 默认使用插画背景，视觉效果更好
   - 可调整插画透明度（illustrationOpacity）控制背景深浅
   - 图片内容与标题相关

3. **发布策略**：
   - 选择合适的发布时间（高峰期）
   - 合理使用标签，提高曝光
   - 关注互动，及时回复评论

## 工具清单

| 工具       | 用途             | 示例                                                                  |
| ---------- | ---------------- | --------------------------------------------------------------------- |
| WebSearch  | 搜索政策信息     | `WebSearch("上海公积金最新政策 2026", 10)`                            |
| WebFetch   | 获取详细政策内容 | `WebFetch("政策链接")`                                                |
| RunCommand | 检查登录状态     | `curl http://localhost:18060/api/v1/login/status`                     |
| RunCommand | 生成图片         | `curl -X POST http://localhost:3000/api/text-to-image -d @image.json` |
| RunCommand | 发布文章         | `curl -X POST http://localhost:18060/api/v1/publish -d @article.json` |

## 发布检查清单

发布前请确认：

- [ ] 标题控制在20字以内
- [ ] 内容包含核心政策信息
- [ ] 图片链接有效且符合主题
- [ ] 标签相关且不超过5个
- [ ] 登录状态正常
- [ ] MCP 服务运行正常
- [ ] 文字转图片服务运行正常

## 实战案例

**案例**：发布上海公积金新政文章

**步骤**：

1. 搜索获取2026年2月26日最新政策
2. 生成包含核心信息的爆款文章
3. 调用文字转图片 API 生成配图（自动添加插画背景）
4. 检查登录状态
5. 发布到小红书

**成果**：

- 文章包含最新政策信息
- 图片自动添加精美插画背景
- 文字大小自适应，视觉效果好
- 成功发布到小红书平台

## 注意事项

1. **政策时效性**：确保使用最新政策信息
2. **内容合规**：避免违规词汇和虚假信息
3. **图片版权**：使用合法的图片源
4. **平台规则**：遵守小红书社区规范
5. **数据安全**：保护个人信息，避免泄露敏感数据
6. **服务依赖**：确保文字转图片服务（端口3000）和小红书MCP服务（端口18060）都在运行

---

**免责声明**：本 Skill 内容仅供参考，发布内容时请遵守相关法律法规和平台规则。
