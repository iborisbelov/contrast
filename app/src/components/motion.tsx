import { motion, type Variants } from 'framer-motion'
import { Children, type ReactNode } from 'react'

export const EASE = [0.2, 0.7, 0.2, 1] as const

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } }
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

/** Children rise in one after another — used whenever a new question/screen appears. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={list} initial="hidden" animate="show">
      {Children.toArray(children).filter(Boolean).map((c, i) => <motion.div key={i} variants={item}>{c}</motion.div>)}
    </motion.div>
  )
}

export const Rise = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
  <motion.div className={className} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: EASE, delay }}>
    {children}
  </motion.div>
)
