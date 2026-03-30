# 热点信息获取 Skill

## 概述

本 Skill 提供全网热点趋势一站式聚合服务，支持 20+ 优质数据源，包括微博热搜、抖音热榜、知乎热榜、B站排行榜等。

## 核心功能

1. **多平台热点聚合**：支持微博、抖音、知乎、B站、豆瓣等 20+ 平台
2. **实时数据获取**：直接调用各平台 API，获取最新热点信息
3. **结构化数据返回**：统一的数据格式，便于后续处理

## 支持的热点源

| 工具名称 | 描述 | 参数 |
|---------|------|------|
| `get_weibo_trending` | 微博热搜榜 | 无 |
| `get_douyin_trending` | 抖音热搜榜单 | 无 |
| `get_zhihu_trending` | 知乎热榜 | `limit`: 数量，默认50 |
| `get_bilibili_rank` | B站视频排行榜 | `type`: 分区(0全站/1动画/3音乐/4游戏等) |
| `get_douban_rank` | 豆瓣实时热门 | `type`: subject/movie/tv |
| `get_toutiao_trending` | 今日头条热榜 | 无 |
| `get_36kr_trending` | 36氪热榜 | `type`: hot/video/comment/collect |
| `get_thepaper_trending` | 澎湃新闻热榜 | 无 |
| `get_netease_news_trending` | 网易新闻热点 | 无 |
| `get_tencent_news_trending` | 腾讯新闻热点 | `page_size`: 数量，默认20 |
| `get_sspai_rank` | 少数派热榜 | `tag`: 分类，`limit`: 数量 |
| `get_smzdm_rank` | 什么值得买热门 | `unit`: 1今日/7周/30月 |
| `get_ifanr_news` | 爱范儿科技快讯 | `limit`: 数量，`offset`: 偏移 |
| `get_juejin_article_rank` | 掘金文章榜 | `category_id`: 分类ID |
| `get_weread_rank` | 微信读书排行榜 | `category`: rising/hot_search/newbook等 |
| `get_gcores_new` | 机核网资讯 | 无 |
| `get_infoq_news` | InfoQ技术资讯 | `region`: cn/global |
| `get_bbc_news` | BBC新闻 | `category`: 分类，`edition`: 版本 |
| `get_nytimes_news` | 纽约时报新闻 | `region`: cn/global，`section`: 分类 |
| `get_theverge_news` | The Verge新闻 | 无 |
| `get_9to5mac_news` | 9to5Mac苹果新闻 | 无 |

## 操作步骤

### 步骤 1：选择热点源

根据需要选择合适的热点源，例如：
- 社交媒体热点：微博、抖音、知乎
- 视频内容：B站、抖音
- 新闻资讯：今日头条、澎湃新闻、网易新闻
- 科技资讯：36氪、少数派、爱范儿
- 影视娱乐：豆瓣

### 步骤 2：调用热点 API

使用 RunCommand 工具调用对应的 API。

#### 微博热搜

```bash
curl -s 'https://weibo.com/ajax/side/hotSearch' \
  -H 'Referer: https://weibo.com/' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
```

**返回字段**：
- `title`: 热搜标题
- `description`: 热搜描述
- `popularity`: 热度值
- `link`: 链接

#### 抖音热搜

```bash
# 先获取 csrf token
curl -s 'https://www.douyin.com/passport/general/login_guiding_strategy/?aid=6383' -c cookies.txt

# 再获取热搜列表
curl -s 'https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1' \
  -H 'Cookie: passport_csrf_token=YOUR_TOKEN'
```

**返回字段**：
- `title`: 热搜标题
- `eventTime`: 事件时间
- `cover`: 封面图
- `popularity`: 热度值
- `link`: 链接

#### 知乎热榜

```bash
curl -s 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50' \
  -H 'User-Agent: osee2unifiedRelease/22916 osee2unifiedReleaseVersion/10.49.0 Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
```

**返回字段**：
- `title`: 标题
- `description`: 摘要
- `cover`: 封面图
- `popularity`: 热度描述
- `link`: 链接

#### B站排行榜

```bash
curl -s 'https://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all' \
  -H 'Referer: https://www.bilibili.com/ranking/all' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
```

**返回字段**：
- `title`: 视频标题
- `description`: 视频简介
- `cover`: 封面图
- `author`: 作者
- `view`: 播放量
- `link`: 链接

#### 今日头条热榜

```bash
curl -s 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc'
```

**返回字段**：
- `title`: 标题
- `cover`: 封面图
- `popularity`: 热度值
- `link`: 链接

#### 豆瓣热门

```bash
curl -s 'https://m.douban.com/rexxar/api/v2/subject_collection/subject_real_time_hotest/items?type=subject&start=0&count=10&for_mobile=1' \
  -H 'Referer: https://m.douban.com/subject_collection/movie_real_time_hotest'
```

**返回字段**：
- `title`: 标题
- `type_name`: 类型
- `cover`: 封面图
- `rating_value`: 评分
- `popularity`: 热度
- `link`: 链接

#### 36氪热榜

```bash
curl -s -X POST 'https://gateway.36kr.com/api/mis/nav/home/nav/rank/hot' \
  -H 'Content-Type: application/json; charset=utf-8' \
  -d '{"partner_id":"wap","param":{"siteId":1,"platformId":2},"timestamp":'$(date +%s)000'}'
```

**返回字段**：
- `title`: 标题
- `cover`: 封面图
- `author`: 作者
- `read_count`: 阅读数
- `link`: 链接

