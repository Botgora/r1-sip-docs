# 设备管理平台 Access Token

设备管理平台 Access Token 用于调用设备管理平台 Open API，例如查询账号下的设备列表。

## 获取方式

```http
POST /api/open/auth/token
```

请求：

```json
{
  "app_id": "your_app_id",
  "app_secret": "your_app_secret"
}
```

成功后，后续业务接口在请求头携带：

```http
Authorization: Bearer <access_token>
```

## 注意事项

- `app_id` 和 `app_secret` 由设备管理平台分配。
- 设备管理平台接入 URL 由部署环境决定，请联系技术支持获取。
- Access Token 应由接入方后端获取和缓存，不应由 Web 前端直接获取。

完整接口字段见 [Open API](./open-api.md)。
