import { DeepOptional, MagicOption, reactMagicKit as reactMagicKitCore } from 'core'
import { Plugin } from 'vite'

export default function reactMagicKitPlugin(
  options?: DeepOptional<MagicOption>
): Plugin {
  return {
    name: 'vite-plugin-react-magic-kit',
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
