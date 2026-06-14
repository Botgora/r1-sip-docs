# 处理通话状态

设备通过 `d/{appid}/{device_id}/evt/call` 上报通话状态。Web 座席端应把这些状态作为页面展示、RTC 加入和清理动作的主要依据。

## 状态流转

| 状态 | 含义 | Web 端建议动作 |
| --- | --- | --- |
| `CALLING` | 设备已开始拨号 | 显示“拨号中”，把占用状态更新为 `calling` |
| `RINGING` | 对端振铃或仍处于未接通前提示阶段 | 显示“对方振铃中”；如果 `_source=web`，允许播放前置提示音 |
| `ANSWERED` | 对端接听 | 如果尚未加入 RTC，则立即申请座席侧 RTC Token，加入 RTC 频道，把占用状态更新为 `in_call` |
| `HANGUP` | 通话结束 | 离开 RTC，更新通话记录，释放设备占用 |
| `ERROR` | 呼叫失败 | 展示失败原因，离开 RTC，释放设备占用 |

## 状态消息示例

```json
{
  "event_type": "call_state",
  "timestamp": "2026-06-09T10:00:00.000Z",
  "appid": "your_app_id",
  "vid": 130451,
  "labels": {
    "_direction": "outbound",
    "_from_number": "acp-sp2617xxxxx1",
    "_pipeline_id": "web_demo_666",
    "_source": "web",
    "_to_number": "13800138000"
  },
  "channel": "acp-sp2617xxxxx1-13800138000",
  "call_id": "",
  "state": "ANSWERED",
  "seq": 3,
  "uuid": "CALL-001",
  "peer_uuid": "PEER-001",
  "agent_id": "agent_001",
  "device_id": "acp-sp2617xxxxx1",
  "service": "",
  "direction": "outbound",
  "from": "acp-sp2617xxxxx1",
  "to": "13800138000",
  "answered_at": "2026-06-09T10:00:05.000Z"
}
```

## 常见原因码

| cause | 场景 | 建议提示 |
| --- | --- | --- |
| `NORMAL_CLEARING` | 通话建立后正常挂断 | 通话已结束 |
| `USER_BUSY` | 拒接、忙线或振铃后未接听 | 对方未接听或忙线 |
| `DEVICE_BUSY` | 设备正在通话中 | 设备正在使用，请稍后重试 |
| `HFP_NOT_CONNECT` | 手机蓝牙未连接 | 请检查手机蓝牙是否连接设备 |
| `HFP_NO_SIM` | 手机未插 SIM 卡 | 请检查主叫手机 SIM 卡 |

## `_source=web` 对状态处理的影响

如果 CALL 消息中传入 `labels._source=web`，未接通前的运营商提示音也会回传给 Web 座席端。

这意味着：

- 不要把“能听到语音”直接等同于“已经接听”。
- 在 `RINGING` 阶段也可能出现语音播报。
- Web 端应允许销售在未接通阶段根据提示音给号码做业务标注。

完整字段、状态和原因码见 [消息结构 - CALL_STATE](../reference/message-schema.md#call_state)。

下一步：[接入声网 RTC 音频](./08-rtc-audio.md)。
