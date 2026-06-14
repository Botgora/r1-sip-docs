# 接入声网 RTC 音频

MQTT 只负责信令和状态，语音由声网 RTC 承载。默认情况下，Web 座席通常在收到设备 `ANSWERED` 状态后再加入 RTC 频道。

## App ID 和证书

接入方需要在声网控制台准备：

- 声网 App ID：用于 Web 座席和设备加入同一个 RTC 项目。
- 声网 App Certificate：用于接入方后端生成 RTC Token。

生产环境中，RTC Token 必须由接入方后端生成，前端只拿短期 Token。

## 加入时机

推荐流程：

1. 发布 CALL 时，CALL 消息中带上设备侧 RTC Token。
2. 默认场景下，设备拨号并上报 `ANSWERED`。
3. Web 前端收到 `ANSWERED`。
4. Web 前端请求接入方后端生成座席侧 RTC Token。
5. Web 前端加入 CALL 中同一个 `channel`。
6. Web 前端发布本地麦克风音频，并订阅设备侧音频。

## 人工座席场景的前置提示音回传

当 CALL 消息中的 `labels._source=web` 时，被叫号码在未接通前返回的运营商提示音也会回传到 Web 座席端，例如：

- “对不起，您所拨打的号码是空号”
- 停机提示
- 呼叫等待提示
- 忙线提示

这部分音频出现在 `ANSWERED` 之前，所以 Web 前端不能把 RTC 加入时机硬编码为“收到 `ANSWERED` 后才加入”。如果仍按旧逻辑处理，座席将听不到这些关键提示音。

推荐做法：

1. CALL 发布成功后，尽快向后端申请座席侧 RTC Token。
2. 在设备开始拨号后尽早加入同一 `channel`。
3. UI 上仍以 MQTT 状态区分“振铃中”和“已接听”，不要因为听到提示音就误判为已接通。

## UID 规则

RTC UID 需要在同一个频道内唯一。示例 CALL 中设备侧使用 `uid: "666"`；正式集成建议由接入方后端统一生成或分配，避免同一频道内冲突。

建议规则：

- 设备侧 UID：随 CALL 消息下发给设备。
- 座席侧 UID：由接入方后端根据座席 ID、呼叫 ID 或递增规则生成。
- 同一 `channel` 内，设备 UID 和座席 UID 不要相同。

## 异常处理

RTC 加入失败时，应终止本次呼叫流程：

- 发送 STOP 或执行业务侧取消。
- 释放设备占用。
- 展示“语音连接失败”。
- 记录失败原因。

RTC 远端用户离开时，Web 端应结合 MQTT 状态判断。如果未收到 `HANGUP`，也需要通过超时或后端兜底任务清理会话。

RTC Token 的用途和生成参数见 [声网 RTC Token](../reference/tokens-rtc.md)。下一步：[挂断和清理](./09-hangup-cleanup.md)。
