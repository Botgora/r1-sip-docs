# APP 配网介绍

配网 APP 的完整操作请参考《设备配网APP使用说明-202605-V1.0.pdf》。这里说明联调时必须完成的关键动作。

## 1. 安装并登录 APP

使用设备提供方给出的安装包安装配网 APP。登录时使用准备好的终端用户账号。

如果无法登录，优先确认：

- 手机号和密码是否正确。
- 验证码是否正确。
- 账号是否已在设备管理平台创建。
- 账号是否处于启用状态。

![配网 APP 登录页](/images/device-test/app-login.png)


## 2. 授权手机权限

添加设备前，确保手机已开启：

- 蓝牙。
- 位置服务。
- APP 位置权限。
- APP 附近设备权限。

如果权限被拒绝，需要到手机系统设置中重新打开。

![APP 权限检查](/images/device-test/app-permission-check.png)


## 3. 添加设备

在 APP 中进入“添加设备”流程。设备进入 BLE 配网广播模式后，APP 会扫描附近设备。选择目标设备后继续网络配置。

![扫描设备](/images/device-test/app-scan-device.png)

## 4. 配置网络

如果使用 Wi-Fi：

- 选择 2.4G Wi-Fi。
- 输入 Wi-Fi 密码。
- 等待设备完成联网和绑定。

如果使用网口：

- 先确保网线已连接并可联网。
- 仍然通过 APP 走设备添加流程。
- 网络本身可以由网口提供，但用户设备绑定不能跳过。

![网络选择](/images/device-test/app-network-select.png)


## 5. 等待配网和绑定结果

APP 会展示配网过程。成功后，设备会出现在当前用户的设备列表中。

![配网过程](/images/device-test/app-provisioning-progress.png)

![配网成功](/images/device-test/app-provisioning-success.png)

## 6. 确认设备已绑定

配网或绑定成功后：

- APP 首页应能看到刚添加的设备。
- 设备管理平台中应能查询到该设备。
- Web 座席后端按账号手机号调用 Open API 时，应能返回该设备。

![APP 设备列表](/images/device-test/app-device-list.png)


如果失败，可以重新进入配网模式后重试。常见原因包括蓝牙或位置权限关闭、Wi-Fi 名称或密码错误、网络信号弱、设备异常或中途关闭 APP。

下一步：[真设备联调 - 呼叫前检查](./10-device-test.md#呼叫前检查)。
