# MQTT 协议

本页集中说明 Web 人工座席呼出涉及的 MQTT 连接参数、topic 约定和消息方向。主线章节只描述使用时机，具体协议细节以本页为准。

## MQTT 在链路中的职责

MQTT 只承载信令和状态：

- Web 座席向设备下发 CALL。
- Web 座席向设备下发 STOP。
- 设备向 Web 座席上报通话状态。
- 设备向平台上报设备事件。

MQTT 不承载语音。语音由声网 RTC 传输。人工座席场景下，如果 CALL 中传入 `labels._source=web`，未接通前的运营商提示音也会通过声网 RTC 回传给 Web 座席端。

## 主叫端连接

| 参数 | 规则 |
| --- | --- |
| Client ID | `{appid}-caller-{uid}` |
| Username | 座席 UID |
| Password | MQTT JWT Token |
| QoS | `1` |

MQTT JWT Token 的获取方式见 [MQTT JWT Token](./tokens-mqtt.md)。

## 主叫端 topic

| 方向 | Topic | 作用 |
| --- | --- | --- |
| SUBSCRIBE | `d/{appid}/{device_id}/evt/call` | 接收设备通话状态 |
| SUBSCRIBE | `d/{appid}/{device_id}/evt/presence` | 可选，接收 MQTT Broker 自动发布的设备在线/离线事件 |
| PUBLISH | `d/{appid}/{device_id}/call` | 下发 CALL |
| PUBLISH | `d/{appid}/{device_id}/stop` | 下发 STOP |

Web 人工座席呼出主流程不要求订阅 `evt/presence`。如果接入方希望增强设备在线/离线感知，可以订阅该系统事件；设备是否可作为候选设备，仍建议以设备管理平台查询结果和接入方后端占用状态为准，通话中异常通过通话状态、RTC 事件和超时兜底处理。

## Topic 命名规则

```text
d/{appid}/{device_id}/{suffix}
```

| 片段 | 说明 |
| --- | --- |
| `d` | 固定前缀，表示 device |
| `{appid}` | 声网 App ID |
| `{device_id}` | 智能设备唯一标识 |
| `{suffix}` | `call`、`stop`、`evt/call`、`evt/device` 等 |

Device ID 在 topic 中直接透传，不做大小写转换。

## 设备端连接

| 参数 | 规则 |
| --- | --- |
| Client ID | `{appid}-{device_id}` |
| Username | `{device_id}` |
| Password | 设备侧 MQTT 密钥或平台下发凭证 |
| QoS | `1` |

设备端连接由设备固件负责，Web 集成方通常不需要实现。

## 设备端 topic

| 方向 | Topic | 作用 |
| --- | --- | --- |
| SUBSCRIBE | `d/{appid}/{device_id}/call` | 接收 CALL |
| SUBSCRIBE | `d/{appid}/{device_id}/stop` | 接收 STOP |
| PUBLISH | `d/{appid}/{device_id}/evt/call` | 上报通话状态 |
| PUBLISH | `d/{appid}/{device_id}/evt/device` | 上报设备事件 |

## 消息方向

| 消息 | Topic | 方向 | 结构 |
| --- | --- | --- | --- |
| CALL | `d/{appid}/{device_id}/call` | Web -> 设备 | [CALL](./message-schema.md#call) |
| STOP | `d/{appid}/{device_id}/stop` | Web -> 设备 | [STOP](./message-schema.md#stop) |
| CALL_STATE | `d/{appid}/{device_id}/evt/call` | 设备 -> Web | [CALL_STATE](./message-schema.md#call_state) |
| DEVICE_EVENT | `d/{appid}/{device_id}/evt/device` | 设备 -> 平台 | [DEVICE_EVENT](./message-schema.md#device_event) |
| PRESENCE | `d/{appid}/{device_id}/evt/presence` | MQTT Broker -> Web，可选 | 设备在线/离线系统事件 |

## 设备在线/离线事件

`evt/presence` 由 MQTT Broker 自动发布，设备端和 Web 端都不需要手动发布。

设备上线示例：

```json
{
  "event_type": "device_online",
  "appid": "your_app_id",
  "device_id": "acp-sp2617xxxxx1",
  "timestamp": 1776677892,
  "connected_at": 1776677892
}
```

设备离线示例：

```json
{
  "event_type": "device_offline",
  "appid": "your_app_id",
  "device_id": "acp-sp2617xxxxx1",
  "timestamp": 1776677992,
  "disconnected_at": 1776677992,
  "cause": "tcp_closed"
}
```

该事件适合做辅助提示或监控，不建议替代设备管理平台设备状态和接入方后端设备占用逻辑。

## QoS 和重复消息

当前 topic 使用 QoS 1，表示至少一次投递。接入方需要允许状态重复到达，并通过 `uuid`、`seq`、`state` 或业务侧通话记录做幂等处理。

## 与主线章节的关系

- 连接 MQTT 的时机见 [建立 MQTT 信令连接](../guide/05-mqtt-signaling.md)。
- CALL 构造见 [发起呼叫](../guide/06-start-call.md)。
- 状态处理见 [处理通话状态](../guide/07-call-states.md)。
