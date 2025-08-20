import {
  MagicOption,
  reactMagicKit as reactMagicKitCore,
} from '@react-magic-kit/core'
import { Plugin } from 'vite'

export function reactMagicKit(options?: MagicOption): Plugin {
  return {
    name: 'react-magic-kit',
    enforce: 'pre',
    transform(code, id) {
      const suffix = getSuffix(id)

      let origin = code
      try {
        return reactMagicKitCore(code, suffix, options)
      } catch (error) {
        console.error(`[react-magic-kit] ${id} transform failed: ${error}`)
        return origin
      }
    },
  }
}

function getSuffix(id: string) {
  const index = id.lastIndexOf('.')
  return id.slice(index + 1)
}
