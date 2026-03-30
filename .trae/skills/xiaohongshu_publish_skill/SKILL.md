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
- 如果获取的信息中能拿到图片链接，则需要下载图片并保存到本地，后续发布将这些图片上传到小红书一起发布

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

**功能**：解决配图问题，确保图片符合内容主题

**字体风格说明**：

项目支持10种字体，每种字体适合不同的内容类型和风格：

| 字体文件                              | 字体名称          | 风格特点                                 | 适用场景                                                           | 风格标签                 |
| ------------------------------------- | ----------------- | ---------------------------------------- | ------------------------------------------------------------------ | ------------------------ |
| AlimamaFangYuanTiVF-Thin-2.ttf        | 阿里妈妈方圆体-细 | 笔画纤细、圆润柔和、现代感强             | 科技产品、时尚穿搭、简约生活方式、年轻化品牌                       | 简约、时尚、科技、现代   |
| chinese.ttf                           | 经典宋体          | 传统宋体、端庄典雅、阅读舒适             | 新闻资讯、政策解读、教育知识分享、正式商务内容、学术论文展示       | 传统、正式、权威、经典   |
| chinese111.ttf                        | 现代黑体          | 笔画粗壮、清晰易读、视觉冲击力强         | 热点新闻标题、重要信息发布、强调性内容、商业广告文案、活动宣传海报 | 现代、简约、力量、醒目   |
| MaoKenShiJinHei-2.ttf                 | 猫啃什锦黑        | 笔画粗重有力、力量感强、视觉醒目         | 运动健身、男性向内容、励志正能量、强调性标题、竞技赛事报道         | 硬朗、力量、冲击力、阳刚 |
| MaoKenZhuYuanTi-MaokenZhuyuanTi-2.ttf | 猫啃珠圆体        | 笔画圆润可爱、亲和力强、俏皮活泼         | 亲子育儿、美食甜点、可爱萌宠、少女心内容、手账记录                 | 可爱、活泼、亲切、少女   |
| PingFangLaiJiangHuFeiYangTi-2.ttf     | 平方来江湖飞扬体  | 笔画流畅飘逸、潇洒洒脱、艺术感强         | 旅行游记、文艺生活记录、个人随笔感悟、创意设计内容、艺术展览介绍   | 文艺、自由、个性、艺术   |
| YeZiGongChangXiaoShiTou-2.ttf         | 叶子工厂小石头体  | 笔画不规则、童趣十足、独特个性、手写感强 | 手账记录、儿童相关内容、创意手工、个性化表达、趣味教程             | 童趣、个性、手写、俏皮   |
| YunFengFeiYunTi-2.ttf                 | 云峰飞云体        | 笔画飞扬动感、气势磅礴、大气             | 运动赛事报道、激情励志内容、大气标题设计、活动宣传海报、舞蹈音乐类 | 动感、大气、有气势、激情 |
| YunFengJingLongXingShu-2.ttf          | 云峰惊龙行书      | 行书风格、流畅优雅、书法韵味、文化感强   | 传统文化、茶艺花艺、国风美学、文化艺术类、书法作品展示             | 传统、优雅、文化、书法   |
| ZiTiQuanWeiJunHei-W2-2.ttf            | 字体圈微君黑      | 笔画均匀、现代简约、专业感强、清晰易读   | 商务职场、专业知识分享、科技产品介绍、企业品牌宣传、工作汇报展示   | 专业、现代、简约、商务   |

**配色方案说明**：

根据小红书精美图文风格研究，推荐以下配色方案：

**1. 简约风格配色**（推荐用于新闻、干货类内容）：

- 背景色：`#F8F9FA`（浅灰）
- 文字色：`#2C3E50`（深灰蓝）
- 插画透明度：`0.08`
- 高亮色：`#E74C3C`（红色）
- 特点：视觉舒适、不刺眼、突出文字内容、专业感强

**2. 时尚风格配色**（推荐用于潮流、热点内容）：

- 背景色：`#2C3E50`（深灰蓝）
- 文字色：`#FFFFFF`（白色）
- 插画透明度：`0.12`
- 高亮色：`#F39C12`（金色）
- 特点：视觉冲击力强、现代感十足、吸引眼球

**3. 清新风格配色**（推荐用于生活方式、轻松话题）：

- 背景色：`#E8F6F3`（薄荷绿）
- 文字色：`#34495E`（深灰）
- 插画透明度：`0.10`
- 高亮色：`#16A085`（青绿）
- 特点：明亮干净、给人轻松愉悦感、治愈系

**4. 文艺风格配色**（推荐用于情感、文化内容）：

- 背景色：`#D5DBDB`（莫兰迪灰）
- 文字色：`#5D6D7E`（灰蓝）
- 插画透明度：`0.06`
- 高亮色：`#839192`（灰绿）
- 特点：低饱和度、有故事感、氛围感强、优雅精致

