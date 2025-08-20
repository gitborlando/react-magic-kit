import { defaultOptions } from './options'

export function setupDts() {
  if (!defaultOptions.state || !defaultOptions.dts) return

  const { useState, setState } = defaultOptions.state

  const content = `
declare function ${useState}<T>(initialValue: T): T
declare function ${setState}<T>(state: T, value: T | ((prev: T) => T)): void
  `

  return { content: content.trim(), path: defaultOptions.dts }
}
