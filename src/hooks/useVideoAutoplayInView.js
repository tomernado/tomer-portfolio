import { useEffect, useRef } from 'react'

// Plays a <video> only while it's actually scrolled into view, pausing it
// otherwise — several project-preview videos can be mounted at once (the
// featured carousel plus the "explore more" grid, more once it's expanded),
// and letting each one autoplay unconditionally is a well-known way to
// exhaust Mobile Safari's video-decode memory and crash the page. This
// keeps the same "looping preview" effect for whatever's on-screen while
// capping how many videos are actively decoding at any moment.
export function useVideoAutoplayInView() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
