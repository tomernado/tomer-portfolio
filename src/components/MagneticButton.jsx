import { motion } from 'framer-motion'
import { useMagnetic } from '../hooks/useMagnetic'

/**
 * Drop-in wrapper: pass `as="a"` for links, defaults to a button.
 * Wraps children in a magnetic-pull container; the inner content shifts
 * slightly less than the outer bound for a subtle layered-depth feel.
 */
export default function MagneticButton({ as = 'button', className = '', children, strength = 0.25, style: styleProp, ...props }) {
  const { ref, style, onMouseMove, onMouseLeave } = useMagnetic(strength)
  const Tag = motion[as] ?? motion.button

  return (
    <Tag
      ref={ref}
      style={{ ...styleProp, ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </Tag>
  )
}
