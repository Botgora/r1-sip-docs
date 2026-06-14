# 设备占用

设备占用由接入方后端实现，用于避免多个座席同时使用同一台智能设备。

## 推荐模型

```json
{
  "device_id": "ACP-SP2617XXXXX1",
  "agent_id": "agent_001",
  "call_uuid": "CALL-001",
  "status": "reserved",
  "reserved_at": "2026-06-09T10:00:00.000Z",
  "expires_at": "2026-06-09T10:00:10.000Z"
}
```

## 状态

| 状态 | 说明 |
| --- | --- |
| `reserved` | 已占用，正在准备呼叫 |
| `calling` | CALL 已发布 |
| `in_call` | 通话中 |
| `released` | 已释放 |

## 并发处理

推荐后端使用原子更新或数据库唯一约束保证同一时刻只有一个未释放占用：

```text
device_id + active_status
```

当设备已有 `reserved`、`calling` 或 `in_call` 记录时，新的占用请求应失败，并返回明确错误给前端。

## 超时

默认建议 `reserved` 阶段 10 秒超时。接入方可按业务调整。

释放策略：

- CALL 发布失败：立即释放。
- CALL 发布后长时间无状态：按呼叫超时释放。
- 收到 `HANGUP` 或 `ERROR`：立即释放。
- 浏览器异常退出：由后端过期任务释放。
