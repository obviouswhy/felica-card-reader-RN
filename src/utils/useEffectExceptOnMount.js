import React from 'react'

export const useEffectExceptOnMount = (effect, dependencies) => {
  const mounted = React.useRef(false)
  React.useEffect(() => {
    if (mounted.current) {
      const unmount = effect()
      return () => unmount && unmount()
    } else {
      mounted.current = true
    }
  }, dependencies)

  // Reset on unmount for the next mount.
  React.useEffect(() => {
    return () => (mounted.current = false)
  }, [])
}
