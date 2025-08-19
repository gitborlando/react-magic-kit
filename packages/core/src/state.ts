import { ParseOptions } from 'ast-walker-scope'

export type MagicOption = {
  state:
    | boolean
    | {
        useState?: string
        setState?: string
      }
  if:
    | boolean
    | {
        if: string
      }
  classPlaceholder:
    | boolean
    | {
        classPlaceholder: string
      }
  parserPlugins?: ParseOptions['parserPlugins']
}

export const state = {
  needParseUseState: true,
  needParseIf: true,
  needParseClassPlaceholder: true,

  useStateApi: 'useMagicState',
  setStateApi: 'setMagicState',
  jsxIfApi: 'if',
  jsxClassPlaceholderApi: '&',
  parserPlugins: ['typescript', 'jsx'] as NonNullable<ParseOptions['parserPlugins']>,

  isAddUseStateImport: false,
  isStateInit: false,
}

export function setState(options?: MagicOption) {
  if (!options) return
  if (state.isStateInit) return

  state.needParseUseState = !!options.state || state.needParseUseState
  state.needParseIf = !!options.if || state.needParseIf
  state.needParseClassPlaceholder =
    !!options.classPlaceholder || state.needParseClassPlaceholder

  if (options.state && typeof options.state === 'object') {
    state.useStateApi = options.state.useState || state.useStateApi
    state.setStateApi = options.state.setState || state.setStateApi
  }
  if (options.if && typeof options.if === 'object') {
    state.jsxIfApi = options.if.if || state.jsxIfApi
  }
  if (options.classPlaceholder && typeof options.classPlaceholder === 'object') {
    state.jsxClassPlaceholderApi = options.classPlaceholder.classPlaceholder
  }
  if (options.parserPlugins && Array.isArray(options.parserPlugins)) {
    state.parserPlugins.push(...options.parserPlugins)
  }
  state.isStateInit = true
}
