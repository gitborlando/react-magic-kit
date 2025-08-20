import MagicString from 'magic-string'
import oxc from 'oxc-parser'
import { walk } from 'oxc-walker'
import {
  collectDataIfJsx,
  dataIfJsxElements,
  walkAllDataIfJsx,
} from 'packages/core/src/data-if'
import { walkUseState, walkUseStateSetter } from 'packages/core/src/use-state'
import { MagicOption, setOptions } from './options'

export type { MagicOption }

export function reactMagicKit(code: string, suffix: string, options?: MagicOption) {
  if (!['js', 'ts', 'jsx', 'tsx'].includes(suffix)) {
    throw new Error(`Invalid suffix: ${suffix}`)
  }

  setOptions(options)

  const res = oxc.parseSync(`index.${suffix}`, code, {
    astType: suffix === 'tsx' ? 'ts' : 'js',
    range: true,
  })
  if (res.errors.length > 0) {
    throw new Error(res.errors[0].message)
  }

  dataIfJsxElements.length = 0
  const s = new MagicString(code)

  walk(res.program, {
    enter(node) {
      switch (node.type) {
        case 'VariableDeclarator':
          walkUseState(node, s)
          break
        case 'CallExpression':
          walkUseStateSetter(node, s)
          break
        case 'JSXElement':
          collectDataIfJsx(node)
          break
      }
    },
  })

  walkAllDataIfJsx(s)

  return s.toString()
}
