import MagicString from 'magic-string'
import { CallExpression, VariableDeclarator } from 'oxc-parser'
import { defaultOptions, state } from './options'

export function walkUseState(node: VariableDeclarator, s: MagicString) {
  if (!defaultOptions.state) return

  if (node.init?.type !== 'CallExpression') return
  if (node.init.callee.type !== 'Identifier') return
  if (node.init.callee.name !== defaultOptions.state.useState) return
  if (node.id.type !== 'Identifier') return

  const id = node.id.name
  const setter = `set${id[0].toUpperCase()}${id.slice(1)}`

  s.overwrite(...node.id.range!, `[${id}, ${setter}]`)
  s.overwrite(...node.init.callee.range!, `useState`)

  if (!state.isAddUseStateImport) {
    s.prepend(`import { useState } from 'react'\n`)
    state.isAddUseStateImport = true
  }
}

export function walkUseStateSetter(node: CallExpression, s: MagicString) {
  if (!defaultOptions.state) return

  if (node.callee.type !== 'Identifier') return
  if (node.callee.name !== defaultOptions.state.setState) return
  if (node.arguments.length !== 2) return
  if (node.arguments[0].type !== 'Identifier') return

  const id = node.arguments[0].name
  const setter = `set${id[0].toUpperCase()}${id.slice(1)}`

  s.overwrite(...node.callee.range!, setter)
  s.remove(node.arguments[0].start, node.arguments[1].end)
}
