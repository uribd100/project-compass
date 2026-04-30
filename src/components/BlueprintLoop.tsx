import { useEffect, useState } from 'react';
import { Building2, HardHat, Layers, Ruler } from 'lucide-react';

interface BlueprintLoopProps {
  className?: string;
  /** When true, dims the visual so it works as a calm background. */
  dimmed?: boolean;
  /** When true, hides the floating UI overlays (progress chips). */
  hideOverlays?: boolean;
}

const LOOP_DURATION_S = 24;

const ROOM_LABELS = [
  { x: 120, y: 110, label: 'סלון' },
  { x: 320, y: 110, label: 'מטבח' },
  { x: 480, y: 110, label: 'מרפסת' },
  { x: 120, y: 260, label: 'חדר שינה' },
  { x: 320, y: 260, label: 'חדר עבודה' },
  { x: 480, y: 260, label: 'שירותים' },
];

const FLOORS = [0, 1, 2, 3, 4, 5];

export function BlueprintLoop({
  className = '',
  dimmed = false,
  hideOverlays = false,
}: BlueprintLoopProps) {
  const [progress, setProgress] = useState(0);
  const [floor, setFloor] = useState(1);
  const [taskCount, setTaskCount] = useState(12);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = ((now - start) / 1000) % LOOP_DURATION_S;
      const t = elapsed / LOOP_DURATION_S;
      setProgress(Math.round(t * 100));
      setFloor(Math.min(FLOORS.length, Math.max(1, Math.ceil(t * FLOORS.length))));
      setTaskCount(8 + Math.round(Math.sin(t * Math.PI * 2) * 5 + 5));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`blueprint-loop relative w-full h-full overflow-hidden ${
        dimmed ? 'opacity-60' : ''
      } ${className}`}
    >
      {/* Deep gradient backdrop */}
      <div className="absolute inset-0 blueprint-bg" />

      {/* Grid lines - subtle technical paper feel */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="bp-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="hsl(var(--primary) / 0.15)"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="bp-grid-major"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 200 0 L 0 0 0 200"
              fill="none"
              stroke="hsl(var(--primary) / 0.25)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="bp-vignette" cx="50%" cy="50%" r="65%">
            <stop offset="60%" stopColor="hsl(var(--primary) / 0)" />
            <stop offset="100%" stopColor="hsl(220 50% 8% / 0.55)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bp-grid)" />
        <rect width="100%" height="100%" fill="url(#bp-grid-major)" />
        <rect width="100%" height="100%" fill="url(#bp-vignette)" />
      </svg>

      {/* ===== PHASE A: 2D BLUEPRINT — drawing itself ===== */}
      <svg
        viewBox="0 0 600 400"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full bp-phase-blueprint"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          fill="none"
          stroke="hsl(198 93% 70%)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer walls */}
          <path
            className="bp-line"
            d="M 60 60 L 540 60 L 540 340 L 60 340 Z"
            style={{ ['--bp-len' as string]: '1520', ['--bp-delay' as string]: '0s' }}
          />
          {/* Inner partitions */}
          <path
            className="bp-line"
            d="M 60 200 L 540 200"
            style={{ ['--bp-len' as string]: '480', ['--bp-delay' as string]: '0.4s' }}
          />
          <path
            className="bp-line"
            d="M 220 60 L 220 200"
            style={{ ['--bp-len' as string]: '140', ['--bp-delay' as string]: '0.8s' }}
          />
          <path
            className="bp-line"
            d="M 420 60 L 420 200"
            style={{ ['--bp-len' as string]: '140', ['--bp-delay' as string]: '1.0s' }}
          />
          <path
            className="bp-line"
            d="M 220 200 L 220 340"
            style={{ ['--bp-len' as string]: '140', ['--bp-delay' as string]: '1.2s' }}
          />
          <path
            className="bp-line"
            d="M 420 200 L 420 340"
            style={{ ['--bp-len' as string]: '140', ['--bp-delay' as string]: '1.4s' }}
          />

          {/* Door arcs */}
          <path
            className="bp-line"
            d="M 145 200 A 25 25 0 0 1 170 175"
            style={{ ['--bp-len' as string]: '40', ['--bp-delay' as string]: '1.8s' }}
          />
          <path
            className="bp-line"
            d="M 325 200 A 25 25 0 0 1 350 175"
            style={{ ['--bp-len' as string]: '40', ['--bp-delay' as string]: '1.9s' }}
          />
          <path
            className="bp-line"
            d="M 445 200 A 25 25 0 0 1 470 175"
            style={{ ['--bp-len' as string]: '40', ['--bp-delay' as string]: '2.0s' }}
          />

          {/* Windows */}
          <path
            className="bp-line"
            d="M 100 60 L 180 60 M 260 60 L 380 60 M 460 60 L 510 60"
            style={{ ['--bp-len' as string]: '250', ['--bp-delay' as string]: '2.2s' }}
            stroke="hsl(45 95% 65%)"
            strokeWidth="2.5"
          />
        </g>

        {/* Dimension lines */}
        <g
          fill="none"
          stroke="hsl(198 93% 70% / 0.55)"
          strokeWidth="0.6"
        >
          <path
            className="bp-line"
            d="M 60 30 L 540 30 M 60 24 L 60 36 M 540 24 L 540 36"
            style={{ ['--bp-len' as string]: '500', ['--bp-delay' as string]: '2.6s' }}
          />
          <path
            className="bp-line"
            d="M 30 60 L 30 340 M 24 60 L 36 60 M 24 340 L 36 340"
            style={{ ['--bp-len' as string]: '300', ['--bp-delay' as string]: '2.8s' }}
          />
        </g>
        <g
          fontFamily="'Space Mono', monospace"
          fill="hsl(198 93% 80%)"
          fontSize="9"
          textAnchor="middle"
          className="bp-fade-in"
          style={{ ['--bp-delay' as string]: '3.0s' }}
        >
          <text x="300" y="22">12.40 מ׳</text>
          <text x="22" y="205" transform="rotate(-90 22 205)">8.20 מ׳</text>
        </g>

        {/* Room labels */}
        {ROOM_LABELS.map((r, i) => (
          <text
            key={r.label}
            x={r.x}
            y={r.y}
            textAnchor="middle"
            fontFamily="'Heebo', sans-serif"
            fontSize="11"
            fontWeight="500"
            fill="hsl(198 93% 85%)"
            className="bp-fade-in"
            style={{ ['--bp-delay' as string]: `${3.2 + i * 0.15}s` }}
          >
            {r.label}
          </text>
        ))}
      </svg>

      {/* ===== PHASE B: ISOMETRIC BUILDING — rises from blueprint ===== */}
      <svg
        viewBox="-300 -300 600 600"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full bp-phase-building"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bp-face-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(198 93% 60% / 0.9)" />
            <stop offset="100%" stopColor="hsl(215 35% 28% / 0.95)" />
          </linearGradient>
          <linearGradient id="bp-face-side" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(215 35% 38%)" />
            <stop offset="100%" stopColor="hsl(215 35% 18%)" />
          </linearGradient>
          <linearGradient id="bp-face-top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(198 93% 75%)" />
            <stop offset="100%" stopColor="hsl(198 93% 50%)" />
          </linearGradient>
        </defs>

        {/* Ground plate */}
        <g className="bp-ground">
          <polygon
            points="-180,90 0,180 180,90 0,0"
            fill="hsl(215 35% 12% / 0.8)"
            stroke="hsl(198 93% 70% / 0.5)"
            strokeWidth="1"
          />
        </g>

        {/* Floors rising one by one */}
        {FLOORS.map((f, i) => {
          const floorH = 32;
          const baseY = -i * floorH;
          return (
            <g
              key={f}
              className="bp-floor"
              style={{ ['--bp-delay' as string]: `${5.2 + i * 0.55}s` }}
            >
              {/* Front face */}
              <polygon
                points={`-180,${90 + baseY} 0,${180 + baseY} 0,${180 + baseY - floorH} -180,${90 + baseY - floorH}`}
                fill="url(#bp-face-front)"
                stroke="hsl(198 93% 80%)"
                strokeWidth="0.8"
              />
              {/* Side face */}
              <polygon
                points={`0,${180 + baseY} 180,${90 + baseY} 180,${90 + baseY - floorH} 0,${180 + baseY - floorH}`}
                fill="url(#bp-face-side)"
                stroke="hsl(198 93% 80%)"
                strokeWidth="0.8"
              />
              {/* Window dots front */}
              {[0, 1, 2, 3].map((w) => (
                <circle
                  key={`fw-${w}`}
                  cx={-150 + w * 40}
                  cy={90 + baseY + (w * 22.5) - floorH / 2 + 8}
                  r="2.5"
                  fill="hsl(45 95% 70%)"
                  className="bp-window"
                  style={{ ['--bp-delay' as string]: `${5.8 + i * 0.55 + w * 0.08}s` }}
                />
              ))}
              {/* Window dots side */}
              {[0, 1, 2, 3].map((w) => (
                <circle
                  key={`sw-${w}`}
                  cx={30 + w * 40}
                  cy={172 + baseY - (w * 22.5) - floorH / 2 + 8}
                  r="2.5"
                  fill="hsl(45 95% 70%)"
                  className="bp-window"
                  style={{ ['--bp-delay' as string]: `${5.85 + i * 0.55 + w * 0.08}s` }}
                />
              ))}
            </g>
          );
        })}

        {/* Roof - appears last */}
        <g
          className="bp-roof"
          style={{ ['--bp-delay' as string]: `${5.2 + FLOORS.length * 0.55}s` }}
        >
          <polygon
            points={`-180,${90 - FLOORS.length * 32} 0,${180 - FLOORS.length * 32} 180,${90 - FLOORS.length * 32} 0,${0 - FLOORS.length * 32}`}
            fill="url(#bp-face-top)"
            stroke="hsl(198 93% 90%)"
            strokeWidth="1"
          />
        </g>

        {/* Crane */}
        <g className="bp-crane">
          <line
            x1="220"
            y1="200"
            x2="220"
            y2="-220"
            stroke="hsl(45 95% 60%)"
            strokeWidth="3"
          />
          <line
            x1="60"
            y1="-220"
            x2="280"
            y2="-220"
            stroke="hsl(45 95% 60%)"
            strokeWidth="3"
          />
          <line
            x1="220"
            y1="-220"
            x2="280"
            y2="-180"
            stroke="hsl(45 95% 60%)"
            strokeWidth="2"
          />
          <g className="bp-crane-hook">
            <line
              x1="0"
              y1="-220"
              x2="0"
              y2="-100"
              stroke="hsl(45 95% 60%)"
              strokeWidth="1"
            />
            <rect x="-8" y="-100" width="16" height="10" fill="hsl(45 95% 50%)" />
          </g>
        </g>

        {/* Data flow particles streaming up the building (subtle network feel) */}
        <g className="bp-particles">
          {[0, 1, 2, 3, 4].map((p) => (
            <circle
              key={`p-${p}`}
              cx={-90 + p * 45}
              cy="0"
              r="2"
              fill="hsl(198 93% 80%)"
              className="bp-particle"
              style={{ ['--bp-delay' as string]: `${6 + p * 0.4}s` }}
            />
          ))}
        </g>
      </svg>

      {/* ===== Floating UI overlays (ghost cards) ===== */}
      {!hideOverlays && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 right-6 bp-overlay bp-overlay-1">
            <GhostChip
              icon={<Building2 className="w-4 h-4" />}
              label="פרויקט פעיל"
              value="מגדל הרצליה"
            />
          </div>

          <div className="absolute top-6 left-6 bp-overlay bp-overlay-2">
            <GhostChip
              icon={<Layers className="w-4 h-4" />}
              label="קומה בבנייה"
              value={`${floor} / ${FLOORS.length}`}
            />
          </div>

          <div className="absolute bottom-6 right-6 bp-overlay bp-overlay-3">
            <GhostChip
              icon={<Ruler className="w-4 h-4" />}
              label="התקדמות"
              value={`${progress}%`}
              progress={progress}
            />
          </div>

          <div className="absolute bottom-6 left-6 bp-overlay bp-overlay-4">
            <GhostChip
              icon={<HardHat className="w-4 h-4" />}
              label="משימות פתוחות"
              value={`${taskCount}`}
            />
          </div>
        </div>
      )}

      {/* Scanning line for "active system" feel */}
      <div className="absolute inset-x-0 bp-scanline pointer-events-none" />

      <style>{`
        .blueprint-loop { background: hsl(220 45% 10%); }
        .blueprint-bg {
          background:
            radial-gradient(ellipse at 30% 20%, hsl(200 80% 25% / 0.55), transparent 55%),
            radial-gradient(ellipse at 75% 80%, hsl(215 60% 18% / 0.6), transparent 55%),
            linear-gradient(135deg, hsl(220 45% 9%), hsl(215 45% 13%));
        }

        /* Phase visibility - the loop choreography */
        .bp-phase-blueprint {
          animation: bpPhaseBlueprint ${LOOP_DURATION_S}s linear infinite;
        }
        .bp-phase-building {
          animation: bpPhaseBuilding ${LOOP_DURATION_S}s linear infinite;
          opacity: 0;
        }
        @keyframes bpPhaseBlueprint {
          0%   { opacity: 0; }
          10%  { opacity: 1; }
          40%  { opacity: 1; }
          55%  { opacity: 0.15; }
          88%  { opacity: 0.15; }
          95%  { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes bpPhaseBuilding {
          0%   { opacity: 0; transform: translateY(20px); }
          18%  { opacity: 0; transform: translateY(20px); }
          40%  { opacity: 0.4; transform: translateY(0); }
          55%  { opacity: 1; transform: translateY(0); }
          85%  { opacity: 1; transform: translateY(0); }
          95%  { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        /* Self-drawing line technique */
        .bp-line {
          stroke-dasharray: var(--bp-len);
          stroke-dashoffset: var(--bp-len);
          animation: bpDraw ${LOOP_DURATION_S}s linear infinite;
          animation-delay: var(--bp-delay, 0s);
        }
        @keyframes bpDraw {
          0%   { stroke-dashoffset: var(--bp-len); }
          15%  { stroke-dashoffset: 0; }
          85%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: var(--bp-len); }
        }

        .bp-fade-in {
          opacity: 0;
          animation: bpFadeIn ${LOOP_DURATION_S}s linear infinite;
          animation-delay: var(--bp-delay, 0s);
        }
        @keyframes bpFadeIn {
          0%   { opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { opacity: 0; }
        }

        /* Floor rise animation */
        .bp-floor {
          opacity: 0;
          transform-origin: center bottom;
          transform: scaleY(0.05) translateY(20px);
          animation: bpFloorRise ${LOOP_DURATION_S}s ease-out infinite;
          animation-delay: var(--bp-delay, 0s);
        }
        @keyframes bpFloorRise {
          0%, 20%   { opacity: 0; transform: scaleY(0.05) translateY(20px); }
          24%       { opacity: 1; transform: scaleY(1) translateY(0); }
          85%       { opacity: 1; transform: scaleY(1) translateY(0); }
          95%       { opacity: 0; transform: scaleY(1) translateY(0); }
          100%      { opacity: 0; transform: scaleY(0.05) translateY(20px); }
        }

        .bp-window {
          opacity: 0;
          animation: bpWindowGlow ${LOOP_DURATION_S}s ease-in-out infinite;
          animation-delay: var(--bp-delay, 0s);
          filter: drop-shadow(0 0 3px hsl(45 95% 70% / 0.9));
        }
        @keyframes bpWindowGlow {
          0%, 22%   { opacity: 0; }
          26%       { opacity: 1; }
          50%       { opacity: 0.6; }
          70%       { opacity: 1; }
          85%       { opacity: 0.8; }
          95%       { opacity: 0; }
          100%      { opacity: 0; }
        }

        .bp-roof {
          opacity: 0;
          transform: translateY(-30px);
          animation: bpRoof ${LOOP_DURATION_S}s ease-out infinite;
          animation-delay: var(--bp-delay, 0s);
        }
        @keyframes bpRoof {
          0%, 40% { opacity: 0; transform: translateY(-30px); }
          48%     { opacity: 1; transform: translateY(0); }
          85%     { opacity: 1; transform: translateY(0); }
          95%     { opacity: 0; transform: translateY(-20px); }
          100%    { opacity: 0; transform: translateY(-30px); }
        }

        .bp-ground {
          opacity: 0;
          animation: bpGround ${LOOP_DURATION_S}s linear infinite;
          animation-delay: 4.8s;
        }
        @keyframes bpGround {
          0%   { opacity: 0; }
          10%  { opacity: 1; }
          80%  { opacity: 1; }
          90%  { opacity: 0; }
          100% { opacity: 0; }
        }

        .bp-crane {
          opacity: 0;
          animation: bpCrane ${LOOP_DURATION_S}s linear infinite;
          animation-delay: 6s;
          transform-origin: 220px 200px;
        }
        @keyframes bpCrane {
          0%   { opacity: 0; transform: rotate(-15deg); }
          12%  { opacity: 1; transform: rotate(-15deg); }
          50%  { opacity: 1; transform: rotate(15deg); }
          75%  { opacity: 1; transform: rotate(-5deg); }
          85%  { opacity: 1; transform: rotate(0); }
          92%  { opacity: 0; }
          100% { opacity: 0; }
        }
        .bp-crane-hook {
          animation: bpHook ${LOOP_DURATION_S}s ease-in-out infinite;
          animation-delay: 6.5s;
        }
        @keyframes bpHook {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(40px); }
        }

        .bp-particle {
          opacity: 0;
          animation: bpParticle ${LOOP_DURATION_S}s linear infinite;
          animation-delay: var(--bp-delay, 0s);
        }
        @keyframes bpParticle {
          0%, 25%  { opacity: 0; transform: translateY(0) scale(0.5); }
          30%      { opacity: 1; transform: translateY(-20px) scale(1); }
          80%      { opacity: 0.8; transform: translateY(-200px) scale(0.8); }
          90%      { opacity: 0; transform: translateY(-220px) scale(0.5); }
          100%     { opacity: 0; transform: translateY(-220px) scale(0.5); }
        }

        .bp-overlay {
          opacity: 0;
          animation: bpOverlay ${LOOP_DURATION_S}s ease-out infinite;
        }
        .bp-overlay-1 { animation-delay: 0.5s; }
        .bp-overlay-2 { animation-delay: 1.0s; }
        .bp-overlay-3 { animation-delay: 1.5s; }
        .bp-overlay-4 { animation-delay: 2.0s; }
        @keyframes bpOverlay {
          0%   { opacity: 0; transform: translateY(8px); }
          10%  { opacity: 1; transform: translateY(0); }
          90%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-4px); }
        }

        .bp-scanline {
          height: 2px;
          background: linear-gradient(90deg,
            transparent,
            hsl(198 93% 70% / 0.6),
            hsl(198 93% 90% / 0.9),
            hsl(198 93% 70% / 0.6),
            transparent);
          box-shadow: 0 0 12px hsl(198 93% 70% / 0.7);
          top: 0;
          animation: bpScan ${LOOP_DURATION_S / 2}s linear infinite;
        }
        @keyframes bpScan {
          0%   { transform: translateY(0); opacity: 0; }
          5%   { opacity: 0.7; }
          95%  { opacity: 0.7; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bp-line, .bp-fade-in, .bp-floor, .bp-window, .bp-roof,
          .bp-ground, .bp-crane, .bp-crane-hook, .bp-particle,
          .bp-overlay, .bp-scanline, .bp-phase-blueprint, .bp-phase-building {
            animation: none;
            opacity: 1;
            transform: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

interface GhostChipProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  progress?: number;
}

function GhostChip({ icon, label, value, progress }: GhostChipProps) {
  return (
    <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-lg px-4 py-3 shadow-lg min-w-[160px]">
      <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-white text-base font-semibold tabular-nums">
        {value}
      </div>
      {typeof progress === 'number' && (
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default BlueprintLoop;
