# 一通呼出的完整链路

这一章从座席点击呼叫开始，把完整链路串起来。后续章节会展开每一步的接口、topic 和消息结构。

## 完整序列图

```mermaid
sequenceDiagram
  autonumber
  participant Agent as Web 座席端
  participant Backend as 接入方后端
  participant Platform as 设备管理平台 Open API
  participant MQTT as MQTT Broker
  participant Device as 智能设备
  participant Phone as 主叫手机
  participant RTC as 声网 RTC

  Agent->>Backend: 请求当前账号设备列表
  Backend->>Platform: 获取平台访问令牌
  Platform-->>Backend: access_token
  Backend->>Platform: 查询账号设备列表
  Platform-->>Backend: 设备列表
  Backend-->>Agent: 返回候选设备
  Agent->>Backend: 选择 device_id，输入被叫号码
  Backend->>Backend: 原子占用设备
  alt 占用失败
    Backend-->>Agent: 设备已被占用，提示刷新或重选
  else 占用成功
    Backend->>Backend: 生成呼叫编号和 RTC 参数
    Backend->>Backend: 调用 MQTT Token API 获取座席 MQTT JWT
    Backend-->>Agent: 返回 MQTT 和 RTC 参数
    Agent->>MQTT: CONNECT
    Agent->>MQTT: 订阅通话状态 topic
    Agent->>MQTT: 发布 CALL 指令(labels._source=web)
    MQTT->>Device: 下发 CALL
    Device->>Phone: 通过蓝牙拨号
    Device->>MQTT: PUB CALLING
    MQTT-->>Agent: CALLING
    Device->>MQTT: PUB RINGING
    MQTT-->>Agent: RINGING
    opt 未接通前的运营商提示音
      Device-->>Agent: 回传空号/停机/呼叫等待等提示音
      Agent->>Backend: 提前请求座席侧 RTC Token
      Backend-->>Agent: 座席侧 RTC Token
      Agent->>RTC: 提前加入频道接收前置提示音
    end
    Phone-->>Device: 对端接听
    Device->>RTC: 设备加入 RTC 频道
    Device->>MQTT: PUB ANSWERED
    MQTT-->>Agent: ANSWERED
    Agent->>RTC: 如果尚未加入，则此时加入频道并发布麦克风音频
    Agent-->>Device: RTC 实时语音
    alt 座席主动挂断
      Agent->>RTC: leave
      Agent->>MQTT: 发布 STOP 指令
      MQTT->>Device: STOP
      Device->>Phone: 挂断
    else 设备/手机侧挂断
      Device->>MQTT: PUB HANGUP
      MQTT-->>Agent: HANGUP
      Agent->>RTC: leave
    else 呼叫失败或超时
      Device->>MQTT: PUB ERROR
      MQTT-->>Agent: ERROR
      Agent->>RTC: leave if joined
    end
    Agent->>Backend: 上报结束状态
    Backend->>Backend: 更新通话记录并释放设备占用
  end
```

## 呼叫前

1. 接入方后端调用设备管理平台 Open API，按账号手机号查询设备列表。
2. Web 前端展示候选设备。
3. 座席选择一台设备，输入或选择被叫号码。
4. 接入方后端占用这台设备。占用失败时，提示座席刷新设备列表或换一台设备。

设备列表只代表查询时刻的候选状态，不等于设备已经被当前座席独占。占用设备是正式呼叫前的必要步骤。

## 建立信令和音频准备

占用设备成功后，后端继续准备呼叫所需凭证：

1. 为 Web 座席申请 MQTT Token。
2. 为智能设备生成加入 RTC 频道所需的 RTC Token。
3. 向前端返回 App ID、MQTT WebSocket 地址、设备 ID、RTC channel、设备侧 RTC Token 等参数。
4. Web 前端建立 MQTT 连接。
5. Web 前端订阅设备通话状态 topic。

Web 端不需要订阅 MQTT presence。通话中设备离线或音频异常，应通过呼叫状态、RTC 远端用户事件、超时策略和业务后端清理来兜底。MQTT 连接参数和 topic 详见 [MQTT 协议](../reference/mqtt-topics.md)，MQTT JWT 获取详见 [MQTT JWT Token](../reference/tokens-mqtt.md)。

## 下发呼叫

Web 前端向设备的 `call` topic 发布 CALL 指令。设备收到后开始拨号，并按状态向 `evt/call` topic 上报：

- `CALLING`：设备开始拨号。
- `RINGING`：对端振铃，或者仍处于未接通前的运营商提示阶段。
- `ANSWERED`：对端接听。
- `HANGUP`：通话结束。
- `ERROR`：呼叫失败。

如果 CALL 中的 `labels._source=web`，未接通前的运营商语音提示也会回传给 Web 座席端，因此座席侧 RTC 不能再固定等到 `ANSWERED` 后才加入。推荐在拨号开始后尽早加入同一个声网 RTC 频道，以便销售在空号、停机、呼叫等待等场景下直接听到提示音并对号码做标注。

## 通话结束

通话可能由座席、设备、手机侧、网络异常或超时结束。无论哪种路径，接入方都应该完成同一组清理动作：

- 离开 RTC 频道。
- 停止或断开 MQTT 会话，或至少清理当前会话状态。
- 更新业务通话记录。
- 释放设备占用。
- 把 UI 恢复到可发起下一通电话的状态。

下一步建议阅读：[获取可呼叫设备](./03-device-list.md)、[占用设备](./04-device-reservation.md)、[发起呼叫](./06-start-call.md)。
