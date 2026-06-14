# 获取可呼叫设备

Web 座席发起呼叫前，需要先知道当前账号下有哪些智能设备可以承担拨号。这个列表来自设备管理平台 Open API。设备管理平台的接入 URL 由部署环境决定，请联系技术支持获取。

## 获取平台 access token

接入方后端使用平台分配的 `app_id` 和 `app_secret` 换取访问令牌。

```http
POST /api/open/auth/token
Content-Type: application/json

{
  "app_id": "your_app_id",
  "app_secret": "your_app_secret"
}
```

成功后，后续业务接口在请求头携带：

```http
Authorization: Bearer <access_token>
```

完整字段和设备管理平台 URL 说明见 [Open API](../reference/open-api.md)。

## 查询账号设备列表

按用户手机号查询该账号下已绑定的设备。

```http
GET /api/open/devices?phone=13800138000
Authorization: Bearer <access_token>
```

前端建议展示这些字段：

| 字段 | 用途 |
| --- | --- |
| `device_id` | 设备唯一 ID，后续占用、呼叫和 MQTT topic 都会用到 |
| `device_sn` | 设备 SN，便于用户和线下设备对应 |
| `device_type_name` | 设备型号 |
| `calling_number` | 设备绑定的主叫号码 |
| `calling_number_status` | 主叫号码审核状态 |
| `device_status` | 设备状态码 |
| `owner_phone` | 设备所属账号 |

## 前端筛选建议

进入呼叫按钮前，建议至少检查：

- 设备属于当前账号。
- 设备未被禁用。
- 主叫号码已上报并审核通过。
- 设备状态满足业务侧“可候选”的要求。
- 接入方后端判断设备未被其他座席占用。

注意：设备列表中的状态只是候选条件。座席点击呼叫后，仍然需要先走 [占用设备](./04-device-reservation.md)。

下一步：[占用设备](./04-device-reservation.md)。相关 reference：[Open API](../reference/open-api.md)。
