# 建立 MQTT 信令连接

MQTT 负责 Web 座席和智能设备之间的呼叫信令。它承载 CALL、STOP 和设备通话状态，不承载语音。

## 主叫端连接参数

| 参数 | 规则 |
| --- | --- |
| Client ID | `{appid}-caller-{uid}` |
| Username | 座席 UID |
| Password | MQTT JWT Token |
| QoS | `1` |

其中 `appid` 是声网项目 App ID。生产环境中，Web 前端应通过接入方后端获取 MQTT JWT Token，不应直接持有用于申请 Token 的服务端凭证。获取方式见 [MQTT JWT Token](../reference/tokens-mqtt.md)。

## 主叫端 topic

假设设备 ID 为 `acp-sp2617xxxxx1`，topic 模式如下：

| 方向 | Topic | 作用 |
| --- | --- | --- |
| SUBSCRIBE | `d/{appid}/{device_id}/evt/call` | 接收设备通话状态 |
| PUBLISH | `d/{appid}/{device_id}/call` | 下发 CALL 指令 |
| PUBLISH | `d/{appid}/{device_id}/stop` | 下发 STOP 挂断指令 |

Web 端呼出流程不需要订阅 `evt/presence`。设备是否可作为候选设备，先以设备管理平台查询结果和接入方后端占用状态为准；通话中异常通过状态上报、RTC 事件和超时策略处理。

## 连接流程

1. 后端生成或代理获取 MQTT Token。
2. 前端使用 `clientId`、`username`、`password` 连接 MQTT WebSocket。
3. 连接成功后订阅 `evt/call`。
4. 座席点击呼叫时发布 CALL。
5. 座席挂断或超时时发布 STOP。

需要注意：Device ID 在 topic 中直接透传，不做大小写转换。相同 Client ID 重复连接会互相踢下线。

本章只保留集成主线。完整连接参数、topic、设备端订阅发布关系和 MQTT JWT Token 请求示例见 [MQTT 协议](../reference/mqtt-topics.md) 和 [MQTT JWT Token](../reference/tokens-mqtt.md)。

下一步：[发起呼叫](./06-start-call.md)。
