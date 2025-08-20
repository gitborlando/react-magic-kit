import { defu } from 'defu'

export type MagicOption = {
  state:
    | false
    | {
        useState: string
        setState: string
      }
  dataIf: boolean
  dts: string
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
  dataIf: true,
  dts: 'react-magic-kit.d.ts',
}

export function setOptions(options?: DeepOptional<MagicOption>) {
  return (defaultOptions = defu(options, defaultOptions) as MagicOption)
}
