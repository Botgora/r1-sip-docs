# 消息结构

## CALL

Topic：

```text
d/{appid}/{device_id}/call
```

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

## STOP

Topic：

```text
d/{appid}/{device_id}/stop
```

```json
{
  "appid": "your_app_id"
}
```

## CALL_STATE

Topic：

```text
d/{appid}/{device_id}/evt/call
```

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
  "state": "CALLING",
  "seq": 1,
  "uuid": "CALL-001",
  "peer_uuid": "PEER-001",
  "agent_id": "agent_001",
  "device_id": "acp-sp2617xxxxx1",
  "service": "",
  "direction": "outbound",
  "from": "acp-sp2617xxxxx1",
  "to": "13800138000"
}
```

`HANGUP` 通常附加：

```json
{
  "cause": "NORMAL_CLEARING",
  "duration_sec": 30,
  "billsec": 30
}
```

`ERROR` 通常附加：

```json
{
  "cause": "HFP_NOT_CONNECT"
}
```

### CALL_STATE 字段说明

| 字段 | 说明 |
| --- | --- |
| `event_type` | 固定为 `call_state` |
| `timestamp` | 状态产生时间 |
| `appid` | 声网 App ID |
| `vid` | 业务侧线路或资源标识，按接入约定透传 |
| `service` | 业务服务标识，按接入约定透传 |
| `device_id` | 上报状态的智能设备 ID |
| `channel` | 本次呼叫使用的 RTC 频道 |
| `call_id` | 预留呼叫标识，当前示例中为空字符串 |
| `state` | 当前通话状态 |
| `seq` | 状态序号，用于排序和幂等处理 |
| `uuid` | 本次呼叫唯一标识 |
| `peer_uuid` | 对端唯一标识 |
| `agent_id` | 座席或业务侧座席标识 |
| `direction` | 呼叫方向，人工呼出为 `outbound` |
| `from` | 主叫侧标识，通常为设备 ID 或业务主叫标识 |
| `to` | 被叫手机号 |
| `labels` | 业务透传字段 |
| `answered_at` | `ANSWERED` 时的接听时间 |
| `cause` | `HANGUP` 或 `ERROR` 时的原因 |
| `duration_sec` | 通话持续时长，通常在 `HANGUP` 中出现 |
| `billsec` | 计费时长，通常在 `HANGUP` 中出现 |

### `labels` 关键字段

人工座席呼叫场景建议至少传入：

```json
{
  "_direction": "outbound",
  "_from_number": "acp-sp2617xxxxx1",
  "_pipeline_id": "web_demo_666",
  "_source": "web",
  "_to_number": "13800138000"
}
```

其中：

- `_pipeline_id` 用于标识发起链路或业务管道，demo 中约定为 `web_demo_{uid}`。
- `_source` 建议固定传 `web`。这个字段除了标识呼叫来源，还用于让未接通前的运营商提示音回传到 Web 座席端。

例如空号、停机、呼叫等待、忙线等提示音，会在 `ANSWERED` 之前返回给座席端，方便销售及时标注号码状态。

### state 取值

| state | 含义 | Web 端动作 |
| --- | --- | --- |
| `CALLING` | 正在拨号 | 展示拨号中 |
| `RINGING` | 对端振铃或未接通前提示阶段 | 展示振铃中；如 `_source=web`，允许播放前置提示音 |
| `ANSWERED` | 已接通 | 如果尚未加入 RTC，则此时加入 |
| `HANGUP` | 已挂断 | 清理会话，释放设备 |
| `ERROR` | 呼叫失败 | 展示原因，释放设备 |

### HANGUP cause

| cause | 含义 |
| --- | --- |
| `NORMAL_CLEARING` | 通话建立后正常挂断 |
| `USER_BUSY` | 拒接、忙线或未接听 |
| `DEVICE_BUSY` | 设备正在通话中 |

### ERROR cause

| cause | 含义 | 建议处理 |
| --- | --- | --- |
| `HFP_NOT_CONNECT` | 手机蓝牙未连接 | 提示检查手机蓝牙连接 |
| `HFP_NO_SIM` | 手机未插 SIM 卡 | 提示检查 SIM 卡 |

### UI 文案建议

| 状态或原因 | 文案 |
| --- | --- |
| `CALLING` | 拨号中 |
| `RINGING` | 对方振铃中 |
| `ANSWERED` | 通话中 |
| `NORMAL_CLEARING` | 通话已结束 |
| `USER_BUSY` | 对方未接听或忙线 |
| `DEVICE_BUSY` | 设备正在使用 |
| `HFP_NOT_CONNECT` | 手机蓝牙未连接设备 |
| `HFP_NO_SIM` | 手机未检测到 SIM 卡 |

## DEVICE_EVENT

Topic：

```text
d/{appid}/{device_id}/evt/device
```

```json
{
  "phone_num": "+8613800138000",
  "app_version": "1.0.0"
}
```
