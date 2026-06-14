# AI SKILL

AI SKILL 是一组面向 AI 的 Markdown 文件，用来帮助后端工程师把智能设备人工座席呼叫能力集成到自己的后端系统中。

它不绑定某一个 AI 工具，也不需要编译。你可以把它交给 Codex、Cursor、Trae、Claude Code 或其他能读取项目文件的 AI 工具。

## 下载

[下载 R1-SIP 后端集成 AI SKILL](/downloads/r1-sip-backend-ai-pack.zip)

下载后解压到你的后端项目中，或者直接把整个目录上传给 AI。

## 推荐使用方式

对 AI 说：

```text
请阅读 AGENT.md，按照其中的流程，帮我把 R1-SIP 智能设备人工座席呼叫能力集成到当前后端项目中。
先分析项目结构，再给出实现计划，最后按现有项目风格完成代码修改和验证。
```

## 包内内容

| 文件 | 用途 |
| --- | --- |
| `AGENT.md` | AI 使用入口，定义集成目标、工作方式和安全要求 |
| `references/integration-flow.md` | 一通呼叫的后端集成链路 |
| `references/backend-contract.md` | 推荐后端接口契约 |
| `references/open-api.md` | 设备管理平台 Open API 摘要 |
| `references/tokens.md` | 三类 Token 的后端处理方式 |
| `references/mqtt-protocol.md` | MQTT topic 和消息结构 |
| `references/validation-checklist.md` | 验收和联调检查清单 |
| `examples/backend-endpoints.md` | 后端接口和服务模块设计示例 |
