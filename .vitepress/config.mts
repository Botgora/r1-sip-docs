import { defineConfig } from 'vitepress'

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

export default defineConfig({
  title: '智能设备人工座席集成指南',
  description: '面向第三方 Web 座席系统的智能设备人工呼出集成文档',
  lang: 'zh-CN',
  base: process.env.BASE_PATH || '/',
  markdown: {
    config(md) {
      const defaultFence = md.renderer.rules.fence
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        const info = token.info.trim()
        if (info === 'mermaid') {
          return `<pre class="mermaid">${escapeHtml(token.content)}</pre>`
        }
        return defaultFence
          ? defaultFence(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
      }
    }
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'AI SKILL', link: '/ai-integration/' },
      { text: '指南', link: '/guide/01-understand-smart-device' },
      { text: '参考资料', link: '/reference/open-api' },
      { text: '后续规划', link: '/roadmap/inbound-call' }
    ],
    sidebar: [
      {
        text: 'AI SKILL',
        items: [
          { text: '使用说明', link: '/ai-integration/' }
        ]
      },
      {
        text: '集成指南',
        items: [
          { text: '开始阅读', link: '/index' },
          { text: '理解产品如何工作', link: '/guide/01-understand-smart-device' },
          { text: '一通呼出的完整链路', link: '/guide/02-outbound-call-walkthrough' },
          { text: '获取可呼叫设备', link: '/guide/03-device-list' },
          { text: '占用设备', link: '/guide/04-device-reservation' },
          { text: '建立 MQTT 信令连接', link: '/guide/05-mqtt-signaling' },
          { text: '发起呼叫', link: '/guide/06-start-call' },
          { text: '处理通话状态', link: '/guide/07-call-states' },
          { text: '接入声网 RTC 音频', link: '/guide/08-rtc-audio' },
          { text: '挂断和清理', link: '/guide/09-hangup-cleanup' },
          {
            text: '真设备联调',
            collapsed: false,
            items: [
              { text: '准备工作', link: '/guide/10-device-test' },
              { text: '设备介绍', link: '/guide/10-device-overview' },
              { text: 'APP 配网介绍', link: '/guide/10-app-provisioning' },
              { text: 'OTA 升级', link: '/guide/10-ota-upgrade' }
            ]
          },
          { text: '常见问题排查', link: '/guide/11-troubleshooting' }
        ]
      },
      {
        text: '参考资料',
        items: [
          { text: 'Open API', link: '/reference/open-api' },
          { text: '设备占用', link: '/reference/device-reservation' },
          { text: 'MQTT 协议', link: '/reference/mqtt-topics' },
          { text: '消息结构', link: '/reference/message-schema' },
          {
            text: 'Tokens',
            collapsed: false,
            items: [
              { text: '总览', link: '/reference/tokens' },
              { text: '设备管理平台 Access Token', link: '/reference/tokens-platform' },
              { text: 'MQTT JWT Token', link: '/reference/tokens-mqtt' },
              { text: '声网 RTC Token', link: '/reference/tokens-rtc' }
            ]
          }
        ]
      },
      {
        text: '后续规划',
        items: [
          { text: '呼入', link: '/roadmap/inbound-call' },
          { text: 'AI 外呼', link: '/roadmap/ai-outbound' }
        ]
      }
    ]
  }
})
