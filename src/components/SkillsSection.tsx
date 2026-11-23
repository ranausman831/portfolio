import { useMemo, useState, type ComponentType } from 'react';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Code2,
  Cpu,
  DatabaseZap,
  GitBranch,
  Link2,
  Network,
  PlugZap,
  RefreshCw,
  Route,
  Server,
  Sparkles,
  TerminalSquare,
  UserCheck,
  Workflow,
  Zap,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {
  SKILL_CATEGORIES,
  SKILLS_DATA,
  type SkillCategory,
  type SkillIconKey,
  type SkillItem,
} from '../data/portfolioData';
import { filterSkillsByCategory } from '../utils/voxelPortraitMath';

const SKILL_ICON_MAP: Record<SkillIconKey, ComponentType<{ className?: string; 'aria-hidden'?: boolean }>> = {
  brain: BrainCircuit,
  link: Link2,
  'git-branch': GitBranch,
  bot: Bot,
  network: Network,
  database: DatabaseZap,
  plug: PlugZap,
  code: Code2,
  zap: Zap,
  server: Server,
  route: Route,
  sparkles: Sparkles,
  cpu: Cpu,
  terminal: TerminalSquare,
  workflow: Workflow,
  refresh: RefreshCw,
  'user-check': UserCheck,
};

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('All');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('langgraph');
  const shouldReduceMotion = useReducedMotion();

  const visibleSkills = useMemo(
    () => filterSkillsByCategory(SKILLS_DATA, activeCategory),
    [activeCategory]
  );

  const selectedSkill: SkillItem = useMemo(() => {
    return (
      visibleSkills.find((s) => s.id === selectedSkillId) ||
      SKILLS_DATA.find((s) => s.id === selectedSkillId) ||
      visibleSkills[0] ||
      SKILLS_DATA[0]
    );
  }, [visibleSkills, selectedSkillId]);

  const handleCategoryChange = (category: SkillCategory) => {
    setActiveCategory(category);
    const nextList = filterSkillsByCategory(SKILLS_DATA, category);
    if (nextList.length > 0 && !nextList.some((s) => s.id === selectedSkillId)) {
      setSelectedSkillId(nextList[0].id);
    }
  };

  const handleJumpToSkillName = (skillName: string) => {
    const match = SKILLS_DATA.find(
      (s) => s.name.toLowerCase() === skillName.toLowerCase() || s.name.includes(skillName)
    );
    if (match) {
      setActiveCategory('All');
      setSelectedSkillId(match.id);
    }
  };

  const SelectedIcon = SKILL_ICON_MAP[selectedSkill.iconKey];

  return (
    <section
      id="skills"
      data-scroll-section
      className="relative scroll-mt-14 border-t border-[#E2E8F0] bg-[#F8FAFC] py-14 text-[#172033] transition-colors duration-200 sm:scroll-mt-16 sm:py-24 lg:py-28 dark:border-white/10 dark:bg-[#0A0A0E] dark:text-[#F4F4F6]"
    >
      <span
        data-scroll-seam
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[1.5px] w-40 origin-left bg-[#F97316] dark:bg-[#FF5A1F]"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        {/* Header & Category Filter Bar */}
        <div
          data-stagger-group
          className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <p
              data-stagger-item
              className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]"
            >
              02. Technical Skills
            </p>
            <h2
              data-stagger-item
              className="mt-2.5 font-display text-2xl font-bold tracking-tight text-[#172033] sm:mt-3 sm:text-4xl [text-wrap:balance] dark:text-white"
            >
              Agentic AI &amp; Engineering Stack
            </h2>
            <p
              data-stagger-item
              className="mt-2.5 max-w-xl text-sm leading-relaxed text-[#64748B] sm:mt-3 sm:text-base dark:text-zinc-400"
            >
              Organized across AI &amp; Agentic AI, Backend Development, AI Integration, and
              Automation. Select any technology card to inspect how it fits into real workflows.
            </p>
          </div>

          {/* Functional Segmented Filter Bar */}
          <div
            data-stagger-item
            role="tablist"
            aria-label="Filter skills by engineering category"
            className="flex flex-wrap items-center gap-1 rounded-md sm:rounded-sm border border-[#E2E8F0] bg-white p-1 shadow-[var(--shadow-card)] lg:shrink-0 dark:border-white/10 dark:bg-[#111116]"
          >
            {SKILL_CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => handleCategoryChange(category)}
                  className={`min-h-[40px] sm:min-h-[36px] rounded-sm px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F97316] text-[#172033] font-semibold dark:bg-[#FF5A1F] dark:text-[#070709]'
                      : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#172033] dark:text-zinc-400 dark:hover:bg-transparent dark:hover:text-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Skill Matrix + Stack Inspector */}
        <div className="mt-7 grid grid-cols-1 gap-6 sm:mt-10 sm:gap-8 lg:grid-cols-12">
          {/* Left: Clickable Technology Cards (compact 2-column grid on mobile prevents vertical sprawl) */}
          <motion.div
            key={activeCategory}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="order-last lg:order-first lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-3"
          >
            {visibleSkills.map((skill, idx) => {
              const isSelected = selectedSkill.id === skill.id;
              const Icon = SKILL_ICON_MAP[skill.iconKey];
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => setSelectedSkillId(skill.id)}
                  aria-pressed={isSelected}
                  className={`group flex min-h-[104px] sm:min-h-0 flex-col justify-between rounded-md sm:rounded-sm border p-3.5 sm:p-5 text-left transition-all duration-150 active:scale-[0.98] cursor-pointer ${
                    isSelected
                      ? 'border-[#F97316] bg-[#FFF7ED] shadow-[var(--shadow-card-hover)] dark:border-[#FF5A1F] dark:bg-[#161314]'
                      : 'border-[#E2E8F0] bg-white shadow-[var(--shadow-card)] hover:-translate-y-0.5 hover:border-[#CBD5E1] hover:shadow-[var(--shadow-card-hover)] dark:border-white/10 dark:bg-[#101015] dark:hover:border-white/25 dark:hover:bg-[#14141A]'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-1.5">
                    <span className="truncate font-mono text-[10px] sm:text-[11px] tabular-nums text-[#64748B] dark:text-zinc-500">
                      {String(idx + 1).padStart(2, '0')}
                      <span className="hidden sm:inline"> / {skill.category}</span>
                    </span>
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isSelected
                          ? 'text-[#EA580C] dark:text-[#FF5A1F]'
                          : 'text-[#64748B] group-hover:text-[#C2410C] dark:text-zinc-500 dark:group-hover:text-[#FF8C42]'
                      }`}
                      aria-hidden={true}
                    />
                  </div>
                  <div className="mt-2.5 sm:mt-4">
                    <h3 className="font-display text-[15px] font-semibold leading-snug text-[#172033] sm:text-lg dark:text-white">
                      {skill.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#64748B] sm:text-xs dark:text-zinc-400">
                      {skill.roleInStack}
                    </p>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* Right (Desktop) / Top (Mobile): Live Stack Inspector Panel */}
          <div className="order-first lg:order-last lg:col-span-5">
            <div
              data-clip-reveal="panel"
              className="rounded-md sm:rounded-sm border border-[#E2E8F0] bg-white p-5 shadow-[var(--shadow-elevated)] sm:p-7 lg:sticky lg:top-24 dark:border-white/15 dark:bg-[#111116]"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3.5 sm:pb-4 dark:border-white/10">
                <span className="font-mono text-xs font-medium text-[#C2410C] dark:text-[#FF8C42]">
                  {selectedSkill.category}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-[#64748B] dark:text-zinc-500">
                  <SelectedIcon
                    className="h-3.5 w-3.5 text-[#C2410C] dark:text-[#FF8C42]"
                    aria-hidden={true}
                  />
                  <span>Stack Role</span>
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-bold text-[#172033] sm:mt-5 sm:text-2xl dark:text-white">
                {selectedSkill.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-[#C2410C] dark:text-[#FFB088]">
                {selectedSkill.roleInStack}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-[#475569] sm:mt-5 dark:text-zinc-300">
                {selectedSkill.architectureNote}
              </p>

              <div className="mt-5 border-t border-[#E2E8F0] pt-4 sm:mt-7 sm:pt-5 dark:border-white/10">
                <p className="font-mono text-xs text-[#64748B] dark:text-zinc-500">
                  Connected Stack Modules
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 sm:mt-3">
                  {selectedSkill.connectsWith.map((target) => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => handleJumpToSkillName(target)}
                      className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1.5 rounded-sm border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#172033] transition-colors hover:border-[#F97316] hover:bg-[#FFF7ED] hover:text-[#C2410C] active:scale-[0.98] dark:border-white/15 dark:bg-[#181820] dark:text-zinc-200 dark:hover:border-[#FF5A1F] dark:hover:bg-[#181820] dark:hover:text-[#FF8C42] cursor-pointer"
                    >
                      <span>{target}</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
