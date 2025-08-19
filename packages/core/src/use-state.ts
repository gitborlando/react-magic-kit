import { ScopeContext, WalkerContext, WalkerHooks } from 'ast-walker-scope'
import MagicString from 'magic-string'
import { state } from './state'

type Node = Parameters<NonNullable<WalkerHooks['enter']>>[0]

export function walkUseStateDeclaration(
  this: WalkerContext & ScopeContext,
  node: Node,
  s: MagicString,
) {
  if (!state.needParseUseState) return
  if (node.type !== 'VariableDeclarator') return
  if (node.init?.type !== 'CallExpression') return
  if (node.init.callee.type !== 'Identifier') return
  if (node.init.callee.name !== state.useStateApi) return
  if (node.id.type !== 'Identifier') return
  const id = node.id.name
  const [idStart, idEnd] = [node.id.start!, node.id.end!]
  const [calleeStart, calleeEnd] = [node.init.callee.start!, node.init.callee.end!]
  const setter = `set${id[0].toUpperCase()}${id.slice(1)}`
  s.overwrite(idStart, idEnd, `[${id}, ${setter}]`)
  s.overwrite(calleeStart, calleeEnd, `useState`)
  if (!state.isAddUseStateImport) {
    s.prepend(`import { useState } from 'react'\n`)
    state.isAddUseStateImport = true
  }
}

export function walkUseStateSetter(
  this: WalkerContext & ScopeContext,
  node: Node,
  s: MagicString,
) {
  if (!state.needParseUseState) return
  if (node.type !== 'CallExpression') return
  if (node.callee.type !== 'Identifier') return
  if (node.callee.name !== state.setStateApi) return
  if (node.arguments.length !== 2) return
  if (node.arguments[0].type !== 'Identifier') return
  const id = node.arguments[0].name
  const callee = node.callee.name
  const idStart = node.arguments[0].start!
  const valueStart = node.arguments[1].start!
  const [calleeStart, calleeEnd] = [node.callee.start!, node.callee.end!]
  const setter = `set${id[0].toUpperCase()}${id.slice(1)}`
  s.overwrite(calleeStart, calleeEnd, setter)
  s.remove(idStart, valueStart)
}
