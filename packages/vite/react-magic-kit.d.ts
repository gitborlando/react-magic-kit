declare function useMagicState<T>(initialValue: T): T
declare function setTheState<T>(state: T, value: T | ((prev: T) => T)): void