**5. 可爱风格配色**（推荐用于轻松、年轻内容）：

- 背景色：`#FF6B9D`（粉色）
- 文字色：`#FFFFFF`（白色）
- 插画透明度：`0.15`
- 高亮色：`#FFD93D`（黄色）
- 特点：色彩明亮、充满活力、软乎乎的视觉感受

**内容类型选择逻辑**：

根据不同的内容类型，自动选择合适的字体和配色方案：

```javascript
// 内容类型判断逻辑
function selectStyle(contentType) {
  const styleMap = {
    // 新闻资讯类
    news: {
      primaryFont: 'chinese.ttf',
      secondaryFont: 'chinese111.ttf',
      colorScheme: 'simple',
      description: '新闻资讯风格',
    },
    // 时尚生活类
    lifestyle: {
      primaryFont: 'AlimamaFangYuanTiVF-Thin-2.ttf',
      secondaryFont: 'PingFangLaiJiangHuFeiYangTi-2.ttf',
      colorScheme: 'fashion',
      description: '时尚生活风格',
    },
    // 可爱内容类
    cute: {
      primaryFont: 'MaoKenZhuYuanTi-MaokenZhuyuanTi-2.ttf',
      secondaryFont: 'YeZiGongChangXiaoShiTou-2.ttf',
      colorScheme: 'cute',
      description: '可爱内容风格',
    },
    // 文艺情感类
    artistic: {
      primaryFont: 'PingFangLaiJiangHuFeiYangTi-2.ttf',
      secondaryFont: 'YunFengJingLongXingShu-2.ttf',
      colorScheme: 'artistic',
      description: '文艺情感风格',
    },
    // 运动励志类
    sports: {
      primaryFont: 'MaoKenShiJinHei-2.ttf',
      secondaryFont: 'YunFengFeiYunTi-2.ttf',
      colorScheme: 'fashion',
      description: '运动励志风格',
    },
    // 商务专业类
    business: {
      primaryFont: 'ZiTiQuanWeiJunHei-W2-2.ttf',
      secondaryFont: 'chinese111.ttf',
      colorScheme: 'simple',
      description: '商务专业风格',
    },
    // 传统文化类
    culture: {
      primaryFont: 'YunFengJingLongXingShu-2.ttf',
      secondaryFont: 'chinese.ttf',
      colorScheme: 'artistic',
      description: '传统文化风格',
    },
  };

  return styleMap[contentType] || styleMap['news'];
}

// 配色方案定义
const colorSchemes = {
  simple: {
    backgroundColor: '#F8F9FA',
    textColor: '#2C3E50',
    highlightColor: '#E74C3C',
    illustrationOpacity: 0.08,
  },
  fashion: {
    backgroundColor: '#2C3E50',
    textColor: '#FFFFFF',
    highlightColor: '#F39C12',
    illustrationOpacity: 0.12,
  },
  fresh: {
    backgroundColor: '#E8F6F3',
    textColor: '#34495E',
    highlightColor: '#16A085',
    illustrationOpacity: 0.1,
  },
  artistic: {
    backgroundColor: '#D5DBDB',
    textColor: '#5D6D7E',
    highlightColor: '#839192',
    illustrationOpacity: 0.06,
  },
  cute: {
    backgroundColor: '#FF6B9D',
    textColor: '#FFFFFF',
    highlightColor: '#FFD93D',
    illustrationOpacity: 0.15,
  },
};
```

**风格选择建议**：

**1. 新闻资讯类内容**（推荐）：

- 首选字体：`chinese.ttf`（经典宋体）- 权威、正式、可信度高
- 次选字体：`chinese111.ttf`（现代黑体）- 清晰、醒目、现代感
- 第三选择：`ZiTiQuanWeiJunHei-W2-2.ttf`（微君黑）- 专业、简约、现代
- 推荐配色：简约风格配色（浅灰背景 + 深灰文字）

**2. 时尚生活类内容**：

- 首选字体：`AlimamaFangYuanTiVF-Thin-2.ttf`（方圆体-细）- 纤细、圆润、现代感
- 次选字体：`PingFangLaiJiangHuFeiYangTi-2.ttf`（飞扬体）- 流畅、飘逸、艺术感
- 推荐配色：时尚风格配色（深色背景 + 白色文字）

**3. 可爱内容类**：

- 首选字体：`MaoKenZhuYuanTi-MaokenZhuyuanTi-2.ttf`（珠圆体）- 圆润、可爱、亲和力强
- 次选字体：`YeZiGongChangXiaoShiTou-2.ttf`（小石头体）- 童趣、个性、手写感
- 推荐配色：可爱风格配色（粉色背景 + 白色文字）

**4. 文艺情感类内容**：

