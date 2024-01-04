export function useDebounces() {
  //   function useDebouncedRef(value: any, delay = 200) {
  //     const rawValueRef = ref(unref(value))
  //     let timerId = 0
  //     return computed({
  //       get: () => rawValueRef.value,
  //       set: (newValue) => {
  //         clearTimeout(timerId)
  //         timerId = setTimeout(() => (rawValueRef.value = newValue), delay)
  //       }
  //     })
  //   }
  function useDebouncedRef(value: any, delay = 200) {
    let timer = 0
    return customRef((track, trigger) => {
      return {
        get() {
          track()
          return value
        },
        set(newValue) {
          clearTimeout(timer)
          timer = setTimeout(() => {
            value = newValue
            trigger()
          }, delay)
        }
      }
    })
  }
  return { useDebouncedRef }
}
