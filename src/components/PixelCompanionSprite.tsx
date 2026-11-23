import { useState } from 'react';

const GREETINGS = ['Hi!', 'Agent ready', 'Ask me about RAG'];

export function PixelCompanionSprite() {
  const [step, setStep] = useState(0);

  return (
    <button
      type="button"
      onClick={() => setStep((prev) => (prev + 1) % GREETINGS.length)}
      aria-label="Interactive pixel agent companion greeting"
      className="group relative flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF5A1F]"
    >
      <span className="mb-1.5 rounded-sm border border-[#F97316]/50 bg-white px-2.5 py-0.5 font-mono text-[11px] font-medium text-[#C2410C] shadow-[var(--shadow-card)] transition-transform duration-150 group-hover:-translate-y-0.5 whitespace-nowrap dark:border-[#FF5A1F]/40 dark:bg-[#0D0D12] dark:text-[#FFB088]">
        {GREETINGS[step]}
      </span>
      <svg
        width="44"
        height="48"
        viewBox="0 0 11 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_6px_16px_rgba(255,90,31,0.38)] transition-transform duration-200 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Antenna */}
        <rect x="5" y="0" width="1" height="1" fill="#FFB088" />
        <rect x="5" y="1" width="1" height="1" fill="#FF5A1F" />
        {/* Head */}
        <rect x="2" y="2" width="7" height="4" fill="#FF5A1F" />
        <rect x="1" y="3" width="1" height="2" fill="#E04610" />
        <rect x="9" y="3" width="1" height="2" fill="#E04610" />
        {/* Eyes */}
        <rect x="3" y="3" width="1" height="2" fill="#070709" />
        <rect x="7" y="3" width="1" height="2" fill="#070709" />
        {/* Body */}
        <rect x="2" y="6" width="7" height="4" fill="#FF5A1F" />
        <rect x="4" y="7" width="3" height="2" fill="#FFD1B8" />
        {/* Arms */}
        <rect x="0" y="6" width="2" height="2" fill="#FF7B47" />
        <rect x="9" y="5" width="2" height="2" fill="#FF7B47" />
        {/* Legs */}
        <rect x="3" y="10" width="2" height="2" fill="#D9410C" />
        <rect x="6" y="10" width="2" height="2" fill="#D9410C" />
      </svg>
    </button>
  );
}
