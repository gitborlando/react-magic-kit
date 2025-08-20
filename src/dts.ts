import { defaultOptions } from './options'

export function setupDts() {
  if (!defaultOptions.state) return

  const { useState, setState } = defaultOptions.state

  const content = `
  declare function ${useState}<T>(initialValue: T): T
  declare function ${setState}<T>(id: T, value: T | ((prev: T) => T)): void
  `

  return { content, path: defaultOptions.dts }
}
