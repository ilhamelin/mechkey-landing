'use client';
import { useState } from 'react';
import { Html } from '@react-three/drei';

export interface LayerCalloutProps {
  layerNum: string;
  category: string;
  title: string;
  description: string;
  spec?: string;
  side: 'left' | 'right';
  anchor: [number, number, number];
  scrollProgress: number;
  triggerProgress: number;
  lineDirection?: 'up' | 'down';
}

export default function LayerCallout({
  layerNum,
  category,
  title,
  description,
  spec,
  side,
  anchor,
  scrollProgress,
  triggerProgress,
  lineDirection = 'down',
}: LayerCalloutProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Successive appearance: active when scrollProgress reaches trigger threshold
  const isVisible = scrollProgress >= triggerProgress;

  // SVG leader line parameters
  const svgWidth = 52;
  const svgHeight = 28;
  const isLeft = side === 'left';

  // Elbow line path:
  // For left side: starts at anchor on the right (x=svgWidth, y=14)
  // goes diagonal to (svgWidth - 26, targetY) then horizontal to (0, targetY)
  const targetY = lineDirection === 'down' ? 22 : 8;
  const startY = lineDirection === 'down' ? 8 : 22;

  const pathD = isLeft
    ? `M ${svgWidth} ${startY} L ${svgWidth - 22} ${targetY} L 0 ${targetY}`
    : `M 0 ${startY} L 22 ${targetY} L ${svgWidth} ${targetY}`;

  return (
    <Html
      position={anchor}
      center={false}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: isHovered ? 20 : 10,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          ...(isLeft ? { right: 0 } : { left: 0 }),
          transform: isVisible
            ? `translate(0px, -${startY}px) scale(1)`
            : `translate(${isLeft ? '18px' : '-18px'}, -${startY}px) scale(0.85)`,
          display: 'flex',
          alignItems: 'center',
          flexDirection: isLeft ? 'row' : 'row-reverse',
          pointerEvents: isVisible ? 'auto' : 'none',
          opacity: isVisible ? 1 : 0,
          transition:
            'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Glassmorphic Technical Card */}
        <div
          style={{
            background: isHovered ? 'rgba(18, 20, 26, 0.95)' : 'rgba(11, 12, 16, 0.88)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: isHovered
              ? '1px solid rgba(232, 201, 125, 0.75)'
              : '1px solid rgba(232, 201, 125, 0.32)',
            borderRadius: '8px',
            padding: '7px 11px',
            minWidth: '165px',
            maxWidth: '210px',
            boxShadow: isHovered
              ? '0 10px 36px rgba(0,0,0,0.6), 0 0 20px rgba(232, 201, 125, 0.25)'
              : '0 6px 24px rgba(0,0,0,0.5), 0 0 10px rgba(232, 201, 125, 0.08)',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            transition:
              'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
            cursor: 'default',
            flexShrink: 0,
          }}
        >
          {/* Header Tag + Category */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '3px',
            }}
          >
            <span
              style={{
                fontSize: '9px',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#0a0a0c',
                background: 'linear-gradient(135deg, #f0d590, #c8a45a)',
                padding: '1px 5px',
                borderRadius: '3px',
                letterSpacing: '0.04em',
                lineHeight: 1.2,
              }}
            >
              {layerNum}
            </span>
            <span
              style={{
                fontSize: '9px',
                fontFamily: 'monospace',
                fontWeight: 600,
                color: 'rgba(232, 201, 125, 0.85)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.01em',
              lineHeight: 1.25,
              marginBottom: '2px',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            className="callout-desc"
            style={{
              fontSize: '10px',
              color: '#a1a1aa',
              lineHeight: 1.35,
            }}
          >
            {description}
          </div>

          {/* Spec metric footer */}
          {spec && (
            <div
              className="callout-spec"
              style={{
                marginTop: '5px',
                paddingTop: '4px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '9px',
                fontFamily: 'monospace',
                color: '#e8c97d',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 6px #4ade80',
                }}
              />
              {spec}
            </div>
          )}
        </div>

        {/* Responsive mobile style */}
        <style>{`
          @media (max-width: 640px) {
            .callout-desc, .callout-spec {
              display: none !important;
            }
          }
        `}</style>

        {/* SVG Leader Elbow Line with Drawing Transition */}
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ overflow: 'visible', flexShrink: 0 }}
        >
          {/* Subtle background guide */}
          <path
            d={pathD}
            stroke="rgba(232, 201, 125, 0.15)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Animated active leader stroke */}
          <path
            d={pathD}
            stroke={isHovered ? '#fff1b8' : '#e8c97d'}
            strokeWidth={isHovered ? '2' : '1.5'}
            fill="none"
            strokeDasharray="90"
            strokeDashoffset={isVisible ? 0 : 90}
            style={{
              transition:
                'stroke-dashoffset 0.55s cubic-bezier(0.16, 1, 0.3, 1), stroke 0.2s ease',
              filter: isHovered
                ? 'drop-shadow(0 0 6px rgba(232, 201, 125, 0.8))'
                : 'drop-shadow(0 0 3px rgba(232, 201, 125, 0.4))',
            }}
          />
        </svg>

        {/* Target Reticle Anchor Dot */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: isHovered ? '2px solid #ffffff' : '2px solid #e8c97d',
            background: isHovered ? 'rgba(255, 255, 255, 0.4)' : 'rgba(232, 201, 125, 0.35)',
            boxShadow: isHovered
              ? '0 0 14px #ffffff, inset 0 0 6px #ffffff'
              : '0 0 10px #e8c97d, inset 0 0 4px #e8c97d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'border 0.2s, background 0.2s, box-shadow 0.2s',
          }}
        >
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: '#ffffff',
            }}
          />
        </div>
      </div>
    </Html>
  );
}
