"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Waypoint {
  x: number;
  y: number;
  label?: string;
}

interface RoutePathProps {
  waypoints: Waypoint[];
  className?: string;
  viewBox?: string;
}

function buildPath(points: Waypoint[]) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
}

export function RoutePath({
  waypoints,
  className,
  viewBox = "0 0 400 120",
}: RoutePathProps) {
  const d = buildPath(waypoints);

  return (
    <svg
      viewBox={viewBox}
      className={cn("w-full overflow-visible", className)}
      fill="none"
      aria-hidden="true"
    > 
      <motion.path
        d={d}
        stroke="var(--color-pine)"
        strokeWidth={1.5}
        strokeDasharray="1 7"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      {waypoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === 0 || i === waypoints.length - 1 ? 4 : 2.5}
          fill={i === 0 || i === waypoints.length - 1 ? "var(--color-brass)" : "var(--color-pine)"}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
        />
      ))}
    </svg>
  );
}
