# 飞书通知 Skill

## 概述

本 Skill 提供飞书消息通知功能，用于在小红书发布成功后自动发送通知消息。

## 核心功能

1. **获取访问令牌**：自动获取飞书 tenant_access_token
2. **发送文本消息**：支持发送纯文本通知
3. **发送卡片消息**：支持发送富文本卡片通知
4. **发布结果通知**：专门用于小红书发布成功后的通知

## 配置信息

| 配置项 | 值 |
|-------|-----|
| App ID | `cli_a92d6db4aa38dcb0` |
| App Secret | `D8dCTQyMIjvrXvvVeooUfbEbZH7mJ4GC` |
| 接收用户 Open ID | `ou_7d63e9b818fc8c72290401fd021e4796` |
| 接收用户手机号 | `13695561959` |

## 操作步骤

### 步骤 1：获取访问令牌

**功能**：获取飞书 API 访问令牌

**API 端点**：`POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`

**请求示例**：

```bash
curl -s -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
  -H "Content-Type: application/json" \
  -d '{"app_id":"cli_a92d6db4aa38dcb0","app_secret":"D8dCTQyMIjvrXvvVeooUfbEbZH7mJ4GC"}'
```

**响应示例**：

```json
{
  "code": 0,
  "expire": 7200,
  "msg": "ok",
  "tenant_access_token": "t-g10434eyXTO6BDVSQT7T7ILZJLNY6MXDYJ4CQEWO"
}
```

### 步骤 2：发送文本消息

**功能**：发送纯文本消息通知

**API 端点**：`POST https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id`

**请求参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| receive_id | string | 是 | 接收者的 open_id |
| msg_type | string | 是 | 消息类型，固定为 `text` |
| content | string | 是 | JSON 格式的消息内容 |

**请求示例**：

创建请求文件 `feishu_message.json`：

```json
{
  "receive_id": "ou_7d63e9b818fc8c72290401fd021e4796",
  "msg_type": "text",
  "content": "{\"text\":\"这是一条测试消息\"}"
}
```

发送请求：

```bash
curl -s -X POST "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @feishu_message.json
```

### 步骤 3：发送卡片消息

**功能**：发送富文本卡片消息，适合发布成功通知

**卡片消息格式**：

```json
{
  "receive_id": "ou_7d63e9b818fc8c72290401fd021e4796",
  "msg_type": "interactive",
  "content": "{\"type\":\"template\",\"data\":{\"template_id\":\"YOUR_TEMPLATE_ID\",\"template_variable\":{\"title\":\"标题\",\"content\":\"内容\"}}}"
}
```

### 步骤 4：小红书发布成功通知

**功能**：在小红书发布成功后发送通知

**通知内容模板**：

```
🎉 小红书发布成功！

📝 标题：{文章标题}
📅 时间：{发布时间}
🏷️ 标签：{标签列表}
🖼️ 图片：{图片数量}张

✅ 状态：发布完成
```

**请求文件示例** `feishu_publish_notify.json`：

```json
{
  "receive_id": "ou_7d63e9b818fc8c72290401fd021e4796",
  "msg_type": "text",
  "content": "{\"text\":\"🎉 小红书发布成功！\\n\\n📝 标题：{title}\\n📅 时间：{time}\\n🏷️ 标签：{tags}\\n🖼️ 图片：{imageCount}张\\n\\n✅ 状态：发布完成\"}"
}
```

## 完整调用流程

### 流程图

```
1. 获取 access_token
   ↓
2. 构建消息内容
   ↓
3. 发送消息
   ↓
4. 返回发送结果
```

### 完整示例脚本

```bash
#!/bin/bash

# 配置
APP_ID="cli_a92d6db4aa38dcb0"
APP_SECRET="D8dCTQyMIjvrXvvVeooUfbEbZH7mJ4GC"
RECEIVE_ID="ou_7d63e9b818fc8c72290401fd021e4796"

# 1. 获取 access_token
TOKEN_RESPONSE=$(curl -s -X POST "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal" \
  -H "Content-Type: application/json" \
  -d "{\"app_id\":\"$APP_ID\",\"app_secret\":\"$APP_SECRET\"}")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"tenant_access_token":"[^"]*"' | cut -d'"' -f4)

# 2. 发送消息
MESSAGE='{"receive_id":"'$RECEIVE_ID'","msg_type":"text","content":"{\"text\":\"🎉 小红书发布成功！\"}"}'

curl -s -X POST "https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=open_id" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$MESSAGE"
```

