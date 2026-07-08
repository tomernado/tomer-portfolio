import { useState, useEffect } from 'react'

// Gates desktop-only visual richness (animated blur glows, the hero's 3D
// scene). Mobile GPUs choke on multiple concurrent `filter: blur()` layers
// running infinite-loop animations — that's what caused the hero scene to
// hang phones earlier, and the same pattern (now compounded across
// Skills/Web4You/Contact's ambient glow blobs) causes Mobile Safari to
// repeatedly crash the page. Checks actual mount, not just CSS breakpoints,
// so the expensive subtree never gets created on small screens at all.
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? true : window.matchMedia('(min-width: 1024px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isDesktop
}
