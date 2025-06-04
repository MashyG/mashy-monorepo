<script setup lang="ts">
import { sleep } from '@/share'
import { onMounted, onUnmounted, ref, nextTick, type PropType } from 'vue'
import { type TabName } from '../utils/types'

const props = defineProps({
  activeTab: {
    type: String as PropType<TabName>,
    default: 'PopularKeyword'
  }
})

const rootEl = ref<any>(null)
const defaultOffset = 16
const isMouse = ref(false)
const position = ref({ top: '60px', left: '', right: '20px' })
const offset = ref({
  startX: 0,
  diffX: 0,
  startY: 0,
  diffY: 0,
  width: 0,
  height: 0
})

onMounted(() => {
  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', handleDragEnd)
  window.removeEventListener('resize', initPosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', handleDragEnd)
  window.removeEventListener('resize', initPosition)
})

const initPosition = () => {
  nextTick(() => {
    initOffset()
  })
  position.value.top = '60px'
  position.value.right = '20px'
}

const initOffset = (event?: MouseEvent) => {
  const { width, height, left, top } = rootEl.value?.getBoundingClientRect()
  const { pageX = 0, pageY = 0 } = event || {}

  offset.value.width = width
  offset.value.height = height
  offset.value.startX = pageX
  offset.value.startY = pageY
  offset.value.diffX = pageX - left
  offset.value.diffY = pageY - top
}
const handleDragStart = (event: MouseEvent) => {
  // 只允许鼠标左键 或 鼠标中键 触发
  if (event.button > 1) {
    return
  }
  isMouse.value = true
  initOffset(event)
}
const handleDrag = (event: MouseEvent) => {
  if (!isMouse.value) {
    return
  }
  position.value.right = ''
  const { pageY, pageX } = event
  const { diffX, diffY, width, height } = offset.value

  const top = pageY - diffY
  const left = pageX - diffX

  const { innerWidth, innerHeight } = window || {}

  if (top < defaultOffset || top > innerHeight - height - defaultOffset) {
    return
  }

  if (left < defaultOffset || left > innerWidth - width - defaultOffset) {
    return
  }

  position.value.top = `${top}px`
  position.value.left = `${left}px`
}
const handleDragEnd = async (event: MouseEvent) => {
  const { pageX, pageY } = event || {}
  const { startX, startY } = offset.value
  if (startX !== pageX || startY !== pageY) {
    await sleep(100)
  }
  isMouse.value = false
}
</script>

<template>
  <div
    ref="rootEl"
    :class="`fixed select-none ${props.activeTab === 'DownLoadImgs' ? 'z-[99999]' : 'z-[999]'}`"
    :style="position"
    @mousedown="handleDragStart"
  >
    <slot />
  </div>
</template>
