# MQTT JWT Token

MQTT JWT Token 用作 MQTT 连接 password。Web 座席端通过它连接 MQTT Broker，并按授权 topic 订阅或发布消息。

生产环境中，MQTT JWT Token 应由接入方后端获取，再下发给 Web 前端。不要把声网 Basic Auth 放到前端。

## 请求地址

```text
https://api.sd-rtn.com/v1/projects/{YOUR_APP_ID}/mqtt/token
```

其中 `{YOUR_APP_ID}` 替换为声网 App ID。

## 请求示例

```bash
curl -X POST 'https://api.sd-rtn.com/v1/projects/{YOUR_APP_ID}/mqtt/token' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Basic {YOUR_BASIC_AUTH}' \
  -d '{
    "username": "agent_001",
    "client_id": "{YOUR_APP_ID}-caller-agent_001",
    "device_id": "ACP-SP2617XXXXX1"
  }'
```

## 参数说明

| 参数 | 说明 |
| --- | --- |
| `username` | MQTT Username。Web 主叫端建议使用座席 UID |
| `client_id` | MQTT Client ID。Web 主叫端建议使用 `{appid}-caller-{uid}` |
| `device_id` | 本次呼叫选中的智能设备 ID，用于生成对应 topic 权限 |
| `Authorization` | 声网 HTTP Basic Auth |

## 响应示例

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "{JWT_TOKEN_HERE}",
    "issued_at": 1776677892,
    "expires_at": 1776681492
  },
  "request_id": "18019b593a2b4354b92cc67318e470ad",
  "ts": 1776677892
}
```

前端连接 MQTT 时，把 `data.token` 作为 password。

## Basic Auth 获取

MQTT Token API 的 `Authorization` 使用声网 HTTP Basic Auth。你需要在声网控制台获取 **客户 ID** 和 **客户密钥**，然后按如下规则生成：

```text
Basic base64(客户ID:客户密钥)
```

命令行示例：

```bash
echo -n 'YOUR_CUSTOMER_KEY:YOUR_CUSTOMER_SECRET' | base64
```

Node.js 示例：

```js
const customerKey = 'YOUR_CUSTOMER_KEY'
const customerSecret = 'YOUR_CUSTOMER_SECRET'
const auth = 'Basic ' + Buffer.from(`${customerKey}:${customerSecret}`).toString('base64')
console.log(auth)
```

注意：

- `客户密钥` 只应保存在接入方后端。
- 不要把 Basic Auth 下发到 Web 前端。
- 如果密钥泄露，应立即在声网控制台重置。

相关内容：[MQTT 协议](./mqtt-topics.md)。
