"use client"

import { motion } from "framer-motion"

const blobs = [
  {
    className: "left-[-8%] top-[4%] size-[40rem] bg-emerald-400/24",
    duration: 22,
    delay: 0,
  },
  {
    className: "right-[-8%] top-[12%] size-[42rem] bg-cyan-400/20",
    duration: 28,
    delay: 2,
  },
  {
    className: "left-[18%] bottom-[-10%] size-[34rem] bg-lime-400/18",
    duration: 26,
    delay: 1,
  },
  {
    className: "right-[24%] bottom-[12%] size-[24rem] bg-emerald-300/12",
    duration: 18,
    delay: 3,
  },
  {
    className: "left-[44%] top-[34%] size-[18rem] bg-teal-400/14",
    duration: 24,
    delay: 4,
  },
]

export function AmbientOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(152_100%_55%/0.24),transparent_28%),radial-gradient(circle_at_bottom_right,hsl(180_100%_50%/0.18),transparent_34%),radial-gradient(circle_at_50%_15%,hsl(168_100%_55%/0.12),transparent_24%),linear-gradient(120deg,transparent_18%,hsl(160_90%_55%/0.06)_48%,transparent_78%)]"
        animate={{ opacity: [0.72, 1, 0.8] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-[-12%] top-[4%] size-[22rem] rounded-full bg-emerald-400/18 blur-3xl saturate-150 sm:hidden"
        animate={{ y: [0, -18, 0], x: [0, 8, 0], scale: [0.92, 1.05, 0.96] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute right-[-18%] top-[22%] size-[20rem] rounded-full bg-cyan-400/16 blur-3xl saturate-150 sm:hidden"
        animate={{ y: [0, 16, 0], x: [0, -10, 0], scale: [0.9, 1.07, 0.95] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          aria-hidden="true"
          className={`absolute rounded-full blur-3xl saturate-150 ${blob.className}`}
          initial={{ opacity: 0.4, scale: 0.9, y: 0, x: 0 }}
          animate={{
            opacity: [0.24, 0.44, 0.28],
            scale: [0.92, 1.08, 0.97],
            y: [0, -22, 0],
            x: [0, 12, 0],
            rotate: [0, 8, 0],
          }}
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
