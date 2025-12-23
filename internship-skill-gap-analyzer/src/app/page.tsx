'use client';

import { type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  CheckCircle2,
  FileUp,
  LayoutDashboard,
  Lightbulb,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ROLE_DATA, type RoleKey } from '@/data/roleData';

const PROGRESS_FLOW = [
  {
    headline: 'Analyzing your CV...',
    detail: 'Extracting skills, keywords, internships, and impact statements.',
  },
  {
    headline: 'Comparing with industry skills...',
    detail: 'Matching your profile against internship-ready skill matrices.',
  },
  {
    headline: 'Generating your personalized roadmap...',
    detail: 'Designing 30/60/90 day plan, projects, and talking points.',
  },
];

type RoleCardConfig = {
  key: RoleKey;
  icon: React.ElementType;
  accent: string;
  headline: string;
};

const ROLE_CARDS: RoleCardConfig[] = [
  {
    key: 'backend',
    icon: Server,
    accent: 'from-blue-500/80 to-purple-500/70',
    headline: 'Ship resilient APIs & scalable services.',
  },
  {
    key: 'frontend',
    icon: LayoutDashboard,
    accent: 'from-purple-500/80 to-sky-500/70',
    headline: 'Craft delightful, high-performing web experiences.',
  },
  {
    key: 'ml',
    icon: Bot,
    accent: 'from-sky-500/80 to-emerald-500/70',
    headline: 'Deliver ML models with real-world outcomes.',
  },
];

