# Tokens

集成中会用到三类 Token。生产环境必须通过接入方后端处理，不要把长期密钥放到 Web 前端。

| Token | 用途 | 何时使用 |
| --- | --- | --- |
| [设备管理平台 Access Token](./tokens-platform.md) | 调用设备管理平台 Open API | 查询设备列表前 |
| [MQTT JWT Token](./tokens-mqtt.md) | 作为 MQTT password 连接 Broker | Web 座席建立 MQTT 连接前 |
| [声网 RTC Token](./tokens-rtc.md) | 加入 RTC 频道传输语音 | 设备接听前、座席收到 `ANSWERED` 后 |

## 相关章节

- MQTT 连接参数见 [MQTT 协议](./mqtt-topics.md)。
- RTC 加入流程见 [接入声网 RTC 音频](../guide/08-rtc-audio.md)。