#### 澎湃新闻热榜

```bash
curl -s 'https://cache.thepaper.cn/contentapi/wwwIndex/rightSidebar'
```

**返回字段**：
- `title`: 标题
- `cover`: 封面图
- `popularity`: 点赞数
- `publish_time`: 发布时间
- `link`: 链接

#### 网易新闻热点

```bash
curl -s 'https://m.163.com/fe/api/hot/news/flow'
```

**返回字段**：
- `title`: 标题
- `cover`: 封面图
- `source`: 来源
- `publish_time`: 发布时间
- `link`: 链接

#### 少数派热榜

```bash
curl -s 'https://sspai.com/api/v1/article/tag/page/get?tag=热门文章&limit=40'
```

**返回字段**：
- `title`: 标题
- `summary`: 摘要
- `author`: 作者
- `view_count`: 阅读数
- `like_count`: 点赞数
- `link`: 链接

### 步骤 3：解析返回数据

各平台返回的数据格式不同，需要根据平台特性解析：

**通用解析脚本**（保存为 `parse_trends.js`）：

```javascript
const https = require('https');
const http = require('http');

// 微博热搜解析
async function parseWeiboTrending(data) {
  if (data.ok !== 1 || !Array.isArray(data.data?.realtime)) {
    throw new Error('获取微博热搜榜失败');
  }
  return data.data.realtime
    .filter(item => item.is_ad !== 1)
    .map(item => ({
      title: item.word,
      description: item.note || item.word_scheme || `#${item.word}`,
      popularity: item.num,
      link: `https://s.weibo.com/weibo?q=${encodeURIComponent(item.word_scheme || item.word)}`
    }));
}

// 知乎热榜解析
async function parseZhihuTrending(data) {
  if (!Array.isArray(data.data)) {
    throw new Error('获取知乎热榜失败');
  }
  return data.data.map(item => {
    const target = item.target;
    const id = target?.url?.split('/').pop();
    return {
      title: target.title,
      description: target.excerpt,
      cover: item.children?.[0]?.thumbnail,
      popularity: item.detail_text,
      link: id ? `https://www.zhihu.com/question/${id}` : null
    };
  });
}

// 今日头条解析
async function parseToutiaoTrending(data) {
  if (!Array.isArray(data.data)) {
    throw new Error('获取今日头条热榜失败');
  }
  return data.data.map(item => ({
    title: item.Title,
    cover: item.Image?.url,
    popularity: item.HotValue,
    link: item.Url
  }));
}

// 导出解析函数
module.exports = {
  parseWeiboTrending,
  parseZhihuTrending,
  parseToutiaoTrending
};
```

## 使用示例

### 示例 1：获取微博热搜并生成小红书文章

```bash
# 1. 获取微博热搜
curl -s 'https://weibo.com/ajax/side/hotSearch' \
  -H 'Referer: https://weibo.com/' \
  -H 'User-Agent: Mozilla/5.0' > weibo_trending.json

# 2. 选择合适的热点话题
# 3. 使用 xiaohongshu_publish_skill 生成文章
# 4. 发布到小红书
```

### 示例 2：获取多平台热点对比

```bash
# 同时获取多个平台热点
curl -s 'https://weibo.com/ajax/side/hotSearch' -H 'Referer: https://weibo.com/' > weibo.json &
curl -s 'https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc' > toutiao.json &
curl -s 'https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=20' > zhihu.json &
wait

# 分析热点趋势
```

## 数据格式说明

### 统一返回格式

所有热点数据都会被标准化为以下格式：

| 字段 | 类型 | 说明 |
|------|------|------|
| title | string | 标题 |
| description | string | 描述/摘要 |
| cover | string | 封面图URL（可选） |
| popularity | number/string | 热度值/热度描述 |
| publish_time | string | 发布时间（可选） |
| author | string | 作者（可选） |
| link | string | 原文链接 |

## 注意事项

1. **请求频率**：避免过于频繁的请求，建议间隔 1-2 秒
2. **User-Agent**：部分平台需要设置正确的 User-Agent
3. **Referer**：部分平台需要设置正确的 Referer
4. **数据时效**：热点数据变化快，建议实时获取
5. **版权问题**：使用热点信息时注意版权，避免直接复制

## 错误处理

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|----------|
| 请求超时 | 网络问题或平台限制 | 重试或更换网络 |
| 返回数据为空 | 平台接口变更 | 更新接口地址 |
| 403 Forbidden | 缺少必要的请求头 | 添加正确的 User-Agent 和 Referer |

### 错误处理示例

```bash
# 添加重试逻辑
max_retries=3
retry_count=0

while [ $retry_count -lt $max_retries ]; do
  response=$(curl -s -w "%{http_code}" 'https://weibo.com/ajax/side/hotSearch' \
    -H 'Referer: https://weibo.com/' \
    -H 'User-Agent: Mozilla/5.0')
  
  http_code="${response: -3}"
  body="${response%???}"
  
  if [ "$http_code" = "200" ]; then
    echo "$body"
    break
  fi
  
  retry_count=$((retry_count + 1))
  sleep 2
done
```

## 与小红书发布 Skill 联动

本 Skill 可与 `xiaohongshu_publish_skill` 配合使用：

1. 使用本 Skill 获取热点信息
2. 选择合适的热点话题
3. 使用 `xiaohongshu_publish_skill` 生成爆款文章
4. 发布到小红书

---

**免责声明**：本 Skill 仅供学习交流使用，使用时请遵守各平台的服务条款和相关法律法规。
