import { defu } from 'defu'

export type MagicOption = {
  state?:
    | false
    | {
        useState?: string
        setState?: string
      }
  dataIf?: boolean
  dts?: string
}

export const state = {
  isAddUseStateImport: false,
}

export let options: MagicOption = {
  state: {
    useState: 'useMagicState',
    setState: 'setMagicState',
  },
  dataIf: true,
  dts: 'react-magic-kit.d.ts',
}

export function setOptions(options?: MagicOption) {
  options = defu(options, options)
}
