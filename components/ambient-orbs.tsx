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
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(152_100%_55%/0.18),transparent_30%),radial-gradient(circle_at_bottom_right,hsl(180_100%_50%/0.12),transparent_36%),linear-gradient(120deg,transparent_20%,hsl(160_90%_55%/0.04)_48%,transparent_76%)]"
        animate={{ opacity: [0.55, 0.95, 0.62] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          aria-hidden="true"
          className={`absolute rounded-full blur-3xl saturate-150 ${blob.className}`}
          initial={{ opacity: 0.4, scale: 0.9, y: 0, x: 0 }}
          animate={{
            opacity: [0.18, 0.32, 0.22],
            scale: [0.9, 1.08, 0.96],
            y: [0, -26, 0],
            x: [0, 14, 0],
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
