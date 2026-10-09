import React from 'react';

interface GridOverlayProps {
  gridType: 'none' | 'ruleOfThirds' | 'grid4x4';
}

export const GridOverlay: React.FC<GridOverlayProps> = ({ gridType }) => {
  if (gridType === 'none') return null;

  if (gridType === 'ruleOfThirds') {
    return (
      <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-neutral-400/40">
        <div className="border-r border-b border-neutral-400/35" />
        <div className="border-r border-b border-neutral-400/35" />
        <div className="border-b border-neutral-400/35" />
        <div className="border-r border-b border-neutral-400/35" />
        <div className="border-r border-b border-neutral-400/35" />
        <div className="border-b border-neutral-400/35" />
        <div className="border-r border-neutral-400/35" />
        <div className="border-r border-neutral-400/35" />
        <div />
      </div>
    );
  }

  // 4x4 Grid
  return (
    <div className="absolute inset-0 pointer-events-none grid grid-cols-4 grid-rows-4 border border-neutral-400/40">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className={`border-neutral-400/30 ${
            (i + 1) % 4 !== 0 ? 'border-r' : ''
          } ${i < 12 ? 'border-b' : ''}`}
        />
      ))}
    </div>
  );
};
