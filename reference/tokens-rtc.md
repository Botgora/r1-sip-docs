# 声网 RTC Token

声网 RTC Token 用于让 Web 座席和智能设备加入同一个 RTC 频道传输语音。

## 准备项

接入方需要在声网控制台准备：

- 声网 App ID。
- 声网 App Certificate。

生产环境中，RTC Token 必须由接入方后端生成，前端只拿短期 Token。

## 生成 Token 时需要的参数

| 参数 | 说明 |
| --- | --- |
| `channel` | Web 座席和设备共同加入的 RTC 频道 |
| `uid` | 当前加入方的 RTC UID |
| `role` | 通常使用 publisher |
| `expires_at` | Token 过期时间 |

## 使用方式

- 发布 CALL 前，后端为设备侧生成 RTC Token，并放入 CALL 消息的 `token` 字段。
- 设备收到 CALL 后，使用 `channel`、`uid`、`token` 加入 RTC。
- Web 座席收到 `ANSWERED` 后，向后端请求座席侧 RTC Token。
- Web 座席加入同一个 `channel` 并发布麦克风音频。

## UID 规则

同一 RTC 频道内 UID 必须唯一。建议：

- 设备侧 UID 由 CALL 消息下发。
- 座席侧 UID 由接入方后端根据座席 ID、呼叫 ID 或递增规则生成。
- 设备 UID 和座席 UID 不要相同。

相关内容：[接入声网 RTC 音频](../guide/08-rtc-audio.md)。
