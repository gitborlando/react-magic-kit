import { walk } from 'ast-walker-scope'
import MagicString from 'magic-string'
import { MagicOption, setState, state } from './state'
import { walkUseStateDeclaration, walkUseStateSetter } from './use-state'

export default function reactMagicKit(code: string, options?: MagicOption) {
  setState(options)

  const s = new MagicString(code)
  walk(
    code,
    {
      enter(this, node) {
        switch (node.type) {
          case 'VariableDeclarator':
            walkUseStateDeclaration.call(this, node, s)
            break
          case 'CallExpression':
            walkUseStateSetter.call(this, node, s)
            break
        }
      },
    },
    {
      parserPlugins: state.parserPlugins,
    },
  )
  return s.toString()
}

console.log(
  reactMagicKit(`
function App() {
  const count = useMagicState(0)
  const click = () => {
    setMagicState(count, (prev) => prev + 1)
  }
  return <div onClick={click}>{count}</div>
}
`),
)
