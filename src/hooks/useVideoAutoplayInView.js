import { useEffect, useRef } from 'react'

// Plays a <video> only while it's actually scrolled into view, pausing it
// otherwise — several project-preview videos can be mounted at once (the
// featured carousel plus the "explore more" grid, more once it's expanded),
// and letting each one autoplay unconditionally is a well-known way to
// exhaust Mobile Safari's video-decode memory and crash the page. This
// keeps the same "looping preview" effect for whatever's on-screen while
// capping how many videos are actively decoding at any moment.
//
// Also retries the play() call once the video actually has enough data —
// calling play() the moment a card scrolls into view can lose the race
// against the video still buffering (especially on mobile networks), and
// a rejected play() promise with no retry left the card looking like it
// "didn't load" until the user scrolled away and back.
export function useVideoAutoplayInView() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let wantsToPlay = false

    const tryPlay = () => {
      if (wantsToPlay) el.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        wantsToPlay = entry.isIntersecting
        if (wantsToPlay) tryPlay()
        else el.pause()
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    el.addEventListener('canplay', tryPlay)
    el.addEventListener('loadeddata', tryPlay)

    return () => {
      observer.disconnect()
      el.removeEventListener('canplay', tryPlay)
      el.removeEventListener('loadeddata', tryPlay)
    }
  }, [])

  return ref
}
