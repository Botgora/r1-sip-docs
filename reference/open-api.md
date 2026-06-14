# Open API

设备管理平台 Open API 用于接入方后端查询账号下的智能设备。所有业务接口以 `/api/open` 开头。

## 接入 URL

Open API 的接入 URL 是设备管理平台的部署地址，不是声网公共 RTC 或 MQTT 服务地址。不同客户或部署环境可能不同，请联系技术支持获取。

文档中的接口路径均以相对路径展示，例如：

```text
{DEVICE_MANAGEMENT_PLATFORM_URL}/api/open/devices
```

其中 `{DEVICE_MANAGEMENT_PLATFORM_URL}` 需要替换为技术支持提供的设备管理平台 URL。

## 获取访问令牌

```http
POST /api/open/auth/token
Content-Type: application/json
```

请求：

```json
{
  "app_id": "your_app_id",
  "app_secret": "your_app_secret"
}
```

响应：

```json
{
  "code": "200",
  "data": {
    "access_token": "jwt_access_token",
    "token_type": "Bearer",
    "expires_datetime": "2026-06-09 10:00:00"
  },
  "msg": "success"
}
```

常见错误：

| 错误码 | 含义 |
| --- | --- |
| `4006001` | `app_id` 或 `app_secret` 错误，或应用已禁用 |
| `4006002` | 应用不存在 |

## 获取账号设备列表

```http
GET /api/open/devices?phone=13800138000
Authorization: Bearer <access_token>
```

Query 参数：

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `phone` | 是 | 用户手机号，账号唯一标识 |
| `page` | 否 | 页码，从 1 开始；不传则返回全部 |
| `page_size` | 否 | 每页条数；不传则返回全部 |

响应核心字段：

| 字段 | 说明 |
| --- | --- |
| `items` | 设备列表 |
| `device_id` | 设备唯一 ID |
| `device_sn` | 设备 SN |
| `device_type_id` | 所属产品型号 ID |
| `device_type_name` | 所属产品型号名称 |
| `calling_number` | 主叫号码 |
| `calling_number_status` | 主叫号码审核状态：`0` 未上报，`1` 待审核，`2` 已通过，`3` 已驳回 |
| `device_status` | 设备状态码，平台透传设备最近状态 |
| `owner_user_id` | 设备所属用户 ID |
| `owner_phone` | 设备所属用户手机号 |
| `owner_name` | 设备所属用户显示名 |
| `total` | 总数 |

常见错误：

| 错误码 | 含义 |
| --- | --- |
| `401` | 缺少令牌或令牌格式错误 |
| `4003001` | 令牌已过期 |
| `4003002` | 令牌无效 |
| `4002001` | 账号手机号不存在 |
