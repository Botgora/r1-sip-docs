# 常见问题排查

排查时建议按链路顺序看：设备是否绑定，平台是否查得到，后端是否占用成功，MQTT 是否连接成功，CALL 是否下发，设备是否上报状态，RTC 是否加入成功。

## 设备列表查不到设备

检查：

- 是否已经通过配网 APP 添加并绑定设备。
- 查询设备的手机号是否是设备所属用户账号。
- 设备是否被绑定到其他账号。
- Open API access token 是否有效。

处理：

- 重新通过配网 APP 添加设备。
- 在设备管理平台确认设备所属用户。
- 重新获取平台 access token 后再查询。

## 设备占用失败

检查：

- 是否已有其他座席占用这台设备。
- 上一通呼叫是否异常退出后未释放。
- 后端占用记录是否过期但未清理。

处理：

- 提示座席刷新设备列表或稍后重试。
- 后端定时释放过期占用。
- 对异常退出场景补充释放逻辑。

## MQTT 连接失败

检查：

- App ID 是否正确。
- MQTT WebSocket 地址是否正确。
- MQTT Token 是否由后端正确获取。
- Client ID、Username、Device ID 是否和 Token 权限匹配。

处理：

- 重新申请 MQTT Token。
- 检查 topic 权限。
- 确认 Device ID 在 topic 中没有被错误转换大小写。

## CALL 已发布但设备不拨号

检查：

- 设备是否在线并已连接 MQTT。
- topic 是否为 `d/{appid}/{device_id}/call`。
- CALL 消息是否包含 `to`、`channel`、`uid`、`token`，以及 `labels._source=web`、`labels._pipeline_id`。
- 手机蓝牙是否连接设备。
- 手机是否已插 SIM 卡。

处理：

- 查看设备是否上报 `ERROR`。
- `HFP_NOT_CONNECT` 表示手机蓝牙未连接。
- `HFP_NO_SIM` 表示手机未插 SIM 卡。
- `DEVICE_BUSY` 表示设备正在处理其他通话。

## 收到 ANSWERED 但 Web 座席听不到声音

检查：

- Web 座席是否成功加入同一个 RTC channel。
- 座席侧 RTC UID 是否和设备侧 UID 冲突。
- 座席侧 RTC Token 是否由同一个 App ID 和 App Certificate 生成。
- 浏览器麦克风权限是否允许。
- 设备是否成功加入 RTC。

处理：

- 重新生成座席侧 RTC Token。
- 检查 RTC 加入错误码。
- 检查远端音频订阅逻辑。

## 配网 APP 扫描不到设备

检查：

- 设备是否进入 BLE 配网广播模式。
- 手机蓝牙和位置权限是否开启。
- 手机系统位置服务是否开启。
- 设备是否距离手机过远。

处理：

- 长按设备按键重新进入配网模式。
- 重新打开手机蓝牙和位置权限。
- 回到 APP 重新扫描。
