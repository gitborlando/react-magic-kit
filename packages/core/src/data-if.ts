import MagicString from 'magic-string'
import { JSXElement } from 'oxc-parser'
import { options } from 'packages/core/src/options'

export const dataIfJsxElements: JSXElement[] = []

export function collectDataIfJsx(node: JSXElement) {
  if (!options.dataIf) return

  const hasDataIf = node.openingElement.attributes.some(
    (attr) =>
      attr.type === 'JSXAttribute' &&
      attr.name.type === 'JSXIdentifier' &&
      attr.name.name === 'data-if',
  )
  if (!hasDataIf) return
  dataIfJsxElements.push(node)
}

export function walkAllDataIfJsx(s: MagicString) {
  dataIfJsxElements
    .sort((a, b) => b.start - a.start)
    .forEach((node) => walkDataIf(node, s))
  dataIfJsxElements.length = 0
}

function walkDataIf(node: JSXElement, s: MagicString) {
  let dataIfValue = ''

  for (const attr of node.openingElement.attributes) {
    if (
      attr.type === 'JSXAttribute' &&
      attr.name.type === 'JSXIdentifier' &&
      attr.name.name === 'data-if'
    ) {
      dataIfValue = s.slice(...attr.value!.range!)
      s.remove(...attr.range!)
      break
    }
  }

  if (dataIfValue) {
    const jsxValue = s.slice(...node.range!)
    const condition = dataIfValue.slice(1, -1)
    s.overwrite(...node.range!, `{Boolean(${condition}) && (${jsxValue})}`)
  }
}
