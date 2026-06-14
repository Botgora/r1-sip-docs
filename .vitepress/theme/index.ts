import DefaultTheme from 'vitepress/theme'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mermaid from 'mermaid'
import './style.css'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()

    const renderMermaid = async () => {
      await nextTick()
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'loose',
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default'
      })
      await mermaid.run({
        querySelector: '.mermaid'
      })
    }

    onMounted(renderMermaid)
    watch(
      () => route.path,
      () => {
        renderMermaid()
      }
    )
  }
}