## 与小红书发布 Skill 联动

### 调用时机

在小红书发布成功后（步骤 5 完成后），调用本 Skill 发送通知。

### 联动示例

```bash
# 1. 发布小红书文章
PUBLISH_RESULT=$(curl -s -X POST http://localhost:18060/api/v1/publish \
  -H "Content-Type: application/json; charset=utf-8" \
  --data-binary @article.json)

# 2. 检查发布结果
if echo "$PUBLISH_RESULT" | grep -q '"success":true'; then
  # 3. 获取文章信息
  TITLE=$(echo "$PUBLISH_RESULT" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
  
  # 4. 发送飞书通知
  # 调用本 Skill 发送通知...
fi
```

## API 参考

### 获取 tenant_access_token

| 项目 | 说明 |
|------|------|
| URL | `POST /open-apis/auth/v3/tenant_access_token/internal` |
| Content-Type | `application/json` |
| 请求体 | `{"app_id":"xxx","app_secret":"xxx"}` |
| 返回 | `{"code":0,"tenant_access_token":"xxx","expire":7200}` |

### 发送消息

| 项目 | 说明 |
|------|------|
| URL | `POST /open-apis/im/v1/messages?receive_id_type=open_id` |
| Content-Type | `application/json` |
| Authorization | `Bearer {access_token}` |
| 请求体 | `{"receive_id":"xxx","msg_type":"text","content":"{...}"}` |

### 通过手机号获取用户 ID

| 项目 | 说明 |
|------|------|
| URL | `POST /open-apis/contact/v3/users/batch_get_id` |
| Content-Type | `application/json` |
| Authorization | `Bearer {access_token}` |
| 请求体 | `{"mobiles":["13695561959"]}` |
| 返回 | `{"code":0,"data":{"user_list":[{"user_id":"xxx"}]}}` |

## 消息模板

### 发布成功通知

```json
{
  "receive_id": "ou_7d63e9b818fc8c72290401fd021e4796",
  "msg_type": "text",
  "content": "{\"text\":\"🎉 小红书发布成功！\\n\\n📝 标题：{title}\\n📅 时间：{time}\\n🏷️ 标签：{tags}\\n🖼️ 图片：{imageCount}张\\n\\n✅ 状态：发布完成\"}"
}
```

### 发布失败通知

```json
{
  "receive_id": "ou_7d63e9b818fc8c72290401fd021e4796",
  "msg_type": "text",
  "content": "{\"text\":\"❌ 小红书发布失败\\n\\n📝 标题：{title}\\n📅 时间：{time}\\n⚠️ 错误：{error}\\n\\n请检查后重试\"}"
}
```

## 错误处理

### 常见错误码

| 错误码 | 说明 | 解决方案 |
|-------|------|---------|
| 99991672 | 权限不足 | 在飞书开放平台开通相应权限 |
| 99991663 | token 无效 | 重新获取 access_token |
| 99991661 | token 过期 | 重新获取 access_token |

### 错误处理示例

```bash
# 检查响应中的 code
RESPONSE=$(curl -s -X POST ...)

CODE=$(echo $RESPONSE | grep -o '"code":[0-9]*' | cut -d':' -f2)

if [ "$CODE" = "0" ]; then
  echo "发送成功"
else
  echo "发送失败: $RESPONSE"
fi
```

## 注意事项

1. **Token 有效期**：tenant_access_token 有效期为 2 小时，建议缓存并在过期前刷新
2. **请求频率**：避免过于频繁的请求，建议间隔 1 秒以上
3. **消息长度**：文本消息最大长度为 30KB
4. **权限配置**：确保应用已开通 `im:message` 和 `contact:user.base:readonly` 权限
5. **编码格式**：请求体使用 UTF-8 编码

## 配置文件

建议将配置保存到项目配置文件中：

创建 `feishu_config.json`：

```json
{
  "app_id": "cli_a92d6db4aa38dcb0",
  "app_secret": "D8dCTQyMIjvrXvvVeooUfbEbZH7mJ4GC",
  "receive_open_id": "ou_7d63e9b818fc8c72290401fd021e4796",
  "receive_mobile": "13695561959"
}
```

---

**免责声明**：本 Skill 仅供内部使用，请妥善保管 App Secret，避免泄露。
