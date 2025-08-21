import MagicString from 'magic-string'
import { JSXElement, type Node } from 'oxc-parser'
import { defaultOptions } from './options'

type DataIfJsxInfo = {
  node: JSXElement
  parent: Node | null
}

export const dataIfJsxInfo: DataIfJsxInfo[] = []

export function collectDataIfJsx(node: JSXElement, parent: Node | null) {
  const hasDataIf = node.openingElement.attributes.some(
    (attr) =>
      attr.type === 'JSXAttribute' &&
      attr.name.type === 'JSXIdentifier' &&
      attr.name.name === defaultOptions.if,
  )
  if (!hasDataIf) return
  dataIfJsxInfo.push({ node, parent })
}

export function walkAllDataIfJsx(s: MagicString) {
  dataIfJsxInfo
    .sort((a, b) => b.node.start - a.node.start)
    .forEach((info) => walkDataIf(info, s))
  dataIfJsxInfo.length = 0
}

function walkDataIf(info: DataIfJsxInfo, s: MagicString) {
  const { node, parent } = info
  let dataIfValue = ''

  for (const attr of node.openingElement.attributes) {
    if (
      attr.type === 'JSXAttribute' &&
      attr.name.type === 'JSXIdentifier' &&
      attr.name.name === defaultOptions.if
    ) {
      dataIfValue = s.slice(...attr.value!.range!)
      s.remove(...attr.range!)
      break
    }
  }

  if (dataIfValue) {
    const jsxValue = s.slice(...node.range!)
    const condition = dataIfValue.slice(1, -1)
    if (parent?.type === 'JSXElement' || parent?.type === 'JSXFragment') {
      s.overwrite(...node.range!, `{Boolean(${condition}) && (${jsxValue})}`)
    } else {
      s.overwrite(...node.range!, `(Boolean(${condition}) && (${jsxValue}))`)
    }
  }
}
