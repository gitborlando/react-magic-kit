import { defu } from 'defu'

export type MagicOption = {
  state:
    | false
    | {
        useState: string
        setState: string
      }
  dts: string | false
  if: string
}

export type DeepOptional<T> = {
  [K in keyof T]?: DeepOptional<T[K]>
}

export const state = {
  isAddUseStateImport: false,
}

export let defaultOptions: MagicOption = {
  state: {
    useState: 'useMagicState',
    setState: 'setMagicState',
  },
  if: 'magic-if',
  dts: 'react-magic-kit.d.ts',
}

export function setOptions(options?: DeepOptional<MagicOption>) {
  return (defaultOptions = defu(options, defaultOptions) as MagicOption)
}
