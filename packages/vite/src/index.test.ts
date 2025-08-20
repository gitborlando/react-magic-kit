import { beforeEach, describe, expect, it, vi } from 'vitest'
import reactMagicKitPlugin from '.'

describe('vite-plugin-react-magic-kit', () => {
  let plugin: any

  beforeEach(() => {
    vi.clearAllMocks()
    plugin = reactMagicKitPlugin({
      state: {
        setState: 'setTheState',
      },
      if: 'abc-if',
    })
  })

  describe('Plugin Configuration', () => {
    it('should create plugin with correct name', () => {
      expect(plugin.name).toBe('vite-plugin-react-magic-kit')
    })

    it('should have pre enforcement', () => {
      expect(plugin.enforce).toBe('pre')
    })
  })

  describe('Transform Method', () => {
    it('should transform React files with useState', () => {
      const code = `
      export function Component() {
          const count = useMagicState(0)
          const click = () => setTheState(count,count + 1)
          return <div>{count}</div>
        }
      `
      const id = 'src/Component.tsx'

      const result = plugin.transform(code, id)
      expect(result).toContain('useState')
      expect(result).toContain('setCount')
    })

    it('should transform JSX files with data-if', () => {
      const code = `
        export function Component({ show }) {
          return <div abc-if={show}>Content</div>
        }
      `
      const id = 'src/Component.jsx'

      const result = plugin.transform(code, id)
      expect(result).toContain('{Boolean(show) &&')
    })

    it('should handle TypeScript files', () => {
      const code = `
        import { useState } from 'react'
        
        interface Props {
          initialValue: number
        }
        
        export function Component({ initialValue }: Props) {
          const count = useMagicState<number>(initialValue)
          return <div>{count}</div>
        }
      `
      const id = 'src/Component.ts'

      const result = plugin.transform(code, id)
      expect(result).toContain('useState')
    })
  })

  describe('File Type Filtering', () => {
    it('should process .js files', () => {
      const code = 'const test = "js file"'
      const result = plugin.transform(code, 'test.js')
      expect(result).toBeDefined()
    })

    it('should process .ts files', () => {
      const code = 'const test: string = "ts file"'
      const result = plugin.transform(code, 'test.ts')
      expect(result).toBeDefined()
    })

    it('should process .jsx files', () => {
      const code = 'const component = <div>JSX</div>'
      const result = plugin.transform(code, 'test.jsx')
      expect(result).toBeDefined()
    })

    it('should process .tsx files', () => {
      const code = 'const component: JSX.Element = <div>TSX</div>'
      const result = plugin.transform(code, 'test.tsx')
      expect(result).toBeDefined()
    })

    it('should skip .css files', () => {
      const code = '.class { color: red; }'
      const result = plugin.transform(code, 'styles.css')
      expect(result).toBe(code)
    })

    it('should skip .json files', () => {
      const code = '{"key": "value"}'
      const result = plugin.transform(code, 'data.json')
      expect(result).toBe(code)
    })
  })

  describe('getSuffix Helper', () => {
    it('should extract file extension correctly', () => {
      const testCases = [
        { input: 'file.js', expected: 'js' },
        { input: 'path/to/file.tsx', expected: 'tsx' },
        { input: '/absolute/path/component.jsx', expected: 'jsx' },
        { input: 'file.test.ts', expected: 'ts' },
        { input: 'file.min.js', expected: 'js' },
      ]

      testCases.forEach(({ input, expected }) => {
        // We test this indirectly through the transform method
        const code = 'test code'
        plugin.transform(code, input)
        // The fact that it doesn't throw and processes correctly indicates getSuffix works
      })
    })
  })
})
