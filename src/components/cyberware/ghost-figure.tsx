"use client";

import { cn } from "@/lib/utils";
import type { SubsystemKey } from "@/types";

interface GhostFigureProps {
  activeRegion: SubsystemKey | null;
  onRegionClick: (key: SubsystemKey) => void;
  onRegionHover: (key: SubsystemKey | null) => void;
  className?: string;
}

/**
 * Geometric android silhouette with 8 interactive body regions.
 * Uses inline SVG for event handlers and dynamic glow effects.
 */
export function GhostFigure({
  activeRegion,
  onRegionClick,
  onRegionHover,
  className,
}: GhostFigureProps) {
  return (
    <svg
      viewBox="0 0 300 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full max-w-[300px]", className)}
    >
      <defs>
        <filter id="glow-primary">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="oklch(0.72 0.22 330)" floodOpacity="0.5" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glow-accent">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="oklch(0.78 0.155 180)" floodOpacity="0.4" />
          <feComposite in2="blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Circuit traces (background decoration) ── */}
      <g className="animate-circuit-pulse" opacity="0.25">
        {/* Spine trace */}
        <line x1="150" y1="95" x2="150" y2="420" stroke="oklch(0.78 0.155 180)" strokeWidth="0.5" strokeDasharray="3 6" />
        {/* Shoulder traces */}
        <line x1="105" y1="155" x2="55" y2="185" stroke="oklch(0.78 0.155 180)" strokeWidth="0.5" strokeDasharray="3 6" />
        <line x1="195" y1="155" x2="245" y2="185" stroke="oklch(0.78 0.155 180)" strokeWidth="0.5" strokeDasharray="3 6" />
        {/* Hip traces */}
        <line x1="125" y1="310" x2="110" y2="380" stroke="oklch(0.78 0.155 180)" strokeWidth="0.5" strokeDasharray="3 6" />
        <line x1="175" y1="310" x2="190" y2="380" stroke="oklch(0.78 0.155 180)" strokeWidth="0.5" strokeDasharray="3 6" />
        {/* Cross traces */}
        <line x1="115" y1="180" x2="185" y2="220" stroke="oklch(0.78 0.155 180)" strokeWidth="0.3" strokeDasharray="2 8" />
        <line x1="185" y1="180" x2="115" y2="220" stroke="oklch(0.78 0.155 180)" strokeWidth="0.3" strokeDasharray="2 8" />
      </g>

      {/* ── Firewall / outer shell (aura boundary) ── */}
      <Region
        regionKey="firewall"
        active={activeRegion === "firewall"}
        onClick={onRegionClick}
        onHover={onRegionHover}
      >
        <ellipse
          cx="150" cy="250"
          rx="135" ry="230"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          fill="oklch(0.78 0.155 180 / 0.02)"
          className="transition-all duration-300"
        />
        <text x="270" y="252" className="region-label" textAnchor="start">FW</text>
      </Region>

      {/* ── Head / Cortex ── */}
      <Region
        regionKey="cortex"
        active={activeRegion === "cortex"}
        onClick={onRegionClick}
        onHover={onRegionHover}
      >
        {/* Hexagonal head */}
        <polygon
          points="150,30 180,48 180,84 150,102 120,84 120,48"
          fill="oklch(0.78 0.155 180 / 0.06)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.8"
          className="transition-all duration-300"
        />
        {/* Inner hex detail */}
        <polygon
          points="150,42 168,53 168,75 150,86 132,75 132,53"
          fill="none"
          stroke="oklch(0.78 0.155 180 / 0.3)"
          strokeWidth="0.5"
        />
      </Region>

      {/* ── Eyes / Optics ── */}
      <Region
        regionKey="optics"
        active={activeRegion === "optics"}
        onClick={onRegionClick}
        onHover={onRegionHover}
      >
        {/* Left eye slit */}
        <rect x="133" y="58" width="10" height="3" rx="1"
          fill="oklch(0.78 0.155 180 / 0.6)"
          className="transition-all duration-300"
        />
        {/* Right eye slit */}
        <rect x="157" y="58" width="10" height="3" rx="1"
          fill="oklch(0.78 0.155 180 / 0.6)"
          className="transition-all duration-300"
        />
      </Region>

      {/* ── Brain area / Neural Mesh (surrounding head) ── */}
      <Region
        regionKey="neural-mesh"
        active={activeRegion === "neural-mesh"}
        onClick={onRegionClick}
        onHover={onRegionHover}
      >
        <ellipse
          cx="150" cy="66"
          rx="48" ry="32"
          fill="none"
          stroke="oklch(0.78 0.155 180 / 0.15)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          className="transition-all duration-300"
        />
      </Region>

      {/* ── Throat / Vocoder ── */}
      <Region
        regionKey="vocoder"
        active={activeRegion === "vocoder"}
        onClick={onRegionClick}
        onHover={onRegionHover}
      >
        <rect x="140" y="104" width="20" height="18" rx="3"
          fill="oklch(0.78 0.155 180 / 0.06)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.5"
          className="transition-all duration-300"
        />
        {/* Voice lines */}
        <line x1="144" y1="109" x2="156" y2="109" stroke="oklch(0.78 0.155 180 / 0.3)" strokeWidth="0.5" />
        <line x1="144" y1="113" x2="156" y2="113" stroke="oklch(0.78 0.155 180 / 0.3)" strokeWidth="0.5" />
        <line x1="144" y1="117" x2="156" y2="117" stroke="oklch(0.78 0.155 180 / 0.3)" strokeWidth="0.5" />
      </Region>

      {/* ── Torso / Skill Matrix ── */}
      <Region
        regionKey="skill-matrix"
        active={activeRegion === "skill-matrix"}
        onClick={onRegionClick}
        onHover={onRegionHover}
      >
        {/* Main torso block */}
        <path
          d="M105,135 L195,135 L190,310 L110,310 Z"
          fill="oklch(0.78 0.155 180 / 0.04)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.8"
          className="transition-all duration-300"
        />
        {/* Inner chest detail */}
        <rect x="125" y="165" width="50" height="40" rx="4"
          fill="none"
          stroke="oklch(0.78 0.155 180 / 0.2)"
          strokeWidth="0.5"
        />
        {/* Core circle */}
        <circle cx="150" cy="185" r="8"
          fill="oklch(0.72 0.22 330 / 0.1)"
          stroke="oklch(0.72 0.22 330 / 0.4)"
          strokeWidth="0.5"
        />
        <circle cx="150" cy="185" r="3"
          fill="oklch(0.72 0.22 330 / 0.3)"
        />
      </Region>

      {/* ── Arms / Manipulators ── */}
      <Region
        regionKey="manipulators"
        active={activeRegion === "manipulators"}
        onClick={onRegionClick}
        onHover={onRegionHover}
      >
        {/* Left arm */}
        <path
          d="M105,140 L55,180 L45,260 L55,265 L65,190 L105,155"
          fill="oklch(0.78 0.155 180 / 0.04)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.8"
          className="transition-all duration-300"
        />
        {/* Left hand */}
        <rect x="38" y="260" width="22" height="14" rx="4"
          fill="oklch(0.78 0.155 180 / 0.06)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.5"
        />
        {/* Right arm */}
        <path
          d="M195,140 L245,180 L255,260 L245,265 L235,190 L195,155"
          fill="oklch(0.78 0.155 180 / 0.04)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.8"
          className="transition-all duration-300"
        />
        {/* Right hand */}
        <rect x="240" y="260" width="22" height="14" rx="4"
          fill="oklch(0.78 0.155 180 / 0.06)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.5"
        />
      </Region>

      {/* ── Spine / Reflex Arc ── */}
      <Region
        regionKey="reflex-arc"
        active={activeRegion === "reflex-arc"}
        onClick={onRegionClick}
        onHover={onRegionHover}
      >
        {/* Spine vertebrae nodes */}
        {[155, 195, 235, 275].map((y) => (
          <circle key={y} cx="150" cy={y} r="3"
            fill="oklch(0.78 0.155 180 / 0.15)"
            stroke="oklch(0.78 0.155 180 / 0.4)"
            strokeWidth="0.5"
          />
        ))}
      </Region>

      {/* ── Legs (visual only — not a subsystem) ── */}
      <g opacity="0.4">
        {/* Left leg */}
        <path
          d="M110,310 L100,420 L95,480 L115,480 L115,425 L130,310"
          fill="oklch(0.78 0.155 180 / 0.03)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.6"
        />
        {/* Right leg */}
        <path
          d="M190,310 L200,420 L205,480 L185,480 L185,425 L170,310"
          fill="oklch(0.78 0.155 180 / 0.03)"
          stroke="oklch(0.78 0.155 180)"
          strokeWidth="0.6"
        />
      </g>

      {/* ── Region labels ── */}
      <g className="pointer-events-none">
        <Label x={78} y={34} text="CORTEX" align="end" regionKey="cortex" active={activeRegion} />
        <Label x={222} y={52} text="NEURAL MESH" align="start" regionKey="neural-mesh" active={activeRegion} />
        <Label x={78} y={62} text="OPTICS" align="end" regionKey="optics" active={activeRegion} />
        <Label x={222} y={115} text="VOCODER" align="start" regionKey="vocoder" active={activeRegion} />
        <Label x={18} y={220} text="MANIPULATORS" align="start" regionKey="manipulators" active={activeRegion} />
        <Label x={222} y={190} text="SKILL MATRIX" align="start" regionKey="skill-matrix" active={activeRegion} />
        <Label x={222} y={250} text="REFLEX ARC" align="start" regionKey="reflex-arc" active={activeRegion} />
        <Label x={278} y={290} text="FIREWALL" align="end" regionKey="firewall" active={activeRegion} />
      </g>
    </svg>
  );
}