- 首选字体：`PingFangLaiJiangHuFeiYangTi-2.ttf`（飞扬体）- 流畅、飘逸、艺术感
- 次选字体：`YunFengJingLongXingShu-2.ttf`（龙行书）- 优雅、传统、文化感
- 推荐配色：文艺风格配色（莫兰迪灰背景）

**5. 运动励志类内容**：

- 首选字体：`MaoKenShiJinHei-2.ttf`（什锦黑）- 粗重、有力、冲击力
- 次选字体：`YunFengFeiYunTi-2.ttf`（飞云体）- 动感、大气、有气势
- 推荐配色：时尚风格配色（深色背景 + 白色文字）

**6. 商务专业类内容**：

- 首选字体：`ZiTiQuanWeiJunHei-W2-2.ttf`（微君黑）- 专业、简约、清晰
- 次选字体：`chinese111.ttf`（现代黑体）- 现代、醒目
- 推荐配色：简约风格配色（浅灰背景 + 深灰文字）

**7. 传统文化类内容**：

- 首选字体：`YunFengJingLongXingShu-2.ttf`（龙行书）- 优雅、传统、书法韵味
- 次选字体：`chinese.ttf`（经典宋体）- 正式、权威
- 推荐配色：文艺风格配色（莫兰迪灰背景）

**背景图处理**：

- 默认使用随机矢量插画作为背景，透明度根据配色方案调整
- 如果获取到的信息中包含图片链接或者获取信息时下载了图片，则使用该图片作为背景
- 如果有多张图片，则使用第一张图片作为背景；后续图片作为配图追加到图片列表中，不用作为背景图
- 如果一张图都没有获取到，则需要使用网络搜索去获取相关图片，作为背景图和配图

**图片尺寸**：800x600（默认），可根据需要调整

**核心特性**：

- ✅ **自适应字体大小**：文字自动充满图片60%以上面积
- ✅ **深色主题**：默认深色背景 + 白色文字，视觉效果更佳
- ✅ **关键词高亮**：支持指定关键词使用不同颜色
- ✅ **支持换行**：文本中使用 `\n` 即可换行
- ✅ **矢量插画背景**：随机选择精美插画作为背景（透明度根据配色方案调整）
- ✅ **完美中文支持**：自动加载系统中文字体

**API 端点**：`POST http://localhost:3000/api/text-to-image`

**请求参数**：

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

### 步骤 3.5：获取可用字体列表（可选）

**功能**：获取系统支持的所有字体列表

**API 端点**：`GET http://localhost:3000/api/fonts`

**示例**：

```bash
curl http://localhost:3000/api/fonts
```

**响应示例**：

```json
{
  "success": true,
  "data": {
    "fonts": ["chinese111.ttf", "SourceHanSansCN-Bold.ttf", "simhei.ttf", "simsun.ttc"],
    "count": 4
  }
}
```

**用途**：

- 查看系统支持的所有字体
- 在生成图片时指定 `fontFile` 参数使用特定字体
- 了解当前可用的中文字体资源

**使用特定字体生成图片**：

```bash
cat > custom_font.json << 'EOF'
{
  "text": "使用特定字体生成图片",
  "fontFile": "SourceHanSansCN-Bold.ttf",
  "width": 800,
  "height": 600
}
EOF

curl -X POST http://localhost:3000/api/text-to-image \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @custom_font.json
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

### 步骤 6：发送飞书通知

**功能**：发布成功后发送飞书消息通知

**前置条件**：

- 飞书应用配置文件 `feishu_config.json` 存在
- 飞书应用已开通必要权限

**操作流程**：

1. **获取飞书 access_token**

```bash
curl -s -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
  -H "Content-Type: application/json" \
  -d '{"app_id":"cli_a92d6db4aa38dcb0","app_secret":"D8dCTQyMIjvrXvvVeooUfbEbZH7mJ4GC"}'
```

2. **构建通知消息**

创建通知消息文件 `feishu_notify.json`：

```json
{
  "receive_id": "ou_7d63e9b818fc8c72290401fd021e4796",
  "msg_type": "text",
  "content": "{\"text\":\"🎉 小红书发布成功！\\n\\n📝 标题：{文章标题}\\n📅 时间：{发布时间}\\n🏷️ 标签：{标签列表}\\n🖼️ 图片：{图片数量}张\\n\\n✅ 状态：发布完成\"}"
}
```

3. **发送通知**

```bash
curl -s -X POST "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @feishu_notify.json
```

**通知内容模板**：

```
🎉 小红书发布成功！

📝 标题：{title}
📅 时间：{time}
🏷️ 标签：{tags}
🖼️ 图片：{imageCount}张

✅ 状态：发布完成
```

**详细说明**：参见 `feishu_notify_skill` 获取完整的飞书通知功能说明

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
