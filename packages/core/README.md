# React Magic Kit - Core

基于 SWC 的高性能 JSX 解析和遍历库。

## 🚀 性能优势

- **极速解析**: 使用 Rust 编写的 SWC 解析器，比 Babel 快 20-100 倍
- **内存高效**: 优化的遍历算法，内存占用低
- **TypeScript 完全支持**: 原生 TSX 支持，完整的类型定义
- **简单易用**: 链式 API 设计，使用直观

## 📦 安装

```bash
pnpm add @swc/core magic-string
```

## 🎯 快速开始

### 基础用法

```typescript
import { parseJsxCode, quickProcessJsx } from 'react-magic-kit/core'

const jsxCode = `
function App() {
  const [count, setCount] = useState(0)
  return <div>Count: {count}</div>
}
`

// 方式1: 快速处理
quickProcessJsx(jsxCode, {
  onUseState: (node) => {
    console.log('发现 useState 调用')
  },
  onJSXElement: (node) => {
    console.log('JSX 元素:', node.opening?.name?.value)
  },
})

// 方式2: 高级处理
const ast = parseJsxCode(jsxCode)
// 使用 AST 进行更复杂的操作
```

### 链式 API

```typescript
import { JsxProcessor } from 'react-magic-kit/core'

const processor = new JsxProcessor()
  .onJSXElement((node) => {
    console.log('元素:', node.opening?.name?.value)
  })
  .onCallExpression((node) => {
    if (node.callee?.type === 'Identifier') {
      console.log('函数调用:', node.callee.value)
    }
  })
  .onJSXExpressionContainer((node) => {
    console.log('JSX 表达式')
  })

const ast = parseJsxCode(jsxCode)
processor.process(ast)
```

## 📊 性能对比

```typescript
import { runFullPerformanceSuite } from 'react-magic-kit/core'

// 运行完整的性能测试套件
runFullPerformanceSuite()
```

### 性能数据 (1000次解析)

| 解析器     | 时间    | 内存 |
| ---------- | ------- | ---- |
| SWC        | ~50ms   | 低   |
| Babel      | ~800ms  | 中等 |
| TypeScript | ~1200ms | 高   |

## 🔧 API 参考

### parseJsxCode(code: string)

解析 JSX/TSX 代码为 AST。

**参数:**

- `code`: JSX/TSX 代码字符串

**返回:** SWC AST 对象

```typescript
const ast = parseJsxCode(`<div>Hello</div>`)
```

### quickProcessJsx(code, callbacks)

快速处理 JSX 代码的便捷函数。

**参数:**

- `code`: JSX/TSX 代码字符串
- `callbacks`: 回调函数对象
  - `onUseState?`: useState 调用回调
  - `onJSXElement?`: JSX 元素回调
  - `onJSXExpression?`: JSX 表达式回调

```typescript
quickProcessJsx(code, {
  onUseState: (node) => {
    console.log('useState 参数:', node.arguments)
  },
})
```

### JsxProcessor

链式 API 处理器类。

**方法:**

- `onJSXElement(callback)`: 注册 JSX 元素访问者
- `onJSXExpressionContainer(callback)`: 注册 JSX 表达式访问者
- `onCallExpression(callback)`: 注册函数调用访问者
- `onVariableDeclarator(callback)`: 注册变量声明访问者
- `onIdentifier(callback)`: 注册标识符访问者
- `process(ast)`: 处理 AST

### transformJsxCode(code, transformer)

转换 JSX 代码。

**参数:**

- `code`: 源代码
- `transformer`: 转换函数

```typescript
const result = transformJsxCode(code, (program) => {
  // 修改 AST
  return program
})
```

## 🎯 使用场景

### 1. 代码分析工具

```typescript
// 分析组件中的状态使用
quickProcessJsx(componentCode, {
  onUseState: (node) => {
    // 记录状态变量
  },
  onJSXElement: (node) => {
    // 记录使用的组件
  },
})
```

### 2. 代码转换工具

```typescript
// 自动重构 useState 调用
transformJsxCode(code, (program) => {
  // 修改 AST 节点
  return program
})
```

### 3. 静态分析

```typescript
const processor = new JsxProcessor()
  .onJSXElement((node) => {
    // 检查可访问性
  })
  .onCallExpression((node) => {
    // 检查函数使用
  })
```

## ⚡ 性能优化技巧

1. **批量处理**: 一次解析多个文件而不是逐个处理
2. **缓存 AST**: 对于重复分析的文件，缓存解析结果
3. **选择性遍历**: 只注册需要的访问者，避免不必要的遍历
4. **内存管理**: 及时释放大型 AST 对象

```typescript
// 好的做法
const ast = parseJsxCode(code)
processor.process(ast)
// AST 会自动被垃圾回收

// 避免的做法 - 不要缓存太多大型 AST
const cache = new Map() // 可能导致内存泄漏
```

## 🧪 测试和调试

### 运行性能测试

```bash
# 在项目中运行
pnpm test:performance
```

### 调试模式

```typescript
// 启用详细日志
process.env.DEBUG_JSX = 'true'

quickProcessJsx(code, {
  onJSXElement: (node) => {
    console.log('调试:', node)
  },
})
```

## 🔗 相关链接

- [SWC 官方文档](https://swc.rs/)
- [TypeScript AST 查看器](https://ts-ast-viewer.com/)
- [JSX 规范](https://facebook.github.io/jsx/)

## 📄 许可证

ISC