export default function Home() {
  const [selectedRole, setSelectedRole] = useState<RoleKey>('backend');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisLog, setAnalysisLog] = useState<string[]>([]);
  const [analysisDetail, setAnalysisDetail] = useState(PROGRESS_FLOW[0].detail);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [resultReady, setResultReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeProfile = ROLE_DATA[selectedRole];

  const progressPercent = useMemo(() => {
    if (!analysisStarted) return 0;
    const totalSteps = PROGRESS_FLOW.length;
    const completed = resultReady ? totalSteps : analysisLog.length;
    return Math.min(100, Math.round((completed / totalSteps) * 100));
  }, [analysisLog.length, analysisStarted, resultReady]);

  const handleFileSelection = useCallback((file?: File) => {
    if (!file) return;
    setUploadedFile(file);
    setResultReady(false);
    setAnalysisLog([]);
    setAnalysisStarted(false);
  }, []);

  const handleFileInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFileSelection(file);
  }, [handleFileSelection]);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer.files?.[0];
      handleFileSelection(file);
    },
    [handleFileSelection],
  );

  const startAnalysis = useCallback(() => {
    if (!uploadedFile || isAnalyzing) return;
    setAnalysisStarted(true);
    setIsAnalyzing(true);
    setAnalysisLog([]);
    setResultReady(false);
  }, [uploadedFile, isAnalyzing]);

  useEffect(() => {
    if (!isAnalyzing) return;

    const timers: NodeJS.Timeout[] = [];

    PROGRESS_FLOW.forEach((step, index) => {
      timers.push(
        setTimeout(() => {
          setAnalysisLog((prev) => [...prev, step.headline]);
          setAnalysisDetail(step.detail);
          if (index === PROGRESS_FLOW.length - 1) {
            timers.push(
              setTimeout(() => {
                setResultReady(true);
                setIsAnalyzing(false);
              }, 900),
            );
          }
        }, index * 1500),
      );
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [isAnalyzing]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-black">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-70">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-20 h-[28rem] w-[28rem] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-white/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                Internship & Skill Gap Analyzer
              </p>
              <p className="text-sm text-slate-300">
                Built for ambitious CSE students.
              </p>
            </div>
          </div>
          <button
            className="group hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10 md:flex"
            onClick={() => {
              document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Skill Gap Analysis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-200">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              Trusted by final-year hustlers
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Not Getting Internship Calls?{' '}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Let AI Fix Your Skill Gap.
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-300">
              Upload your CV, pick your dream role, and get a tactical roadmap that
              pinpoints missing skills, portfolio-ready projects, and weekly learning
              goals. Built with hiring manager signal in mind.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-purple-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.01]"
                onClick={() => {
                  document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Analyze My CV
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No spam. Your CV stays on your device.
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Skill readiness score', value: '0-100', caption: 'Transparent scoring to track growth.' },
                { label: 'Weekly learning sprints', value: '12', caption: 'Plug-and-play roadmap to stay consistent.' },
                { label: 'Portfolio projects', value: '5', caption: 'Standout case studies recruiters notice.' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <p className="text-sm text-slate-300">{stat.label}</p>
                  <p className="text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.caption}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-r from-indigo-500/40 via-blue-500/30 to-purple-500/40 opacity-60 blur-3xl" />
            <div className="relative rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <FileUp className="h-5 w-5 text-sky-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Instant Skill Report</p>
                  <p className="text-xs text-slate-400">Upload CV | Pick role | See gaps</p>
                </div>
              </div>
              <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p className="font-medium text-slate-200">Why students love it:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 text-purple-300" />
                    <span>
                      Objective signal - know exactly how recruiters read your CV.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <BarChart3 className="mt-0.5 h-4 w-4 text-sky-300" />
                    <span>Gap analysis mapped to internship job descriptions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Lightbulb className="mt-0.5 h-4 w-4 text-amber-300" />
                    <span>Actionable projects that showcase real engineering thinking.</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                <p className="font-semibold text-emerald-100">Student win</p>
                <p>
                  &quot;Went from 0 responses to 4 interviews in 6 weeks by following the roadmap.&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="analysis" className="relative bg-white/5 pb-20 pt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent backdrop-blur" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-semibold text-white">Upload CV & Choose Target Role</h2>
                <p className="max-w-xl text-base text-slate-300">
                  Private, browser-only analysis. Drag your CV and let our AI map your strengths against
                  internship expectations.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-200">
                Secure | Mentor-backed | Actionable
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-black/40 p-8 text-center transition ${
                  dragActive
                    ? 'border-sky-400/60 bg-sky-500/10'
                    : 'hover:border-white/30 hover:bg-white/5'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/15">
                  <FileUp className="h-8 w-8 text-sky-300" />
                </div>
                <div className="mt-6 space-y-2 text-slate-200">
                  <p className="text-lg font-semibold">
                    Drag & drop your CV (PDF or DOCX)
                  </p>
                  <p className="text-sm text-slate-400">
                    We never store your file. Analysis happens in your browser.
                  </p>
                </div>
                {uploadedFile ? (
                  <div className="mt-6 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-100">
                    {uploadedFile.name}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="mt-6 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/10"
                  >
                    Browse files
                  </button>
                )}
                <div className="pointer-events-none absolute -right-4 top-6 hidden rotate-2 rounded-full border border-purple-400/50 bg-purple-500/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-purple-100 sm:inline-flex">
                  100% Local
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-300">
                  Choose your target role
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {ROLE_CARDS.map((role) => {
                    const Icon = role.icon;
                    const profile = ROLE_DATA[role.key];
                    const isActive = selectedRole === role.key;
                    return (
                      <button
                        key={role.key}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.key);
                          setResultReady(false);
                        }}
                        className={`relative overflow-hidden rounded-3xl border p-5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 ${
                          isActive
                            ? 'border-sky-400/60 bg-gradient-to-br from-white/10 to-white/5 shadow-lg shadow-sky-500/20'
                            : 'border-white/10 bg-white/5 hover:border-white/25'
                        }`}
                      >
                        <div className="absolute inset-0 opacity-60">
                          <div
                            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${role.accent}`}
                          />
                        </div>
                        <div className="relative z-10 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/40">
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold text-white">
                              {profile.stack.slice(0, 2).join(' | ')}
                            </div>
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-white">
                              {profile.label}
                            </p>
                            <p className="text-sm text-slate-200">{role.headline}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {profile.stack.slice(0, 4).map((tool) => (
                              <span
                                key={tool}
                                className="rounded-full bg-black/40 px-3 py-1 text-xs text-slate-100"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        Ready for {activeProfile.label}?
                      </p>
                      <p className="text-sm text-slate-300">
                        {uploadedFile
                          ? 'Kick off the analysis to map your gaps instantly.'
                          : 'Upload your CV to unlock the personalized analysis.'}
                      </p>
                    </div>
                    <button
                      onClick={startAnalysis}
                      disabled={!uploadedFile || isAnalyzing}
                      className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isAnalyzing ? 'Crunching data...' : 'Generate roadmap'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                  <div className="mt-5">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-300">
                      {analysisStarted
                        ? resultReady
                          ? 'Analysis complete - personalized insights ready below.'
                          : analysisDetail
                        : 'Takes ~5 seconds. No waiting for emails.'}
                    </p>
                  </div>
                </div>

                {(analysisStarted || isAnalyzing) && (
                  <div className="rounded-3xl border border-white/10 bg-black/50 p-6 font-mono text-xs text-slate-200">
                    <p className="mb-3 flex items-center gap-2 text-sky-200">
                      <BrainCircuit className="h-4 w-4" /> AI Skill Gap Engine
                    </p>
                    <div className="space-y-1">
                      {analysisLog.map((message) => (
                        <p key={message} className="flex items-baseline gap-2">
                          <span className="text-sky-400">&gt;</span> {message}
                        </p>
                      ))}
                      {isAnalyzing && (
                        <p className="flex items-baseline gap-2 text-slate-400">
                          <span className="text-sky-400 animate-pulse">&gt;</span> Crunching more signals...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-white">Your Skill Gap Dashboard</h2>
                <p className="max-w-xl text-base text-slate-300">
                  Crystal clear view of what&apos;s working, what needs strengthening, and the plan to
                  become internship-ready for {activeProfile.label}.
                </p>
              </div>
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-200">
                Updated instantly after each analysis
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-6 shadow-lg shadow-emerald-500/10">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                    Skill readiness score
                  </p>
                  <div className="mt-4 flex items-end gap-4">
                    <p className="text-5xl font-bold text-white">{activeProfile.readiness}</p>
                    <p className="text-sm text-emerald-100">/ 100</p>
                  </div>
                  <p className="mt-4 text-sm text-emerald-100">{activeProfile.summary}</p>
                  <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-emerald-100">
                    <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-center">
                      Strong
                      <p className="text-lg font-semibold text-white">
                        {activeProfile.skills.strong.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-center text-amber-100">
                      Needs focus
                      <p className="text-lg font-semibold text-white">
                        {activeProfile.skills.developing.length}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-center text-rose-100">
                      Missing
                      <p className="text-lg font-semibold text-white">
                        {activeProfile.skills.missing.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
                    Skills breakdown
                  </p>
                  <div className="mt-4 space-y-4 text-sm">
                    <SkillList
                      title="Strong signals recruiters will love"
                      items={activeProfile.skills.strong}
                      tone="strong"
                    />
                    <SkillList
                      title="Skills to reinforce in the next 60 days"
                      items={activeProfile.skills.developing}
                      tone="developing"
                    />
                    <SkillList
                      title="High-leverage gaps to close"
                      items={activeProfile.skills.missing}
                      tone="missing"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
                        Personalized 30 / 60 / 90 day roadmap
                      </p>
                      <p className="mt-2 text-sm text-slate-300">
                        Weekly sprints with execution-focused tasks and measurable outcomes.
                      </p>
                    </div>
                    <Rocket className="h-10 w-10 text-purple-300" />
                  </div>
                  <div className="mt-6 space-y-6">
                    {activeProfile.roadmap.map((segment) => (
                      <div
                        key={segment.window}
                        className="rounded-2xl border border-white/10 bg-black/40 p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                              {segment.window}
                            </p>
                            <p className="text-lg font-semibold text-white">{segment.theme}</p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {segment.focus.map((focus) => (
                              <span
                                key={focus}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                              >
                                {focus}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {segment.weeks.map((week) => (
                            <div
                              key={week.title}
                              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                            >
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                                {week.title}
                              </p>
                              <ul className="mt-2 space-y-2">
                                {week.actions.map((action) => (
                                  <li key={action} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-sky-300" />
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-10 w-10 text-amber-300" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
                        Portfolio-ready project ideas
                      </p>
                        <p className="text-sm text-slate-300">
                          Real-world problems that scream &quot;hire me&quot; in interviews.
                        </p>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {activeProfile.projects.map((project) => (
                      <div
                        key={project.title}
                        className="rounded-2xl border border-white/10 bg-black/40 p-5"
                      >
                        <p className="text-base font-semibold text-white">{project.title}</p>
                        <p className="mt-2 text-sm text-slate-300">{project.problem}</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
                          {project.stack.map((tech) => (
                            <span key={tech} className="rounded-full bg-white/5 px-3 py-1">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                            {project.difficulty}
                          </span>
                          <span className="text-right text-slate-300">{project.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-white/5 py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div className="space-y-5">
                <h2 className="text-3xl font-semibold text-white">Why final-year students need this</h2>
                <p className="text-base text-slate-300">
                  You&apos;re not failing because of your GPA. You&apos;re missing a narrative that
                  translates your skills into internship outcomes. We fix the blind spots recruiters tell
                  us about every hiring season.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Blind job applications',
                      detail:
                        'Spray-and-pray CVs rarely crack ATS filters. We align your resume keywords and skills with the role you want.',
                    },
                    {
                      title: 'Skill confusion',
                      detail:
                        'YouTube tutorials overload you with information. We highlight the exact stack upgrades mentors recommend.',
                    },
                    {
                      title: 'Weak portfolios',
                      detail:
                        'Most projects read like class assignments. We design projects that show business impact and engineering maturity.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-white/10 bg-black/40 p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-200">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-sky-500/30 blur-3xl" />
                <div className="relative rounded-3xl border border-white/10 bg-black/50 p-6 backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-200">
                    Mentor insights
                  </p>
                  <div className="mt-5 space-y-4 text-sm text-slate-300">
                    <InsightCard
                      icon={BarChart3}
                      quote="80% of resumes we reject fail to mention measurable outcomes or monitoring. We surface those gaps instantly."
                      role="Backend mentor @ YC startup"
                    />
                    <InsightCard
                      icon={Sparkles}
                      quote="Students who pitch portfolios with weekly learning logs double their shortlist rate. The roadmap makes that effortless."
                      role="Product designer @ SaaS unicorn"
                    />
                    <InsightCard
                      icon={BrainCircuit}
                      quote="GenAI projects without evaluation don't impress. We force you to showcase reliability, not just novelty."
                      role="AI researcher @ Fortune 100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-black to-slate-950" />
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-200">
              Your Degree Isn&apos;t the Problem. Your Skill Strategy Is.
            </p>
            <h2 className="mt-6 text-4xl font-semibold text-white sm:text-5xl">
              Build a skill story recruiters can&apos;t ignore.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
              Get clarity on your current strengths, shrink the gap to internship-ready skills, and
              execute a plan that proves you can deliver value from day one.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 px-8 py-3 text-base font-semibold text-white transition hover:scale-[1.02]"
              >
                Start Skill Gap Analysis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-slate-300">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                Browser-side analysis | Premium upgrade ready
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-slate-400 sm:flex-row">
          <p>Copyright {new Date().getFullYear()} Internship & Skill Gap Analyzer. Engineered for campus creators.</p>
          <div className="flex items-center gap-4">
            <span>Premium access launching soon</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-purple-300" /> Early adopter perks
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SkillList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'strong' | 'developing' | 'missing';
}) {
  const toneClasses =
    tone === 'strong'
      ? 'text-emerald-100 border-emerald-500/30 bg-emerald-500/10'
      : tone === 'developing'
        ? 'text-amber-100 border-amber-500/30 bg-amber-500/10'
        : 'text-rose-100 border-rose-500/30 bg-rose-500/10';

  const bulletColor =
    tone === 'strong'
      ? 'text-emerald-300'
      : tone === 'developing'
        ? 'text-amber-300'
        : 'text-rose-300';

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-200">{title}</p>
      <div className={`mt-3 space-y-2 rounded-2xl border ${toneClasses} p-4`}>
        {items.map((item) => (
          <p key={item} className="flex items-start gap-2 text-sm">
            <span className={`${bulletColor}`}>&gt;</span>
            <span className="text-slate-100">{item}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function InsightCard({
  icon: Icon,
  quote,
  role,
}: {
  icon: React.ElementType;
  quote: string;
  role: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3 text-slate-200">
        <Icon className="h-6 w-6 text-sky-300" />
        <p className="text-xs uppercase tracking-[0.3em]">{role}</p>
      </div>
      <p className="mt-3 text-sm text-slate-200">{quote}</p>
    </div>
  );
}
