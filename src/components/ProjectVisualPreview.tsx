import type { ProjectPipelineNode } from '../data/portfolioData';

interface ProjectVisualPreviewProps {
  variant: 'sdr' | 'keyword' | 'chatbot' | 'backlink' | 'pdf';
  nodes: ProjectPipelineNode[];
  title: string;
}

export function ProjectVisualPreview({ variant, nodes, title }: ProjectVisualPreviewProps) {
  return (
    <div
      aria-label={`${title} architecture diagram`}
      className="relative min-h-[12rem] h-auto w-full overflow-hidden border-b border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:h-48 sm:p-5 dark:border-white/10 dark:bg-[#0A0A0E]"
    >
      {/* Subtle Pixel Architectural Grid */}
      <div className="pixel-grid-dense pointer-events-none absolute inset-0 opacity-40 dark:opacity-35" />

      {/* Top Schematic Header */}
      <div className="relative z-10 flex items-center justify-between gap-2 text-[11px] font-mono text-[#64748B] dark:text-zinc-500">
        <span className="truncate">Workflow Architecture</span>
        <span className="shrink-0 font-medium text-[#C2410C] dark:text-[#FF8C42]">
          {variant.toUpperCase()} FLOW
        </span>
      </div>

      {/* Interactive-Style Node Graph */}
      <div className="relative z-10 mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-2.5 sm:grid-cols-4">
        {nodes.map((node, idx) => (
          <div
            key={node.label}
            className="relative flex flex-col justify-between rounded-sm border border-[#E2E8F0] bg-white p-2.5 shadow-2xs transition-colors duration-200 group-hover:border-[#F97316]/50 dark:border-white/10 dark:bg-[#121218] dark:shadow-none dark:group-hover:border-[#FF5A1F]/40"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-medium text-[#C2410C] tabular-nums dark:text-[#FF8C42]">
                0{idx + 1}
              </span>
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 ${
                  idx === 0 || idx === nodes.length - 1
                    ? 'bg-[#F97316] dark:bg-[#FF5A1F]'
                    : 'bg-[#94A3B8] dark:bg-zinc-500'
                }`}
              />
            </div>
            <p className="mt-2 font-display text-xs font-semibold text-[#172033] truncate dark:text-white">
              {node.label}
            </p>
            <p className="mt-0.5 text-[10px] leading-tight text-[#64748B] line-clamp-2 dark:text-zinc-400">
              {node.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Connector Line Accent */}
      <div
        aria-hidden="true"
        className="relative z-10 mt-4 flex items-center gap-1.5"
      >
        <span className="h-1 w-8 bg-[#F97316] dark:bg-[#FF5A1F]" />
        <span className="h-px flex-1 bg-[#CBD5E1] dark:bg-white/15" />
        <span className="h-1.5 w-1.5 bg-[#94A3B8] dark:bg-white/40" />
        <span className="h-1.5 w-1.5 bg-[#F97316] dark:bg-[#FF5A1F]" />
      </div>
    </div>
  );
}
