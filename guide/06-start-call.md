# 发起呼叫

发起呼叫的核心动作是向设备的 `call` topic 发布 CALL 消息。CALL 消息告诉设备要拨哪个号码、加入哪个 RTC 频道、使用哪个 RTC Token。

## 发起前检查

发布 CALL 之前，应确认：

- 已查询到设备，并且设备满足业务可用条件。
- 后端已成功占用设备。
- Web 端已建立 MQTT 连接并订阅 `evt/call`。
- 后端已生成设备侧 RTC Token。
- 已生成本次呼叫的 `uuid`。
- 人工座席场景下，已准备 `labels._source=web` 和 `labels._pipeline_id`。

## 最小 CALL 示例

```json
{
  "event_type": "call",
  "appid": "your_app_id",
  "device_id": "acp-sp2617xxxxx1",
  "channel": "acp-sp2617xxxxx1-13800138000",
  "uid": "666",
  "token": "rtc_token_for_device",
  "to": "13800138000",
  "from": "acp-sp2617xxxxx1",
  "uuid": "CALL-001",
  "peer_uuid": "PEER-001",
  "agent_id": "agent_001",
  "service": "",
  "vid": "130451",
  "timestamp": 1776657046,
  "labels": {
    "_direction": "outbound",
    "_from_number": "acp-sp2617xxxxx1",
    "_pipeline_id": "web_demo_666",
    "_source": "web",
    "_to_number": "13800138000"
  }
}
```

## 关键字段怎么理解

| 字段 | 说明 |
| --- | --- |
| `event_type` | 固定为 `call` |
| `appid` | 声网 App ID |
| `device_id` | 被选中的智能设备 ID |
| `channel` | Web 座席和设备共同加入的 RTC 频道 |
| `uid` | 设备加入 RTC 使用的 UID |
| `token` | 设备加入 RTC 使用的 RTC Token |
| `to` | 被叫手机号 |
| `from` | 通常使用设备 ID 或业务主叫标识 |
| `uuid` | 本次呼叫唯一标识 |
| `peer_uuid` | 对端唯一标识 |
| `agent_id` | 座席或业务侧座席标识 |
| `service` | 业务服务标识，按接入约定透传 |
| `vid` | 业务线路或资源标识，按接入约定透传 |
| `labels` | 业务透传字段，设备状态上报时会带回 |

`vid`、`service`、`labels` 等字段是否必填取决于具体业务接入约定。首版集成时，建议至少保留 `labels._direction`、`labels._from_number`、`labels._pipeline_id`、`labels._source`、`labels._to_number`，方便后续排查和通话记录关联。

## `_source` 字段的新增语义

人工座席呼叫场景中，`labels._source` 建议固定传入：

```json
"_source": "web"
```

这个字段除了标识呼叫来源，还承担一个关键能力开关：在被叫号码尚未接通之前，如果运营商侧返回了提示音，例如空号、停机、呼叫等待、忙线等语音播报，这部分语音会回传给 Web 呼叫端。

同时建议补充：

```json
"_pipeline_id": "web_demo_666"
```

demo 中该字段按 `web_demo_{uid}` 生成，用于标识具体发起链路。

这样销售或座席可以在未接通阶段直接听到提示内容，并在业务系统中把该号码标记为：

- 空号
- 停机
- 呼叫等待
- 忙线
- 其他不建议再次外呼的状态

因此，`labels._source=web` 不只是一个普通标签，而是人工座席场景下前置提示音回传到 Web 端的关键字段。

完整 CALL、STOP 和状态消息结构见 [消息结构](../reference/message-schema.md)。下一步：[处理通话状态](./07-call-states.md)。
