"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  target: number
  suffix?: string
  duration?: number
}

export default function AnimatedCounter({
  target,
  suffix = "",
  duration = 1800,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true
            let start: number | null = null

            const step = (timestamp: number) => {
              if (start === null) start = timestamp
              const progress = Math.min((timestamp - start) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setValue(Math.floor(eased * target))
              if (progress < 1) requestAnimationFrame(step)
            }

            requestAnimationFrame(step)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className="font-display" style={{ fontWeight: 700 }}>
      {value.toLocaleString()}
      {suffix}
    </span>
  )
}
