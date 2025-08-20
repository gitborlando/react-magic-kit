import MagicString from 'magic-string'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import oxc from 'oxc-parser'
import { walk } from 'oxc-walker'
import { collectDataIfJsx, dataIfJsxElements, walkAllDataIfJsx } from './data-if'
import { setupDts } from './dts'
import { DeepOptional, MagicOption, setOptions } from './options'
import { walkUseState, walkUseStateSetter } from './use-state'

export type { DeepOptional, MagicOption }

export function reactMagicKit(
  sourceCode: string,
  suffix: string,
  options?: DeepOptional<MagicOption>
) {
  if (!['js', 'ts', 'jsx', 'tsx'].includes(suffix)) {
    return sourceCode
  }

  setOptions(options)

  const res = oxc.parseSync(`index.${suffix}`, sourceCode, {
    astType: suffix.startsWith('ts') ? 'ts' : 'js',
    range: true,
  })
  if (res.errors.length > 0) {
    return sourceCode
  }

  dataIfJsxElements.length = 0
  const s = new MagicString(sourceCode)

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

  const dts = setupDts()
  if (dts) {
    writeFileSync(path.join(process.cwd(), dts.path), dts.content)
  }

  return s.toString()
}
