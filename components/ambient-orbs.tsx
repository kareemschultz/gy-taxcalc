"use client"

import { motion } from "framer-motion"

const blobs = [
  {
    className: "left-[8%] top-[10%] size-64 bg-emerald-500/10",
    duration: 18,
    delay: 0,
  },
  {
    className: "right-[4%] top-[26%] size-80 bg-cyan-500/10",
    duration: 22,
    delay: 2,
  },
  {
    className: "left-[34%] bottom-[6%] size-72 bg-lime-500/10",
    duration: 24,
    delay: 1,
  },
]

export function AmbientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          aria-hidden="true"
          className={`absolute rounded-full blur-3xl ${blob.className}`}
          initial={{ opacity: 0.35, scale: 0.95, y: 0 }}
          animate={{ opacity: [0.22, 0.34, 0.24], scale: [0.95, 1.05, 0.98], y: [0, -18, 0] }}
          transition={{
            duration: blob.duration,
            delay: blob.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