/* ── Helper: interactive region wrapper ── */

interface RegionProps {
  regionKey: SubsystemKey;
  active: boolean;
  onClick: (key: SubsystemKey) => void;
  onHover: (key: SubsystemKey | null) => void;
  children: React.ReactNode;
}

function Region({ regionKey, active, onClick, onHover, children }: RegionProps) {
  return (
    <g
      className={cn(
        "cursor-pointer transition-all duration-300",
        active && "cyberware-region-active"
      )}
      onClick={() => onClick(regionKey)}
      onMouseEnter={() => onHover(regionKey)}
      onMouseLeave={() => onHover(null)}
      filter={active ? "url(#glow-primary)" : undefined}
    >
      {children}
    </g>
  );
}

/* ── Helper: region label ── */

interface LabelProps {
  x: number;
  y: number;
  text: string;
  align: "start" | "end";
  regionKey: SubsystemKey;
  active: SubsystemKey | null;
}

function Label({ x, y, text, align, regionKey, active }: LabelProps) {
  const isActive = active === regionKey;
  return (
    <text
      x={x}
      y={y}
      textAnchor={align}
      fill={isActive ? "oklch(0.72 0.22 330)" : "oklch(0.78 0.155 180 / 0.5)"}
      fontSize="8"
      fontFamily="var(--font-mono)"
      letterSpacing="0.1em"
      className="uppercase transition-colors duration-300"
    >
      {text}
    </text>
  );
}
