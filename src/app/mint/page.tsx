// 'use client';

// import Link from 'next/link';
// import { useState } from 'react';
// import { Mail, Lock, User, ArrowRight, Shield, Sparkles } from 'lucide-react';

// type AuthMode = 'login' | 'signup';

// export default function MintAuthPage() {
//   const [mode, setMode] = useState<AuthMode>('signup');

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
//       {/* Header */}
//       <header className="shrink-0 border-b border-white/10 bg-black/60 backdrop-blur-xl">
//         <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
//           {/* Brand */}
//           <div className="flex items-center gap-3">
//             <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-sky-500 shadow-lg shadow-emerald-500/40">
//               <span className="text-[11px] font-semibold tracking-[0.24em] uppercase">
//                 AI
//               </span>
//               <span className="pointer-events-none absolute inset-0 rounded-2xl border border-white/30/40" />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm font-semibold tracking-wide sm:text-base">
//                 Dime Mint
//               </span>
//               <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">
//                 Vision Intelligence
//               </span>
//             </div>
//           </div>

//           {/* Nav */}
//           <nav className="hidden items-center gap-6 text-xs font-medium text-neutral-300 sm:flex">
//             <Link href="#" className="transition hover:text-white">
//               Product
//             </Link>
//             <Link href="#" className="transition hover:text-white">
//               Docs
//             </Link>
//             <Link href="#" className="transition hover:text-white">
//               Pricing
//             </Link>
//             <Link href="#" className="transition hover:text-white">
//               Support
//             </Link>
//           </nav>

//           {/* Auth actions */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setMode('login')}
//               className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-white/30 hover:text-white sm:inline-flex"
//             >
//               Log in
//             </button>
//             <button
//               onClick={() => setMode('signup')}
//               className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-black shadow-[0_18px_60px_rgba(16,185,129,0.6)] transition hover:bg-emerald-400"
//             >
//               Get started
//               <ArrowRight className="h-3.5 w-3.5" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex flex-1 items-stretch">
//         <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-14">
//           {/* Left: marketing / copy */}
//           <section className="flex w-full flex-1 flex-col gap-8 text-center lg:text-left">
//             {/* Pill */}
//             <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-emerald-500/25 bg-gradient-to-r from-emerald-500/15 via-cyan-400/10 to-sky-400/15 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-300 lg:self-start">
//               <span className="inline-flex h-1.5 w-1.5 items-center justify-center rounded-full bg-emerald-400 ring-4 ring-emerald-500/30" />
//               Realtime anomaly detection
//             </div>

//             {/* Hero copy */}
//             <div className="space-y-5">
//               <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
//                 Train, monitor and deploy
//                 <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
//                   {' '}
//                   vision models
//                 </span>
//                 {' '}
//                 without the MLOps overhead.
//               </h1>
//               <p className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-300 lg:mx-0 lg:text-[0.96rem]">
//                 Dime Mint gives your team a single workspace for connecting cameras,
//                 defining regions of interest, tracking anomalies, and shipping
//                 production‑ready computer vision pipelines in minutes instead of months.
//               </p>
//             </div>

//             {/* Highlights */}
//             <dl className="grid grid-cols-2 gap-4 text-left text-xs text-neutral-300 sm:max-w-md sm:text-sm lg:max-w-none lg:grid-cols-3">
//               <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
//                 <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
//                   Average setup time
//                 </dt>
//                 <dd className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
//                   &lt; 15 minutes
//                 </dd>
//                 <p className="mt-1 text-[11px] text-neutral-400">
//                   From first camera to active alerts.
//                 </p>
//               </div>
//               <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
//                 <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
//                   Edge compatible
//                 </dt>
//                 <dd className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
//                   OAK‑D &amp; RTSP
//                 </dd>
//                 <p className="mt-1 text-[11px] text-neutral-400">
//                   Bring your own cameras, keep data on‑prem.
//                 </p>
//               </div>
//               <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur">
//                 <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
//                   End‑to‑end latency
//                 </dt>
//                 <dd className="mt-1.5 text-lg font-semibold text-white sm:text-xl">
//                   &lt; 120 ms
//                 </dd>
//                 <p className="mt-1 text-[11px] text-neutral-400">
//                   Tuned for live production environments.
//                 </p>
//               </div>
//             </dl>

//             {/* Trust row */}
//             <div className="mt-2 flex flex-col items-center gap-3 text-[11px] text-neutral-400 sm:flex-row lg:items-center">
//               <div className="inline-flex items-center gap-2">
//                 <Shield className="h-3.5 w-3.5 text-emerald-300" />
//                 <span>SSO, audit logs &amp; role‑based access.</span>
//               </div>
//               <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent sm:block" />
//               <div className="inline-flex items-center gap-2">
//                 <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
//                 <span>Designed for vision, not generic dashboards.</span>
//               </div>
//             </div>
//           </section>

//           {/* Right: Auth card */}
//           <section className="flex w-full max-w-md flex-1 justify-center">
//             <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-b from-neutral-900/95 via-black/95 to-black/95 p-6 shadow-[0_30px_140px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:p-8">
//               {/* Subtle background accents */}
//               <div className="pointer-events-none absolute -left-20 top-[-6rem] h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
//               <div className="pointer-events-none absolute -right-24 bottom-[-6rem] h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl" />
//               <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(148,163,184,0.22),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(45,212,191,0.18),transparent_55%)] opacity-70" />

//               <div className="relative z-10 space-y-6">
//                 {/* Tabs */}
//                 <div className="inline-flex w-full items-center justify-between rounded-full bg-white/5 p-1">
//                   <button
//                     type="button"
//                     onClick={() => setMode('signup')}
//                     className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
//                       mode === 'signup'
//                         ? 'bg-white text-black shadow-sm'
//                         : 'text-neutral-300 hover:text-white'
//                     }`}
//                   >
//                     Create account
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setMode('login')}
//                     className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
//                       mode === 'login'
//                         ? 'bg-white text-black shadow-sm'
//                         : 'text-neutral-300 hover:text-white'
//                     }`}
//                   >
//                     Sign in
//                   </button>
//                 </div>

//                 {/* Title + description */}
//                 <div className="space-y-2">
//                   <h2 className="text-lg font-semibold sm:text-xl">
//                     {mode === 'signup'
//                       ? 'Create your Mint workspace'
//                       : 'Welcome back to Mint'}
//                   </h2>
//                   <p className="text-xs text-neutral-400 sm:text-sm">
//                     {mode === 'signup'
//                       ? 'Spin up a workspace for your team to manage cameras, datasets and deployments in one place.'
//                       : 'Sign in to access your cameras, datasets, and live anomaly feeds.'}
//                   </p>
//                 </div>

//                 {/* Form */}
//                 <form
//                   className="space-y-4"
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     // Hook your auth integration here.
//                   }}
//                 >
//                   {mode === 'signup' && (
//                     <div className="space-y-1.5">
//                       <label
//                         htmlFor="full-name"
//                         className="text-xs font-medium text-neutral-200"
//                       >
//                         Full name
//                       </label>
//                       <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition focus-within:border-emerald-400/80 focus-within:bg-black/70">
//                         <User className="h-4 w-4 text-neutral-400" />
//                         <input
//                           id="full-name"
//                           name="fullName"
//                           type="text"
//                           autoComplete="name"
//                           placeholder="Ada Lovelace"
//                           className="h-8 w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div className="space-y-1.5">
//                     <label
//                       htmlFor="email"
//                       className="text-xs font-medium text-neutral-200"
//                     >
//                       Work email
//                     </label>
//                     <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition focus-within:border-emerald-400/80 focus-within:bg-black/70">
//                       <Mail className="h-4 w-4 text-neutral-400" />
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         autoComplete="email"
//                         placeholder="you@company.com"
//                         className="h-8 w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-1.5">
//                     <div className="flex items-center justify-between">
//                       <label
//                         htmlFor="password"
//                         className="text-xs font-medium text-neutral-200"
//                       >
//                         Password
//                       </label>
//                       <button
//                         type="button"
//                         className="text-[11px] font-medium text-emerald-300 hover:text-emerald-200"
//                       >
//                         {mode === 'login' ? 'Forgot password?' : 'Password guidelines'}
//                       </button>
//                     </div>
//                     <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-[0_0_0_1px_rgba(15,23,42,0.6)] transition focus-within:border-emerald-400/80 focus-within:bg-black/70">
//                       <Lock className="h-4 w-4 text-neutral-400" />
//                       <input
//                         id="password"
//                         name="password"
//                         type="password"
//                         autoComplete={
//                           mode === 'login' ? 'current-password' : 'new-password'
//                         }
//                         placeholder="••••••••"
//                         className="h-8 w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
//                         required
//                       />
//                     </div>
//                     {mode === 'signup' && (
//                       <p className="text-[11px] text-neutral-500">
//                         Use at least 8 characters with upper &amp; lower case, numbers,
//                         and a symbol.
//                       </p>
//                     )}
//                   </div>

//                   {mode === 'signup' && (
//                     <p className="text-[11px] leading-relaxed text-neutral-400">
//                       By creating an account you agree to the{' '}
//                       <Link
//                         href="#"
//                         className="text-emerald-300 hover:text-emerald-200"
//                       >
//                         Terms
//                       </Link>{' '}
//                       and{' '}
//                       <Link
//                         href="#"
//                         className="text-emerald-300 hover:text-emerald-200"
//                       >
//                         Privacy Policy
//                       </Link>
//                       .
//                     </p>
//                   )}

//                   <button
//                     type="submit"
//                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_20px_70px_rgba(16,185,129,0.7)] transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
//                   >
//                     {mode === 'signup' ? 'Create workspace' : 'Continue'}
//                     <ArrowRight className="h-4 w-4" />
//                   </button>
//                 </form>

//                 {/* Mode switch */}
//                 <p className="text-[11px] text-neutral-500">
//                   {mode === 'signup' ? (
//                     <>
//                       Already have an account?{' '}
//                       <button
//                         type="button"
//                         onClick={() => setMode('login')}
//                         className="font-medium text-emerald-300 hover:text-emerald-200"
//                       >
//                         Sign in
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       New to Mint?{' '}
//                       <button
//                         type="button"
//                         onClick={() => setMode('signup')}
//                         className="font-medium text-emerald-300 hover:text-emerald-200"
//                       >
//                         Create an account
//                       </button>
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="shrink-0 border-t border-white/10 bg-black/70">
//         <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-neutral-500 sm:flex-row sm:px-6 lg:px-8">
//           <p className="text-center sm:text-left">
//             © {new Date().getFullYear()} Dime Mint. All rights reserved.
//           </p>
//           <div className="flex flex-wrap items-center justify-center gap-3">
//             <Link href="#" className="transition hover:text-neutral-300">
//               Status
//             </Link>
//             <Link href="#" className="transition hover:text-neutral-300">
//               Security
//             </Link>
//             <Link href="#" className="transition hover:text-neutral-300">
//               Privacy
//             </Link>
//             <Link href="#" className="transition hover:text-neutral-300">
//               Changelog
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

'use client';

// Design system tokens for this page
const ds = {
  radius: {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-[2.5rem]',
    pill: 'rounded-full',
  },
  colors: {
    bg: 'bg-[#080808]',
    surface: 'bg-zinc-900/40',
    surfaceBlur: 'bg-zinc-900/40 ',
    surfaceSolid: 'bg-[#121212]',
    borderSubtle: 'border-zinc-800/50',
    borderStrong: 'border-zinc-700/50',
    textPrimary: 'text-zinc-100',
    textSecondary: 'text-zinc-400',
    textMuted: 'text-zinc-500',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-500',
    primaryRing: 'focus-visible:ring-blue-500/80',
    accent: 'bg-indigo-500',
    accentSoft: 'bg-indigo-500/15',
    dangerSoft: 'bg-rose-500/15',
    warningSoft: 'bg-amber-500/15',
    successSoft: 'bg-blue-500/12',
    outline: 'border-zinc-800',
  },
  shadow: {
    soft: 'shadow-[0_4px_20px_rgba(0,0,0,0.3)]',
    strong: 'shadow-[0_12px_40px_rgba(0,0,0,0.5)]',
  },
  text: {
    label: 'text-[10px] font-bold tracking-[0.2em] uppercase',
    mono: 'font-mono text-[10px]',
  },
};

const buttonPrimary =
  `inline-flex items-center justify-center gap-2 px-4 h-9 text-xs font-bold ${ds.radius.sm} ` +
  `${ds.colors.primary} ${ds.colors.primaryHover} text-black ${ds.shadow.soft} ` +
  'transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 ' +
  `${ds.colors.primaryRing} focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`;

const buttonSecondary =
  `inline-flex items-center justify-center gap-2 px-4 h-9 text-xs font-bold ${ds.radius.sm} ` +
  'bg-zinc-800/50 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/50 ' +
  'transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/70 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]';

const buttonGhost =
  `inline-flex items-center justify-center gap-2 px-3 h-9 text-[11px] font-bold ${ds.radius.sm} ` +
  'bg-transparent text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 ' +
  'transition-colors';

const toolbarIconButton =
  `flex items-center justify-center px-2 py-1.5 text-xs ${ds.radius.sm} ` +
  'bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 ' +
  'transition-colors';

const panelCard =
  `${ds.radius.md} ${ds.colors.surfaceBlur} border ${ds.colors.borderSubtle} ` +
  `${ds.shadow.soft}`;

const subtleBadge =
  `inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold ${ds.radius.pill} ` +
  'bg-zinc-900/80 border border-zinc-700 text-zinc-300';

// import Link from 'next/link';
// import { useState } from 'react';
// import { Mail, Lock, User, ArrowRight } from 'lucide-react';

// type AuthMode = 'login' | 'signup';

// export default function MintAuthPage() {
//   const [mode, setMode] = useState<AuthMode>('signup');

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white">
//       {/* Header */}
//       <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
//         <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-2">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-400 to-sky-500 shadow-lg shadow-emerald-500/40">
//               <span className="text-xs font-semibold tracking-widest uppercase">
//                 AI
//               </span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm font-semibold tracking-wide sm:text-base">
//                 Dime Mint
//               </span>
//               <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">
//                 Vision Intelligence
//               </span>
//             </div>
//           </div>

//           <nav className="hidden items-center gap-6 text-xs font-medium text-neutral-300 sm:flex">
//             <Link href="#" className="transition hover:text-white">
//               Product
//             </Link>
//             <Link href="#" className="transition hover:text-white">
//               Docs
//             </Link>
//             <Link href="#" className="transition hover:text-white">
//               Pricing
//             </Link>
//             <Link href="#" className="transition hover:text-white">
//               Support
//             </Link>
//           </nav>

//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setMode('login')}
//               className="hidden rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-neutral-200 transition hover:border-white/30 hover:text-white sm:inline-flex"
//             >
//               Log in
//             </button>
//             <button
//               onClick={() => setMode('signup')}
//               className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-black shadow-[0_10px_40px_rgba(16,185,129,0.5)] transition hover:bg-emerald-400"
//             >
//               Get started
//               <ArrowRight className="h-3.5 w-3.5" />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main */}
//       <main className="flex flex-1 items-center justify-center">
//         <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:px-8 lg:py-14">
//           {/* Left: marketing / copy */}
//           <section className="flex w-full flex-1 flex-col gap-6 text-center lg:text-left">
//             <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-300 lg:self-start">
//               <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
//               Realtime anomaly detection
//             </div>

//             <div className="space-y-4">
//               <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
//                 Train and deploy vision models
//                 <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
//                   {' '}
//                   without the MLOps overhead.
//                 </span>
//               </h1>
//               <p className="mx-auto max-w-xl text-sm leading-relaxed text-neutral-300 lg:mx-0 lg:text-base">
//                 Upload streams, define regions of interest, and push models to production
//                 in minutes. Dime Mint gives your team a unified workspace for training,
//                 monitoring and iterating on computer vision pipelines.
//               </p>
//             </div>

//             <dl className="grid grid-cols-2 gap-4 text-left text-xs text-neutral-300 sm:max-w-md sm:text-sm lg:max-w-none lg:grid-cols-3">
//               <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
//                 <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
//                   Average setup time
//                 </dt>
//                 <dd className="mt-1 text-lg font-semibold text-white sm:text-xl">
//                   &lt; 15 min
//                 </dd>
//               </div>
//               <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
//                 <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
//                   Edge compatible
//                 </dt>
//                 <dd className="mt-1 text-lg font-semibold text-white sm:text-xl">
//                   OAK‑D &amp; RTSP
//                 </dd>
//               </div>
//               <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
//                 <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
//                   Latency
//                 </dt>
//                 <dd className="mt-1 text-lg font-semibold text-white sm:text-xl">
//                   &lt; 120 ms
//                 </dd>
//               </div>
//             </dl>
//           </section>

//           {/* Right: Auth card */}
//           <section className="flex w-full max-w-md flex-1 justify-center">
//             <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-8">
//               {/* Subtle gradient accent */}
//               <div className="pointer-events-none absolute inset-x-10 -top-20 h-40 rounded-full bg-gradient-to-b from-emerald-500/40 via-cyan-400/10 to-transparent blur-3xl" />

//               <div className="relative z-10 space-y-6">
//                 {/* Tabs */}
//                 <div className="inline-flex w-full items-center justify-between rounded-full bg-white/5 p-1">
//                   <button
//                     type="button"
//                     onClick={() => setMode('signup')}
//                     className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${mode === 'signup'
//                         ? 'bg-white text-black shadow-sm'
//                         : 'text-neutral-300 hover:text-white'
//                       }`}
//                   >
//                     Create account
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setMode('login')}
//                     className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${mode === 'login'
//                         ? 'bg-white text-black shadow-sm'
//                         : 'text-neutral-300 hover:text-white'
//                       }`}
//                   >
//                     Log in
//                   </button>
//                 </div>

//                 <div className="space-y-2">
//                   <h2 className="text-lg font-semibold sm:text-xl">
//                     {mode === 'signup'
//                       ? 'Join the Mint workspace'
//                       : 'Welcome back to Mint'}
//                   </h2>
//                   <p className="text-xs text-neutral-400 sm:text-sm">
//                     {mode === 'signup'
//                       ? 'Create a project workspace to start training vision models with your team.'
//                       : 'Sign in to access your cameras, datasets, and existing deployments.'}
//                   </p>
//                 </div>

//                 <form
//                   className="space-y-4"
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     // hook into your auth flow here
//                   }}
//                 >
//                   {mode === 'signup' && (
//                     <div className="space-y-1.5">
//                       <label
//                         htmlFor="full-name"
//                         className="text-xs font-medium text-neutral-200"
//                       >
//                         Full name
//                       </label>
//                       <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus-within:border-emerald-400/80 focus-within:bg-black/60">
//                         <User className="h-4 w-4 text-neutral-400" />
//                         <input
//                           id="full-name"
//                           name="fullName"
//                           type="text"
//                           autoComplete="name"
//                           placeholder="Ada Lovelace"
//                           className="h-8 w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div className="space-y-1.5">
//                     <label
//                       htmlFor="email"
//                       className="text-xs font-medium text-neutral-200"
//                     >
//                       Work email
//                     </label>
//                     <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus-within:border-emerald-400/80 focus-within:bg-black/60">
//                       <Mail className="h-4 w-4 text-neutral-400" />
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         autoComplete="email"
//                         placeholder="you@company.com"
//                         className="h-8 w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-1.5">
//                     <div className="flex items-center justify-between">
//                       <label
//                         htmlFor="password"
//                         className="text-xs font-medium text-neutral-200"
//                       >
//                         Password
//                       </label>
//                       <button
//                         type="button"
//                         className="text-[11px] font-medium text-emerald-300 hover:text-emerald-200"
//                       >
//                         {mode === 'login' ? 'Forgot?' : 'Password guidelines'}
//                       </button>
//                     </div>
//                     <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm focus-within:border-emerald-400/80 focus-within:bg-black/60">
//                       <Lock className="h-4 w-4 text-neutral-400" />
//                       <input
//                         id="password"
//                         name="password"
//                         type="password"
//                         autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
//                         placeholder="••••••••"
//                         className="h-8 w-full bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
//                         required
//                       />
//                     </div>
//                   </div>

//                   {mode === 'signup' && (
//                     <p className="text-[11px] leading-relaxed text-neutral-400">
//                       By creating an account you agree to the{' '}
//                       <Link href="#" className="text-emerald-300 hover:text-emerald-200">
//                         Terms
//                       </Link>{' '}
//                       and{' '}
//                       <Link href="#" className="text-emerald-300 hover:text-emerald-200">
//                         Privacy Policy
//                       </Link>
//                       .
//                     </p>
//                   )}

//                   <button
//                     type="submit"
//                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-black shadow-[0_15px_60px_rgba(16,185,129,0.6)] transition hover:bg-emerald-400"
//                   >
//                     {mode === 'signup' ? 'Create workspace' : 'Continue'}
//                     <ArrowRight className="h-4 w-4" />
//                   </button>
//                 </form>

//                 <p className="text-[11px] text-neutral-500">
//                   {mode === 'signup' ? (
//                     <>
//                       Already have an account?{' '}
//                       <button
//                         type="button"
//                         onClick={() => setMode('login')}
//                         className="font-medium text-emerald-300 hover:text-emerald-200"
//                       >
//                         Log in
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       New to Mint?{' '}
//                       <button
//                         type="button"
//                         onClick={() => setMode('signup')}
//                         className="font-medium text-emerald-300 hover:text-emerald-200"
//                       >
//                         Create an account
//                       </button>
//                     </>
//                   )}
//                 </p>
//               </div>
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="w-full border-t border-white/10 bg-black/60">
//         <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-4 text-[11px] text-neutral-500 sm:flex-row sm:px-6 lg:px-8">
//           <p className="text-center sm:text-left">
//             © {new Date().getFullYear()} Dime Mint. All rights reserved.
//           </p>
//           <div className="flex flex-wrap items-center justify-center gap-3">
//             <Link href="#" className="transition hover:text-neutral-300">
//               Status
//             </Link>
//             <Link href="#" className="transition hover:text-neutral-300">
//               Security
//             </Link>
//             <Link href="#" className="transition hover:text-neutral-300">
//               Privacy
//             </Link>
//             <Link href="#" className="transition hover:text-neutral-300">
//               Changelog
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Upload, Camera, Target, Brain, Play, Pause,
  Square, Hexagon, Trash2, Save, RefreshCw,
  Settings, Layers, Plus, Edit2, Eye, Zap, Cpu,
  MousePointer, Video, Film, CheckCircle, Grid3x3,
  Download, SkipBack, SkipForward, Volume2, VolumeX,
  Power, PowerOff, Radio, Terminal, X, Copy, Clock, AlertCircle,
  Menu, ChevronDown, ChevronUp, Smartphone, Tablet, Monitor,
  CloudUpload, AlertTriangle, Check, QrCode,
  Workflow,
  Activity,
  Crosshair,
  Bug,

  Settings2,
  Info,
  BugIcon,
  Database,
  HelpCircle,
  Maximize2,
  Frame,
  ScrollTextIcon,
  Scroll,
  VideoIcon,

  User,
  CloudOff,
  CloudCheck
} from 'lucide-react';
import Link from 'next/link'
import { QRCodeCanvas } from 'qrcode.react';

interface Point {
  x: number;
  y: number;
}
type TrainingType = 'anomaly' | 'sequential' | 'motion';
type ToolbarDropdownId =
  | 'inputSource'
  | 'inferenceModel'
  | 'inferenceControls'
  | 'inferenceAdvanced'
  | 'inferenceStats';

type PanelType = 'terminal' | 'instructions' | null;

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface ROI {
  training: TrainingType[];
  id: string;
  type: 'rectangle' | 'polygon';
  points: Point[];
  label: string;
  color: string;
}

interface CameraDevice {
  mxid: string;
  name: string;
  state: string;
}

interface RemoteCameraSession {
  sessionId: string;
  connected: boolean;
  lastFrameTime: number;
  frameCount: number;
  deviceInfo?: string;
}

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ROIToolsPalette from './components/ROIToolsPalette';
import TrainingTypeModal from './components/TrainingTypeModal';
import TrainingFooter from './components/footers/TrainingFooter';
import InferenceFooter from './components/footers/InferenceFooter';
import InferenceControls from './components/inference/InferenceControls';
import InferenceModelDropdown from './components/inference/ModelSelection';
import InferenceSettings from './components/inference/InferenceSettings';
import { useInference } from './hooks/useInference';
import React from 'react';
import { showToast } from './lib/toast';
import BackendExtractionCard from './components/BackendExtraction';
import { authFetch } from '../lib/authFetch';
import { BackendVideoProcessingPanel } from './components/BackendVideoProcessingUI';

export default function TrainingContent() {
  const router = useRouter();

  // Inference UI States
  const [showTooltip, setShowTooltip] = useState(true);
  const [activeInferenceTab, setActiveInferenceTab] = useState<'live' | 'batch'>('live');
  // New States
  const [viewMode, setViewMode] = useState<'training' | 'inference'>('training');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<ToolbarDropdownId | null>(null);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [inferenceViewerMode, setInferenceViewerMode] = useState<'processed' | 'original'>('processed');
  const [hoveredROI, setHoveredROI] = useState<string | null>(null);
  // State management
  const [activeTab, setActiveTab] = useState<'setup' | 'record' | 'review' | 'train'>('setup');
  const [inputSource, setInputSource] = useState<'upload' | 'camera' | 'oak' | 'remote'>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'rectangle' | 'polygon' | 'select'>('select');
  const [rois, setRois] = useState<ROI[]>([]);
  const [currentROI, setCurrentROI] = useState<ROI | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [frameRate, setFrameRate] = useState(30);
  // Avoid non-deterministic value during SSR. Generate session name on client mount.
  const [sessionName, setSessionName] = useState<string>('');
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [backendConnected, setBackendConnected] = useState(false);
  const [selectedROI, setSelectedROI] = useState<string | null>(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 1280, height: 720 });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0, visible: false });
  const remoteImageRef = useRef<HTMLImageElement>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  // Panel: only one of terminal | instructions is visible
  const showTerminal = activePanel === 'terminal';
  const showInstructions = activePanel === 'instructions';
  const [showConfirm, setShowConfirm] = useState(false);
  const [tempSessionName, setTempSessionName] = useState(sessionName);

  useEffect(() => {
    if (!sessionName) {
      const generated = `session_${Date.now()}`;
      setSessionName(generated);
      setTempSessionName(generated);
    }
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ROI tools: visible only when user clicks ROI icon (no flicker, stays open while working)
  const [roiToolsVisible, setRoiToolsVisible] = useState(false);

  // Toast notification system
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Workflow stepper
  const [showStepper, setShowStepper] = useState(true);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(10); // seconds
  const [remainingTime, setRemainingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [trainingWebSocket, setTrainingWebSocket] = useState<WebSocket | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);
  const [trainingStatus, setTrainingStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [captureCount, setCaptureCount] = useState(0);
  const [lastSaveStatus, setLastSaveStatus] = useState<string>('');
  const [isCapturingTrainingFrames, setIsCapturingTrainingFrames] = useState(false);

  // OAK Camera states
  const [oakCameraState, setOakCameraState] = useState<'idle' | 'streaming' | 'error'>('idle');
  const [oakDevices, setOakDevices] = useState<CameraDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isOakStreaming, setIsOakStreaming] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string>('');

  // Camera selection states
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [showCameraSelection, setShowCameraSelection] = useState(false);
  const [isLoadingCameras, setIsLoadingCameras] = useState(false);
  const [currentCameraStream, setCurrentCameraStream] = useState<MediaStream | null>(null);

  // Mobile responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'input' | 'roi' | 'settings' | 'training'>('input');


  // Backend extraction states
  const [backendExtractionMode, setBackendExtractionMode] = useState(false);
  const [extractionJobId, setExtractionJobId] = useState<string | null>(null);
  const [extractionStatus, setExtractionStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [extractionLogs, setExtractionLogs] = useState<string[]>([]);
  const [extractedFramesCount, setExtractedFramesCount] = useState(0);
  const [autoUploadToBackend, setAutoUploadToBackend] = useState(true);

  // Video playback states
  const [isStaticFrameMode, setIsStaticFrameMode] = useState(false);
  const [staticFrameImage, setStaticFrameImage] = useState<HTMLImageElement | null>(null);
  const staticFrameRef = useRef<HTMLImageElement | null>(null);
  const extractorVideoRef = useRef<HTMLVideoElement | null>(null);

  type PlaybackMode = 'video' | 'frames' | 'backend';
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('video');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);

  // Remote camera states
  const [remoteCameraSession, setRemoteCameraSession] = useState<RemoteCameraSession | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [remoteFrameUrl, setRemoteFrameUrl] = useState<string>('');
  const [remotePollingInterval, setRemotePollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [remoteCameraActive, setRemoteCameraActive] = useState(false);
  const [remoteCameraFrame, setRemoteCameraFrame] = useState<string | null>(null);
  const [remoteCameraStatus, setRemoteCameraStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Collapsible sidebar states
  const [collapsedSections, setCollapsedSections] = useState({
    inputSource: false,
    trainingTypes: false,
    roiTools: false,
    backendExtraction: false,
    recordingSettings: false,
    sessionInfo: false,
    debugTools: false,
  });

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setCurrentTime(current);
    }
  };
  const toggleDropdown = useCallback((id: ToolbarDropdownId) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  }, []);

  const closeDropdowns = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // --- Toast notification system ---
  // const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
  //   const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  //   setToasts(prev => [...prev, { id, message, type }]);
  //   setTimeout(() => {
  //     setToasts(prev => prev.filter(t => t.id !== id));
  //   }, 4000);
  // }, []);

  // --- Panel mutual exclusion toggle ---
  const togglePanel = useCallback((panel: PanelType) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);
  const inputSourceDropdownRef = useRef<HTMLDivElement>(null);
  const inferenceModelDropdownRef = useRef<HTMLDivElement>(null);
  const inferenceControlsDropdownRef = useRef<HTMLDivElement>(null);
  const inferenceAdvancedDropdownRef = useRef<HTMLDivElement>(null);
  const inferenceStatsDropdownRef = useRef<HTMLDivElement>(null);
  const roiToolsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openDropdown) return;

    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      let activeDropdown: HTMLDivElement | null = null;
      if (openDropdown === 'inputSource') activeDropdown = inputSourceDropdownRef.current;
      if (openDropdown === 'inferenceModel') activeDropdown = inferenceModelDropdownRef.current;
      if (openDropdown === 'inferenceControls') activeDropdown = inferenceControlsDropdownRef.current;
      if (openDropdown === 'inferenceAdvanced') activeDropdown = inferenceAdvancedDropdownRef.current;
      if (openDropdown === 'inferenceStats') activeDropdown = inferenceStatsDropdownRef.current;

      if (activeDropdown && !activeDropdown.contains(target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!collapsedSections.roiTools) return;

    const handleRoiToolsOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      if (roiToolsDropdownRef.current && !roiToolsDropdownRef.current.contains(target)) {
        setCollapsedSections((prev) => ({
          ...prev,
          roiTools: false,
        }));
      }
    };

    document.addEventListener('mousedown', handleRoiToolsOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleRoiToolsOutsideClick);
    };
  }, [collapsedSections.roiTools]);

  // Analysis modal states
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'extracting' | 'uploading' | 'processing' | 'completed'>('idle');
  const [analysisMessage, setAnalysisMessage] = useState('');
  const [analysisDetails, setAnalysisDetails] = useState<string[]>([]);
  const [currentFrameAnalysis, setCurrentFrameAnalysis] = useState(0);
  const [totalFramesAnalysis, setTotalFramesAnalysis] = useState(0);
  const [showUpload, setShowUpload] = useState(false)
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const drawingContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const oakStreamRef = useRef<HTMLImageElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const roiCanvasRef = useRef<HTMLCanvasElement>(null);
  const processedInferenceVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenImageRef = useRef<HTMLImageElement>(null);
  const popupRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoReloadAttemptsRef = useRef(0);
  const videoErrorCountRef = useRef(0);
  const [processedVideoUnsupported, setProcessedVideoUnsupported] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipHoveredRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showFullscreenPopup, setShowFullscreenPopup] = useState(false);
  const [popupCurrentFrame, setPopupCurrentFrame] = useState<'original' | 'processed'>('processed');
  const [popupOriginalFrame, setPopupOriginalFrame] = useState('');
  const [popupProcessedFrame, setPopupProcessedFrame] = useState('');
  const [isLiveView, setIsLiveView] = useState(true);
  const [lastFrameUpdateTime, setLastFrameUpdateTime] = useState(0);
  const [pendingROI, setPendingROI] = useState<ROI | null>(null);
  const initialTrainingTypes = {
    anomaly: true,
    sequential: false,
    motion: false,
  };
  const [trainingTypes, setTrainingTypes] = useState(initialTrainingTypes);

  const getSelectedTrainingOptions = useCallback((): TrainingType[] => {
    const selectedTypes = new Set<TrainingType>();

    if (trainingTypes.anomaly) selectedTypes.add('anomaly');
    if (trainingTypes.sequential) selectedTypes.add('sequential');
    if (trainingTypes.motion) selectedTypes.add('motion');

    rois.forEach((roi) => {
      roi.training.forEach((type) => selectedTypes.add(type));
    });

    if (selectedTypes.size === 0) {
      selectedTypes.add('anomaly');
    }

    return Array.from(selectedTypes);
  }, [rois, trainingTypes.anomaly, trainingTypes.motion, trainingTypes.sequential]);
  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (videoRef.current.paused) {
          await videoRef.current.play();
          setIsPlaying(true);
        } else {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      } catch (err) {
        addTerminalLog(`Playback error: ${err}`);
      }
    }
  };

  const isRemoteCameraReady = useCallback(() => {
    return remoteCameraStatus === 'connected' && remoteCameraFrame !== null;
  }, [remoteCameraStatus, remoteCameraFrame]);

  // Color system / design tokens
  const roiColors = ['#38bdf8', '#22c55e', '#f97316', '#eab308', '#ef4444', '#6366f1', '#06b6d4', '#a855f7'];
  const updateROI = (id: string, updates: Partial<ROI>) => {
    setRois(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };


  const itemDefault =
    "bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-100 border border-zinc-600/70 shadow-[0_14px_45px_rgba(0,0,0,0.85)] transition-colors transition-shadow duration-150 ease-out";
  const itemSelected =
    "bg-blue-600/15 text-blue-100 border border-blue-500/80 shadow-[0_18px_55px_rgba(37,99,235,0.75)] hover:bg-blue-600/25 active:translate-y-[1px]";

  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'localhost:8000';
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Helper functions
  const renderProgressBar = (percent: number, width = 20) => {
    const filled = Math.round((percent / 100) * width);
    return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${percent.toFixed(1)}%`;
  };

  const terminalContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = terminalContainerRef.current;
    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [terminalLogs]);

  const addTerminalLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    setTerminalLogs(prev => [...prev, logMessage]);
    setTrainingLogs(prev => [...prev, logMessage]);
  };

  const addExtractionLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] [BACKEND] ${message}`;
    setTerminalLogs(prev => [...prev, logMessage]);
    setExtractionLogs(prev => [...prev, logMessage]);
  };

  // Toggle sidebar sections
  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Analysis functions
  const startAnalysis = async (type: 'extraction' | 'upload' | 'training') => {
    setShowUpload(true);
    setAnalysisStatus('analyzing');
    setAnalysisProgress(0);
    setAnalysisMessage('Initializing analysis...');
    setAnalysisDetails([]);
    setCurrentFrameAnalysis(0);

    // Initial analysis details
    setAnalysisDetails([
      'Loading video metadata...',
      'Analyzing frame structure...',
      'Detecting scene changes...',
      'Preparing ROI data...'
    ]);

    // Simulate initial analysis
    await simulateAnalysisStep(1000, 'analyzing', 'Analyzing video content...', 10);

    if (type === 'extraction') {
      await startExtractionAnalysis();
    } else if (type === 'upload') {
      await startUploadAnalysis();
    } else if (type === 'training') {
      await startTrainingAnalysis();
    }
  };

  const simulateAnalysisStep = async (
    duration: number,
    status: typeof analysisStatus,
    message: string,
    progressIncrement: number
  ) => {
    return new Promise<void>((resolve) => {
      setAnalysisStatus(status);
      setAnalysisMessage(message);

      const interval = 100; // Update every 100ms
      const steps = duration / interval;
      const increment = progressIncrement / steps;

      let current = analysisProgress;
      const timer = setInterval(() => {
        current += increment;
        setAnalysisProgress(Math.min(current, analysisProgress + progressIncrement));

        if (current >= analysisProgress + progressIncrement) {
          clearInterval(timer);
          resolve();
        }
      }, interval);
    });
  };

  const startExtractionAnalysis = async () => {
    setAnalysisDetails([
      `Video: ${videoFile?.name || 'Unknown'}`,
      `Dimensions: ${videoDimensions.width}x${videoDimensions.height}`,
      `Frame Rate: ${frameRate} FPS`,
      `Duration: ${recordingDuration}s`,
      `Total Frames: ${recordingDuration * frameRate}`
    ]);

    // Step 1: Frame extraction
    await simulateAnalysisStep(2000, 'extracting', 'Extracting frames from video...', 25);
    setAnalysisDetails(prev => [...prev, '✓ Frame extraction started']);

    // Step 2: ROI processing
    await simulateAnalysisStep(1500, 'analyzing', 'Processing ROI data...', 15);
    setAnalysisDetails(prev => [...prev, `✓ ${rois.length} ROI${rois.length !== 1 ? 's' : ''} processed`]);

    // Step 3: Frame analysis
    await simulateAnalysisStep(3000, 'analyzing', 'Analyzing extracted frames...', 25);

    // Update frame count progress
    const totalFrames = recordingDuration * frameRate;
    setTotalFramesAnalysis(totalFrames);

    // Simulate frame-by-frame analysis
    for (let i = 0; i < totalFrames; i++) {
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate frame processing
      setCurrentFrameAnalysis(i + 1);
      const progress = 65 + ((i + 1) / totalFrames) * 25; // 65% to 90%
      setAnalysisProgress(progress);

      if ((i + 1) % 10 === 0) {
        setAnalysisMessage(`Analyzing frame ${i + 1} of ${totalFrames}...`);
      }
    }

    // Completion
    await simulateAnalysisStep(1000, 'completed', 'Extraction complete!', 10);
    setAnalysisDetails(prev => [...prev, '✓ All frames analyzed successfully']);
    setAnalysisMessage('Video analysis complete! Ready for AI training.');
  };

  const startUploadAnalysis = async () => {
    setAnalysisDetails([
      `Uploading to: ${NEXT_PUBLIC_BACKEND_URL}`,
      `File Size: ${videoFile ? (videoFile.size / 1024 / 1024).toFixed(2) : '0'} MB`,
      `Session: ${sessionName}`,
      `ROIs: ${rois.length}`,
      `Frame Rate: ${frameRate} FPS`
    ]);

    // Step 1: Preparing upload
    await simulateAnalysisStep(1000, 'uploading', 'Preparing data for upload...', 10);

    // Step 2: Uploading
    await simulateAnalysisStep(3000, 'uploading', 'Uploading to backend server...', 40);
    setAnalysisDetails(prev => [...prev, '✓ Data upload in progress']);

    // Step 3: Server processing
    await simulateAnalysisStep(4000, 'processing', 'Server processing data...', 30);
    setAnalysisDetails(prev => [...prev, '✓ Server processing frames']);

    // Step 4: Completion
    await simulateAnalysisStep(1000, 'completed', 'Upload complete!', 20);
    setAnalysisDetails(prev => [...prev, '✓ Upload completed successfully']);
    setAnalysisMessage('Data successfully uploaded to backend!');
  };



  const startTrainingAnalysis = async () => {
    const selectedTrainingOptions = getSelectedTrainingOptions();

    setAnalysisDetails([
      `Training Session: ${sessionName}`,
      `Input Source: ${inputSource}`,
      `Frame Rate: ${frameRate} FPS`,
      `ROIs: ${rois.length}`,
      `Training Modes: ${selectedTrainingOptions.join(', ')}`
    ]);

    // Step 1: Preparing training data
    await simulateAnalysisStep(2000, 'processing', 'Preparing training dataset...', 20);

    // Step 2: Model initialization
    await simulateAnalysisStep(3000, 'processing', 'Initializing AI models...', 30);
    setAnalysisDetails(prev => [...prev, '✓ AI models initialized']);

    // Step 3: Feature extraction
    await simulateAnalysisStep(4000, 'processing', 'Extracting features from frames...', 30);
    setAnalysisDetails(prev => [...prev, '✓ Feature extraction complete']);

    // Step 4: Training preparation
    await simulateAnalysisStep(2000, 'processing', 'Finalizing training setup...', 20);

    // Completion
    await simulateAnalysisStep(1000, 'completed', 'Training ready!', 20);
    setAnalysisDetails(prev => [...prev, '✓ Training setup complete']);
    setAnalysisMessage('AI training is ready to start!');
  };

  // Remote camera functions
  const generateSessionId = () => {
    return `remote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const startRemoteCameraSession = () => {
    const sessionId = generateSessionId();
    const session: RemoteCameraSession = {
      sessionId,
      connected: false,
      lastFrameTime: Date.now(),
      frameCount: 0
    };

    setRemoteCameraSession(session);
    setShowQRCode(true);
    setInputSource('remote');
    setRemoteCameraActive(true);
    setRemoteCameraStatus('connecting');

    // Generate the URL for mobile phone
    const baseUrl = window.location.origin;
    const mobileUrl = `${baseUrl}/mobile-camera?session=${sessionId}`;

    addTerminalLog(`📱 Remote camera session started: ${sessionId}`);
    addTerminalLog(`📱 Mobile URL: ${mobileUrl}`);
    addTerminalLog(`📱 Scan the QR code with your phone to connect`);

    // Start polling for frames
    startRemoteFramePolling(sessionId);

    return mobileUrl;
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [terminalLogs]);

  const startLiveTraining = async () => {
    try {
      addTerminalLog(`=== Starting Live Training with Remote Camera ===`);

      if (remoteCameraStatus !== 'connected') {
        showToast('Please connect remote camera first', "warning");
        return;
      }

      if (rois.length === 0) {
        addTerminalLog(`Mode: Full Frame (no ROIs drawn)`);
      } else {
        addTerminalLog(`Mode: ROI-based`);
        addTerminalLog(`Number of ROIs: ${rois.length}`);
      }

      setShowUpload(true);

      // Step 1: First capture frames from the canvas (like we do for other sources)
      addTerminalLog(`Step 1: Capturing frames from canvas...`);

      setIsRecording(true);
      setCaptureCount(0);
      const initialFrames = 30; // Capture 30 frames first

      // Use the existing canvas for capturing
      const videoCanvas = document.createElement('canvas');
      videoCanvas.width = videoDimensions.width;
      videoCanvas.height = videoDimensions.height;
      const videoCtx = videoCanvas.getContext('2d');

      if (!videoCtx) {
        throw new Error('Failed to create canvas context');
      }

      // Create hidden canvas for ROI captures
      const hiddenCanvas = document.createElement('canvas');
      hiddenCanvas.width = videoDimensions.width;
      hiddenCanvas.height = videoDimensions.height;
      const hiddenCtx = hiddenCanvas.getContext('2d');

      if (!hiddenCtx) {
        throw new Error('Failed to create hidden canvas context');
      }

      for (let i = 0; i < initialFrames; i++) {
        if (!isRecording || remoteCameraStatus !== 'connected') {
          addTerminalLog('Recording stopped or camera disconnected');
          break;
        }

        try {
          // Wait for remote camera frame to be available
          await new Promise(resolve => setTimeout(resolve, 100));

          if (!remoteCameraFrame) {
            addTerminalLog(`⚠ Waiting for remote camera frame ${i + 1}...`);
            continue;
          }

          // Draw the current remote frame to our canvas
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
          });

          // Draw to video canvas
          videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
          videoCtx.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);

          // Draw to hidden canvas (for ROI captures)
          hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
          hiddenCtx.drawImage(img, 0, 0, hiddenCanvas.width, hiddenCanvas.height);

          // Capture from canvas
          if (rois.length === 0) {
            // Full frame capture
            await captureFullFrameFromCanvas(videoCanvas, i);
          } else {
            // ROI-based capture
            for (const roi of rois) {
              await captureROIFromCanvas(hiddenCanvas, hiddenCtx, roi, i);
            }
          }

          setCaptureCount(prev => prev + 1);
          addTerminalLog(`✓ Captured frame ${i + 1}/${initialFrames}`);

          // Wait for next frame
          await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));

        } catch (error) {
          console.error(`Error capturing frame ${i}:`, error);
          // addTerminalLog(`âš  Error capturing frame ${i}: ${error.message}`);
        }
      }

      setIsRecording(false);
      addTerminalLog(`✓ Initial ${captureCount} frames captured and saved to session`);

      // Step 2: Verify session has frames
      addTerminalLog(`Step 2: Verifying session...`);

      try {
        const verifyResponse = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/sessions/${sessionName}/frame-count`);
        if (verifyResponse.ok) {
          const data = await verifyResponse.json();
          addTerminalLog(`✓ Session verified: ${data.total_frames || 0} frames available`);

          if (!data.total_frames || data.total_frames === 0) {
            throw new Error('No frames found in session');
          }
        } else {
          throw new Error('Failed to verify session');
        }
      } catch (error) {
        // addTerminalLog(`❌ Session verification failed: ${error.message}`);
        showToast('Failed to create session with frames. Please try again.', 'error');
        setShowUpload(false);
        return;
      }

      // Step 3: Start training session
      addTerminalLog(`Step 3: Starting training session...`);

      const trainingOptions = getSelectedTrainingOptions();
      addTerminalLog(`Training Types: ${trainingOptions.join(", ")}`);

      const trainingROIs = rois.length === 0
        ? [{
          id: 'full_frame',
          type: 'rectangle',
          points: [
            { x: 0, y: 0 },
            { x: videoDimensions.width, y: videoDimensions.height }
          ],
          label: 'Full Frame',
          color: '#3b82f6'
        }]
        : rois;

      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionName,
          rois: trainingROIs,
          frame_rate: frameRate,
          training_options: trainingOptions,
          source_type: 'remote_camera',
          live_mode: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        addTerminalLog(`✓ Live training started!`);
        addTerminalLog(`Training ID: ${result.training_id}`);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('mint:last-training-model-id', result.training_id);
        }

        // Step 4: Start continuous capture for ongoing training
        setIsRecording(true);

        let frameNumber = captureCount; // Continue from where we left off
        const captureInterval = setInterval(async () => {
          if (!isRecording || remoteCameraStatus !== 'connected') {
            clearInterval(captureInterval);
            return;
          }

          try {
            // Capture frame from canvas and send for inference
            if (remoteCameraFrame) {
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
              });

              videoCtx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
              videoCtx.drawImage(img, 0, 0, videoCanvas.width, videoCanvas.height);

              // Send frame for inference
              const blob = await new Promise<Blob | null>((resolve) => {
                videoCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
              });

              if (blob) {
                const inferenceFormData = new FormData();
                inferenceFormData.append('frame', blob);
                inferenceFormData.append('session_id', sessionName);
                inferenceFormData.append('training_id', result.training_id);
                inferenceFormData.append('frame_number', frameNumber.toString());

                await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/live-frame`, {
                  method: 'POST',
                  body: inferenceFormData,
                });

                frameNumber++;
                setCaptureCount(frameNumber);

                // Log progress every 10 frames
                if (frameNumber % 10 === 0) {
                  addTerminalLog(`📊 Sent ${frameNumber} frames for live inference`);
                }
              }
            }
          } catch (error) {
            console.error('Error sending live frame:', error);
          }
        }, 1000 / frameRate);

        // Store interval reference for cleanup
        recordingIntervalRef.current = captureInterval;

        // Connect to WebSocket for logs
        connectToTrainingWebSocket(result.training_id);
        setShowUpload(false);
        setActivePanel('terminal');
        setTrainingStatus('running');
      } else {
        const errorText = await response.text();
        addTerminalLog(`❌ ERROR: ${errorText}`);
        showToast(`Failed to start training: ${errorText}`, 'error');
        setShowUpload(false);
      }

    } catch (error) {
      console.error('Error starting live training:', error);
      // addTerminalLog(`❌ ERROR: ${error.message || error}`);
      setShowUpload(false);
    }
  };



  const startRecordingForRemote = async () => {
    try {
      if (!remoteCameraFrame) {
        showToast('No frame available from remote camera', 'warning');
        return;
      }

      setIsRecording(true);
      setCaptureCount(0);
      const framesToCapture = recordingDuration * frameRate;

      addTerminalLog(`=== Starting Recording ===`);
      addTerminalLog(`Session: ${sessionName}`);
      addTerminalLog(`Duration: ${recordingDuration} seconds`);
      addTerminalLog(`Frame Rate: ${frameRate} FPS`);
      addTerminalLog(`ROIs: ${rois.length} (${rois.length === 0 ? 'Full Frame mode' : 'ROI mode'})`);
      addTerminalLog(`========================`);

      for (let i = 0; i < framesToCapture; i++) {
        if (!isRecording) break;

        try {
          // Wait for a frame to be available
          if (!remoteCameraFrame) {
            await new Promise(resolve => setTimeout(resolve, 100));
            continue;
          }

          // Create image from base64
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
          });

          // Create canvas and draw image
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = videoDimensions.width;
          tempCanvas.height = videoDimensions.height;
          const tempCtx = tempCanvas.getContext('2d');

          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

            // Convert to blob
            const blob = await new Promise<Blob | null>((resolve) => {
              tempCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
            });

            if (blob) {
              // Send frame to backend
              const formData = new FormData();
              formData.append('frame', blob, `frame_${i}.jpg`);
              formData.append('session_id', sessionName);
              formData.append('frame_number', i.toString());
              formData.append('video_width', videoDimensions.width.toString());
              formData.append('video_height', videoDimensions.height.toString());

              // Add ROI data if we have ROIs
              if (rois.length > 0) {
                for (const roi of rois) {
                  const roiFormData = new FormData();
                  roiFormData.append('frame', blob, `frame_${i}_${roi.id}.jpg`);
                  roiFormData.append('session_id', sessionName);
                  roiFormData.append('roi_id', roi.id);
                  roiFormData.append('roi_label', roi.label);
                  roiFormData.append('roi_type', roi.type);
                  roiFormData.append('frame_number', i.toString());
                  roiFormData.append('video_width', videoDimensions.width.toString());
                  roiFormData.append('video_height', videoDimensions.height.toString());

                  const pointsArray = roi.points.map(p => [p.x, p.y]);
                  roiFormData.append('roi_points', JSON.stringify(pointsArray));

                  await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/frames/`, {
                    method: 'POST',
                    body: roiFormData,
                  });
                }
              } else {
                // Full frame mode
                await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/full-frame`, {
                  method: 'POST',
                  body: formData,
                });
              }

              setCaptureCount(prev => prev + 1);

              // Update progress
              const progress = ((i + 1) / framesToCapture) * 100;
              setRecordingProgress(progress);

              if ((i + 1) % 10 === 0) {
                addTerminalLog(`📸 Captured ${i + 1}/${framesToCapture} frames (${progress.toFixed(1)}%)`);
              }
            }
          }

          // Wait for next frame
          await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));
        } catch (error) {
          console.error(`Error capturing frame ${i}:`, error);
          // addTerminalLog(`⚠  Error capturing frame ${i}: ${error.message}`);
        }
      }

      setIsRecording(false);
      addTerminalLog(`✓ Recording completed. Captured ${captureCount} frames.`);

    } catch (error) {
      console.error('Error in recording:', error);
      // addTerminalLog(`❌ Recording error: ${error.message}`);
      setIsRecording(false);
    }
  };



  const startRemoteFramePolling = (sessionId: string) => {
    // Clear any existing interval
    if (remotePollingInterval) {
      clearInterval(remotePollingInterval);
    }

    // Poll every 100ms for smooth streaming
    const interval = setInterval(async () => {
      try {
        const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/frame/${sessionId}`);

        if (response.ok) {
          const data = await response.json();

          if (data.frame && data.timestamp) {
            // Create image from base64
            const img = new Image();
            img.onload = () => {
              // Set actual dimensions from the image
              setVideoDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight
              });

              // Update frame state
              setRemoteCameraFrame(data.frame);
              setRemoteCameraStatus('connected');
            };
            img.src = `data:image/jpeg;base64,${data.frame}`;

            // Update session
            setRemoteCameraSession(prev => prev ? {
              ...prev,
              connected: true,
              lastFrameTime: data.timestamp,
              frameCount: prev.frameCount + 1,
              deviceInfo: data.deviceInfo
            } : null);
          }
        }
      } catch (error) {
        console.error('Error polling remote frame:', error);

        // If no frame for 5 seconds, mark as disconnected
        if (remoteCameraSession && Date.now() - remoteCameraSession.lastFrameTime > 5000) {
          setRemoteCameraStatus('disconnected');
          setRemoteCameraSession(prev => prev ? { ...prev, connected: false } : null);
        }
      }
    }, 100); // 10 FPS polling

    setRemotePollingInterval(interval);
  };

  const stopRemoteCamera = () => {
    if (remotePollingInterval) {
      clearInterval(remotePollingInterval);
      setRemotePollingInterval(null);
    }

    if (remoteCameraSession) {
      // Notify backend to clean up
      authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/remote-camera/stop/${remoteCameraSession.sessionId}`, {
        method: 'POST'
      }).catch(console.error);
    }

    setRemoteCameraActive(false);
    setRemoteCameraStatus('disconnected');
    setRemoteCameraSession(null);
    setShowQRCode(false);
    setRemoteCameraFrame(null);
    if (inputSource === 'remote') {
      setInputSource('upload');
    }
    addTerminalLog('📱 Remote camera stopped');
  };


  // Add this useEffect to properly handle mobile camera dimensions
  useEffect(() => {
    if (inputSource === 'remote' && remoteCameraFrame) {
      // Force recalculation of canvas dimensions for mobile camera
      const updateMobileCanvasDimensions = () => {
        if (!containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;

        const containerWidth = container.clientWidth;
        const containerHeight = isMobile ? containerWidth * 0.75 : container.clientHeight;

        // Use actual mobile camera dimensions or default
        const mobileWidth = videoDimensions.width || 1280;
        const mobileHeight = videoDimensions.height || 720;

        const aspectRatio = mobileWidth / mobileHeight;
        let width = containerWidth;
        let height = containerWidth / aspectRatio;

        if (height > containerHeight) {
          height = containerHeight;
          width = containerHeight * aspectRatio;
        }

        const scaleX = width / mobileWidth;
        const scaleY = height / mobileHeight;
        const newScale = Math.min(scaleX, scaleY);

        const offsetX = (containerWidth - mobileWidth * newScale) / 2;
        const offsetY = (containerHeight - mobileHeight * newScale) / 2;

        setScale(newScale);
        setOffset({ x: offsetX, y: offsetY });

        canvas.width = containerWidth;
        canvas.height = containerHeight;
      };

      updateMobileCanvasDimensions();

      // Redraw canvas with correct dimensions
      drawCanvas();
    }
  }, [inputSource, remoteCameraFrame, videoDimensions, isMobile]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Initialize video extractor
  useEffect(() => {
    const v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.crossOrigin = 'anonymous';
    extractorVideoRef.current = v;

    return () => {
      v.src = '';
    };
  }, []);

  // Initialize canvas and connections
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) drawingContextRef.current = ctx;
    }

    // Create hidden canvas for capture
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = 1280;
    hiddenCanvas.height = 720;
    captureCanvasRef.current = hiddenCanvas;

    // Check connections
    checkBackendConnection();
    checkOakCameraConnection();
    listOakDevices();

    // Initial terminal message
    addTerminalLog('System initialized. Ready to start.');
    addTerminalLog('1. Select input source (upload, camera, OAK, or remote)');
    addTerminalLog('2. Draw ROIs on the video');
    addTerminalLog('3. Adjust recording settings');
    addTerminalLog('4. Click "Start AI Training"');

    // List available cameras on mount
    listAvailableCamerasOnMount();

    // Cleanup function
    return () => {
      if (currentCameraStream) {
        stopCamera();
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
      if (trainingWebSocket) {
        trainingWebSocket.close();
      }
      // Add remote camera cleanup
      if (remotePollingInterval) {
        clearInterval(remotePollingInterval);
      }
      if (remoteCameraSession) {
        stopRemoteCamera();
      }
    };
  }, []);

  // Video support checking
  const checkVideoSupport = (video: HTMLVideoElement): Promise<boolean> => {
    return new Promise((resolve) => {
      let resolved = false;

      const success = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(true);
        }
      };

      const fail = () => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      };

      const cleanup = () => {
        video.removeEventListener('canplay', success);
        video.removeEventListener('error', fail);
      };

      video.addEventListener('canplay', success);
      video.addEventListener('error', fail);

      // Timeout fallback
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve(false);
        }
      }, 2000);
    });
  };

  // FFmpeg frame extraction
  const extractFrameWithFFmpeg = async (file: File): Promise<HTMLImageElement> => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load();

    await ffmpeg.writeFile('input', await fetchFile(file));
    await ffmpeg.exec([
      '-i', 'input',
      '-vf', 'select=eq(n\\,12)',
      '-vframes', '1',
      'frame.png'
    ]);

    const data = await ffmpeg.readFile('frame.png');

    let blob: Blob;

    if (data instanceof Uint8Array) {
      blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
    } else {
      blob = new Blob(
        [new TextEncoder().encode(data)],
        { type: 'image/png' }
      );
    }

    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.src = url;
    await img.decode();

    return img;
  };

  // Video frame utilities
  const waitForVideoFrame = (video: HTMLVideoElement): Promise<void> => {
    return new Promise(resolve => {
      if ('requestVideoFrameCallback' in video) {
        video.requestVideoFrameCallback(() => resolve());
      } else {
        requestAnimationFrame(() => resolve());
      }
    });
  };

  const seekAndDecodeFrame = async (
    video: HTMLVideoElement,
    frameNumber: number,
    fps: number
  ) => {
    const targetTime = frameNumber / fps;

    if (video.paused) {
      await video.play().catch(() => { });
    }

    video.currentTime = Math.min(targetTime, video.duration || targetTime);
    await waitForVideoFrame(video);
    video.pause();
  };

  const extractFrame = async (
    frameNumber: number,
    fps: number,
    canvas: HTMLCanvasElement
  ) => {
    const video = extractorVideoRef.current;
    if (!video) throw new Error('Extractor video missing');

    const ctx = canvas.getContext('2d')!;
    const targetTime = frameNumber / fps;

    await new Promise<void>(resolve => {
      const onSeeked = () => {
        video.removeEventListener('seeked', onSeeked);
        resolve();
      };

      video.addEventListener('seeked', onSeeked);
      video.currentTime = Math.min(targetTime, video.duration || targetTime);
    });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0);
  };

  // Camera handling
  const listAvailableCamerasOnMount = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);

      if (videoDevices.length > 0) {
        const defaultCamera = videoDevices.find(device =>
          device.label.toLowerCase().includes('front') ||
          device.label.toLowerCase().includes('built-in') ||
          device.deviceId === 'default'
        );
        setSelectedCameraId(defaultCamera?.deviceId || videoDevices[0].deviceId);
      }

      addTerminalLog(`Found ${videoDevices.length} camera(s) on system`);
    } catch (error) {
      console.error('Error listing cameras on mount:', error);
    }
  };

  const listAvailableCameras = async () => {
    try {
      setIsLoadingCameras(true);
      try {
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
        tempStream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.log('Permission request failed, continuing with device enumeration');
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);

      if (videoDevices.length > 0) {
        const defaultCamera = videoDevices.find(device =>
          device.label.toLowerCase().includes('front') ||
          device.label.toLowerCase().includes('built-in') ||
          device.deviceId === 'default'
        );
        setSelectedCameraId(defaultCamera?.deviceId || videoDevices[0].deviceId);
      }

      addTerminalLog(`Found ${videoDevices.length} camera(s)`);
      setIsLoadingCameras(false);
      return videoDevices;
    } catch (error) {
      console.error('Error listing cameras:', error);
      addTerminalLog(`❌ Error accessing camera devices: ${error}`);
      setIsLoadingCameras(false);
      return [];
    }
  };

  const startCamera = async (deviceId?: string) => {
    try {
      // 1. Start with bare minimum constraints
      let constraints: MediaStreamConstraints = {
        video: true, // Let the browser choose defaults
        audio: false
      };

      // 2. Only apply device-specific constraints if a device is selected
      if (deviceId) {
        constraints.video = {
          deviceId: { exact: deviceId },
          // Use 'ideal' instead of 'exact' for dimensions to be more flexible
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // 3. Rest of your code to handle the stream...
      if (currentCameraStream) {
        stopCamera();
      }

      setCurrentCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setInputSource('camera');
        setShowCameraSelection(false);
        addTerminalLog('✓ Webcam started successfully');

        // Wait for video metadata to get actual resolution
        videoRef.current.onloadedmetadata = () => {
          const width = videoRef.current!.videoWidth;
          const height = videoRef.current!.videoHeight;
          setVideoDimensions({ width, height });
          updateCanvasDimensions();
          addTerminalLog(`✓ Camera resolution: ${width}x${height}`);
        };
      }
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      addTerminalLog(`❌ Error accessing camera: ${error.message}`);

      // 4. Fallback: Try without any constraints at all
      try {
        addTerminalLog('Trying with fallback constraints (video: true)...');
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

        setCurrentCameraStream(fallbackStream);
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          setInputSource('camera');
          setShowCameraSelection(false);
          addTerminalLog('✓ Webcam started with fallback constraints');
        }
      } catch (fallbackError: any) {
        addTerminalLog(`❌ Fallback also failed: ${fallbackError.message}`);
        showToast(`Could not access any camera. Error: ${fallbackError.message}`, 'error');
      }
    }
  };

  const stopCamera = () => {
    if (currentCameraStream) {
      currentCameraStream.getTracks().forEach(track => {
        track.stop();
      });
      setCurrentCameraStream(null);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null;
    }

    if (inputSource === 'camera') {
      setInputSource('upload');
    }

    addTerminalLog('✓ Camera stopped');
  };

  const handleCameraSelect = async () => {
    if (!selectedCameraId && availableCameras.length > 0) {
      setSelectedCameraId(availableCameras[0].deviceId);
    }

    if (selectedCameraId) {
      await startCamera(selectedCameraId);
    } else {
      await startCamera();
    }
  };

  const handleInputSourceChange = (newSource: 'upload' | 'camera' | 'oak' | 'remote') => {
    if (inputSource === 'camera' && newSource !== 'camera') {
      stopCamera();
    }

    if (inputSource === 'oak' && newSource !== 'oak') {
      if (isOakStreaming) {
        stopOakCamera();
      }
    }

    if (inputSource === 'remote' && newSource !== 'remote') {
      stopRemoteCamera();
    }

    setInputSource(newSource);
    setShowCameraSelection(false);
  };

  const inference = useInference({
    backendUrl: NEXT_PUBLIC_BACKEND_URL,
    inputSource,
    isOakStreaming,
    remoteCameraActive,
    remoteCameraFrame,
    selectedROI,
    videoDimensions,
    videoRef,
    oakStreamRef,
    getVideoFile: () => videoFile,
    onInputSourceChange: handleInputSourceChange,
    onVideoLoaded: (file, url) => {
      setVideoFile(file);
      setVideoUrl(url);
    },
    addTerminalLog,
  });

  const handleViewModeChange = (mode: 'training' | 'inference') => {
    if (mode === viewMode) {
      return;
    }

    closeDropdowns();
    setActivePanel(null);
    closeFullscreenPopup();
    if (mode === 'training') {
      void inference.stopInference();
    } else {
      setInferenceViewerMode('processed');
      void inference.loadModels();
      void inference.fetchLoadedModels();
    }
    setViewMode(mode);
  };

  const inferenceSourceVisibilityClass =
    viewMode === 'inference' && inferenceViewerMode === 'processed'
      ? 'opacity-0'
      : 'opacity-100';
  const backendVideoStatus = inference.backendVideoProcessing.status;
  const showPersistedProcessedVideo =
    Boolean(inference.processedVideoUrl) &&
    !processedVideoUnsupported &&
    ((backendVideoStatus === 'completed' || backendVideoStatus === 'paused') ||
      !inference.processedFrame);
  const showProcessedPreviewFrame =
    Boolean(inference.processedFrame) && !showPersistedProcessedVideo;
  const inferenceCurrentAnomalyCount = Math.max(
    inference.inferenceStats.anomalies,
    inference.predictions.filter((prediction) => prediction.is_anomaly).length
  );
  const inferenceTotalAnomalyCount = Math.max(
    inference.inferenceStats.totalAnomalies,
    inference.backendVideoProcessing.totalAnomalies,
    inferenceCurrentAnomalyCount
  );
  const isBackendVideoInferenceActive =
    backendVideoStatus === 'processing' ||
    backendVideoStatus === 'completed' ||
    backendVideoStatus === 'paused';
  const visibleInferenceAnomalyCount = isBackendVideoInferenceActive
    ? inferenceTotalAnomalyCount
    : inferenceCurrentAnomalyCount;

  const playProcessedInferenceVideo = useCallback(() => {
    setInferenceViewerMode('processed');
    const playVideo = () => {
      const videoElement = processedInferenceVideoRef.current;
      if (!videoElement) return;
      videoElement.currentTime = 0;
      void videoElement.play().catch(() => undefined);
    };

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(playVideo);
    } else {
      playVideo();
    }
  }, []);

  useEffect(() => {
    if (viewMode !== 'inference' || inferenceViewerMode !== 'processed' || !showPersistedProcessedVideo) {
      return;
    }

    const videoElement = processedInferenceVideoRef.current;
    if (!videoElement) return;

    void videoElement.play().catch(() => undefined);
  }, [
    inference.processedVideoUrl,
    inferenceViewerMode,
    showPersistedProcessedVideo,
    viewMode,
  ]);

  const captureOriginalFrame = useCallback(() => {
    if (typeof document === 'undefined') {
      return '';
    }

    if (inputSource === 'remote' && remoteCameraFrame) {
      return remoteCameraFrame.startsWith('data:image')
        ? remoteCameraFrame
        : `data:image/jpeg;base64,${remoteCameraFrame}`;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return '';
    }

    if (inputSource === 'oak' && oakStreamRef.current) {
      const image = oakStreamRef.current;
      const width = image.naturalWidth || videoDimensions.width;
      const height = image.naturalHeight || videoDimensions.height;
      if (width <= 0 || height <= 0) {
        return '';
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg', 0.92);
    }

    if (videoRef.current) {
      const video = videoRef.current;
      const width = video.videoWidth || videoDimensions.width;
      const height = video.videoHeight || videoDimensions.height;
      if (width <= 0 || height <= 0) {
        return '';
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg', 0.92);
    }

    return '';
  }, [
    inputSource,
    remoteCameraFrame,
    videoDimensions.height,
    videoDimensions.width,
  ]);

  const closeFullscreenPopup = useCallback(() => {
    setShowFullscreenPopup(false);
    setIsLiveView(false);
    if (popupRefreshIntervalRef.current) {
      clearInterval(popupRefreshIntervalRef.current);
      popupRefreshIntervalRef.current = null;
    }
  }, []);

  const refreshPopupFrame = useCallback(() => {
    if (popupCurrentFrame === 'original') {
      const frame = captureOriginalFrame();
      if (frame) {
        setPopupOriginalFrame(frame);
        setLastFrameUpdateTime(Date.now());
      }
      return;
    }

    if (showPersistedProcessedVideo && fullscreenVideoRef.current) {
      fullscreenVideoRef.current.currentTime = 0;
      void fullscreenVideoRef.current.play().catch(() => undefined);
      setLastFrameUpdateTime(Date.now());
      return;
    }

    if (inference.processedFrame) {
      setPopupProcessedFrame(inference.processedFrame);
      setLastFrameUpdateTime(Date.now());
    }
  }, [
    captureOriginalFrame,
    inference.processedFrame,
    popupCurrentFrame,
    showPersistedProcessedVideo,
  ]);

  const downloadPopupFrame = useCallback(() => {
    if (popupCurrentFrame === 'processed' && showPersistedProcessedVideo) {
      inference.downloadProcessedVideo();
      return;
    }

    const frameToDownload =
      popupCurrentFrame === 'original' ? popupOriginalFrame : popupProcessedFrame;
    if (!frameToDownload || typeof document === 'undefined') {
      return;
    }

    const link = document.createElement('a');
    link.href = frameToDownload;
    link.download = `inference_${popupCurrentFrame}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [
    inference,
    popupCurrentFrame,
    popupOriginalFrame,
    popupProcessedFrame,
    showPersistedProcessedVideo,
  ]);

  const openFullscreenPopup = useCallback(async () => {
    const originalFrame = captureOriginalFrame();
    const hasProcessedContent = Boolean(showPersistedProcessedVideo || inference.processedFrame);

    if (!originalFrame && !hasProcessedContent) {
      addTerminalLog('❌ No frames available to show in popup');
      return;
    }

    setPopupOriginalFrame(originalFrame || '');
    setPopupProcessedFrame(inference.processedFrame || '');
    setPopupCurrentFrame(hasProcessedContent ? 'processed' : 'original');
    setIsLiveView(true);
    setShowFullscreenPopup(true);
    setLastFrameUpdateTime(Date.now());

    if (showPersistedProcessedVideo) {
      setInferenceViewerMode('processed');
      window.requestAnimationFrame(() => {
        if (fullscreenVideoRef.current) {
          fullscreenVideoRef.current.currentTime = 0;
          void fullscreenVideoRef.current.play().catch(() => undefined);
        }
      });
    }
  }, [
    addTerminalLog,
    captureOriginalFrame,
    inference.processedFrame,
    showPersistedProcessedVideo,
  ]);

  useEffect(() => {
    if (!showFullscreenPopup) return;

    if (popupCurrentFrame === 'processed' && inference.processedFrame && !showPersistedProcessedVideo) {
      setPopupProcessedFrame(inference.processedFrame);
      setLastFrameUpdateTime(Date.now());
    }

    if (popupCurrentFrame === 'original' && isLiveView) {
      const frame = captureOriginalFrame();
      if (frame) {
        setPopupOriginalFrame(frame);
        setLastFrameUpdateTime(Date.now());
      }
    }
  }, [
    captureOriginalFrame,
    inference.processedFrame,
    isLiveView,
    popupCurrentFrame,
    showFullscreenPopup,
    showPersistedProcessedVideo,
  ]);

  useEffect(() => {
    if (!showFullscreenPopup || popupCurrentFrame !== 'processed' || !showPersistedProcessedVideo) {
      return;
    }

    const videoElement = fullscreenVideoRef.current;
    if (!videoElement) return;

    void videoElement.play().catch(() => undefined);
  }, [
    inference.processedVideoUrl,
    popupCurrentFrame,
    showFullscreenPopup,
    showPersistedProcessedVideo,
  ]);

  useEffect(() => {
    if (!showFullscreenPopup || !isLiveView || showPersistedProcessedVideo) {
      if (popupRefreshIntervalRef.current) {
        clearInterval(popupRefreshIntervalRef.current);
        popupRefreshIntervalRef.current = null;
      }
      return;
    }

    popupRefreshIntervalRef.current = setInterval(() => {
      if (popupCurrentFrame === 'original') {
        const frame = captureOriginalFrame();
        if (frame) {
          setPopupOriginalFrame(frame);
          setLastFrameUpdateTime(Date.now());
        }
      } else if (inference.processedFrame) {
        setPopupProcessedFrame(inference.processedFrame);
        setLastFrameUpdateTime(Date.now());
      }
    }, 120);

    return () => {
      if (popupRefreshIntervalRef.current) {
        clearInterval(popupRefreshIntervalRef.current);
        popupRefreshIntervalRef.current = null;
      }
    };
  }, [
    captureOriginalFrame,
    inference.processedFrame,
    isLiveView,
    popupCurrentFrame,
    showFullscreenPopup,
    showPersistedProcessedVideo,
  ]);

  useEffect(() => {
    if (typeof window === 'undefined' || !showFullscreenPopup) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        closeFullscreenPopup();
      } else if (event.key === 'k' || event.key === 'K') {
        setPopupCurrentFrame((prev) => (prev === 'original' ? 'processed' : 'original'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeFullscreenPopup, showFullscreenPopup]);

  useEffect(() => {
    if (!showFullscreenPopup) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showFullscreenPopup]);

  useEffect(() => {
    if (viewMode !== 'inference') return;
    if (
      inference.backendVideoProcessing.status !== 'completed' &&
      inference.backendVideoProcessing.status !== 'paused'
    ) {
      return;
    }
    if (!inference.processedVideoUrl) return;
    playProcessedInferenceVideo();
  }, [
    inference.backendVideoProcessing.status,
    inference.processedVideoUrl,
    playProcessedInferenceVideo,
    viewMode,
  ]);

  // Reset video error tracking when URL changes
  useEffect(() => {
    if (inference.processedVideoUrl) {
      videoReloadAttemptsRef.current = 0;
      videoErrorCountRef.current = 0;
      setProcessedVideoUnsupported(false);
    }
  }, [inference.processedVideoUrl]);

  // Backend extraction functions
  const uploadVideoToBackend = async (file: File) => {
    try {
      // Show analysis modal
      startAnalysis('upload');

      setExtractionStatus('uploading');
      addExtractionLog(`📤 Uploading video to backend for frame extraction...`);
      addExtractionLog(`File: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

      // Prepare ROI data
      const roiData = rois.map(roi => ({
        id: roi.id,
        label: roi.label,
        type: roi.type,
        points: roi.points.map(p => ({ x: p.x, y: p.y }))
      }));

      const formData = new FormData();
      formData.append('video', file);
      formData.append('session_id', sessionName);
      formData.append('rois', JSON.stringify(roiData));
      formData.append('frame_rate', frameRate.toString());
      formData.append('video_width', videoDimensions.width.toString());
      formData.append('video_height', videoDimensions.height.toString());

      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/upload-video`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setExtractionJobId(result.job_id);
        setExtractionStatus('processing');
        addExtractionLog(`✅ Video uploaded successfully`);
        addExtractionLog(`🔧 Extraction Job ID: ${result.job_id}`);
        addExtractionLog(`⏳ Frame extraction started on backend...`);


        // Start polling for extraction status
        pollExtractionStatus(result.job_id);

      } else {
        const errorText = await response.text();
        addExtractionLog(`❌ Failed to upload video: ${errorText}`);
        setExtractionStatus('failed');
        setShowUpload(false);
      }

    } catch (error) {
      console.error('Error uploading video:', error);
      addExtractionLog(`❌ Error uploading video: ${error}`);
      setExtractionStatus('failed');
      setShowUpload(false);
    }
  };

  const pollExtractionStatus = async (jobId: string) => {
    const poll = async () => {
      try {
        const response = await fetch(
          `http://${NEXT_PUBLIC_BACKEND_URL}/api/training/extraction-status/${jobId}`
        );

        if (response.ok) {
          const status = await response.json();

          setExtractionProgress(status.progress || 0);
          setExtractionStatus(status.status as any);

          // Update extracted frames count
          if (status.extracted_frames) {
            setExtractedFramesCount(status.extracted_frames);
          }

          // Update logs
          if (status.logs && status.logs.length > 0) {
            const newLogs = status.logs.filter((log: string) =>
              !extractionLogs.includes(log)
            );

            if (newLogs.length > 0) {
              newLogs.forEach((log: string) => addExtractionLog(log));
              setExtractionLogs(prev => [...prev, ...newLogs]);
            }
          }

          // Update analysis modal progress
          setAnalysisProgress(status.progress || 0);
          setCurrentFrameAnalysis(status.extracted_frames || 0);

          // Continue polling if still processing
          if (status.status === 'processing') {
            setTimeout(poll, 1000);
          } else if (status.status === 'completed') {
            addExtractionLog(`✅ Backend frame extraction completed!`);
            addExtractionLog(`📊 Total frames extracted: ${status.extracted_frames}`);
            addExtractionLog(`🎯 Ready for training`);

            // Update capture count
            setCaptureCount(status.extracted_frames || 0);

            // Update analysis modal
            setAnalysisStatus('completed');
            setAnalysisMessage('Frame extraction completed!');
            setAnalysisDetails(prev => [...prev, `✓ ${status.extracted_frames} frames extracted`]);

          } else if (status.status === 'failed') {
            addExtractionLog(`❌ Backend frame extraction failed`);
            setShowUpload(false);
          }
        }
      } catch (error) {
        console.error('Error polling extraction status:', error);
        // Retry after delay
        setTimeout(poll, 2000);
      }
    };

    poll();
  };

  const cancelBackendExtraction = async () => {
    if (extractionJobId) {
      addExtractionLog(`Cancelling backend extraction...`);
      setExtractionStatus('failed');
      setBackendExtractionMode(false);
      setShowUpload(false);
    }
  };

  // Video upload handler
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (viewMode === 'inference') {
      // Keep shared training/inference video container state aligned.
      setBackendExtractionMode(false);
      setExtractionStatus('idle');
      setIsStaticFrameMode(false);
      setStaticFrameImage(null);
      setPlaybackMode('video');

      await inference.handleInferenceVideoUpload(event);
      closeDropdowns();
      event.target.value = '';
      return;
    }

    if (!file || !videoRef.current || !canvasRef.current) return;

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setIsStaticFrameMode(false);
    setStaticFrameImage(null);
    setBackendExtractionMode(false);
    setExtractionStatus('idle');

    const video = videoRef.current;
    video.src = url;

    addTerminalLog(`📂 Video uploaded: ${file.name}`);
    addTerminalLog(`🔍 Checking video codec support...`);

    const supported = await checkVideoSupport(video);

    // Prepare extractor video
    if (extractorVideoRef.current) {
      extractorVideoRef.current.src = url;
      await extractorVideoRef.current.play().catch(() => { });
      extractorVideoRef.current.pause();
      extractorVideoRef.current.currentTime = 0;
    }

    // CASE 1: Browser-supported video
    if (supported) {
      setPlaybackMode('video');
      setIsStaticFrameMode(false);

      video.addEventListener('loadedmetadata', () => {
        const width = video.videoWidth || 1280;
        const height = video.videoHeight || 720;
        setVideoDimensions({ width, height });
        updateCanvasDimensions();
        addTerminalLog(`✅ Video supported. Using native playback.`);
      }, { once: true });

      closeDropdowns();
      event.target.value = '';
      return;
    }

    // CASE 2: Unsupported â†’ BACKEND EXTRACTION MODE
    addTerminalLog(`⚠ Unsupported codec. Switching to backend extraction mode.`);
    setBackendExtractionMode(true);
    setIsStaticFrameMode(true);
    setPlaybackMode('backend');

    // Extract a static frame for UI preview using FFmpeg
    try {
      const img = await extractFrameWithFFmpeg(file);
      staticFrameRef.current = img;
      setStaticFrameImage(img);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0, img.width, img.height);

      setVideoDimensions({
        width: img.width,
        height: img.height,
      });

      addTerminalLog(`🖼 Static preview frame loaded (${img.width}x${img.height})`);
      addTerminalLog(`🔄 Video will be processed on backend for frame extraction`);

      // Show analysis modal
      setTimeout(() => {
        startAnalysis('extraction');
      }, 500);

      // Auto-upload to backend
      if (autoUploadToBackend) {
        addTerminalLog(`ðŸ“¤ Auto-uploading video to backend...`);
        setTimeout(() => {
          if (backendExtractionMode) {
            uploadVideoToBackend(file);
          }
        }, 2000);
      } else {
        addTerminalLog(`📤 Click "Process on Backend" button to start extraction`);
      }

    } catch (err) {
      addTerminalLog(`❌ Failed to extract preview frame`);
      console.error(err);

      // Fallback: Create blank canvas
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      canvas.width = 1280;
      canvas.height = 720;
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText('Unsupported video format', 20, 50);
      ctx.fillText('Uploading to backend for processing...', 20, 80);
    }

    closeDropdowns();
    event.target.value = '';
  };

  // Update canvas dimensions
  const updateCanvasDimensions = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const containerWidth = container.clientWidth;
    const containerHeight = isMobile ? containerWidth * 0.75 : container.clientHeight;

    const aspectRatio = videoDimensions.width / videoDimensions.height;
    let width = containerWidth;
    let height = containerWidth / aspectRatio;

    if (height > containerHeight) {
      height = containerHeight;
      width = containerHeight * aspectRatio;
    }

    const scaleX = width / videoDimensions.width;
    const scaleY = height / videoDimensions.height;
    const newScale = Math.min(scaleX, scaleY);

    const offsetX = (containerWidth - videoDimensions.width * newScale) / 2;
    const offsetY = (containerHeight - videoDimensions.height * newScale) / 2;

    setScale(newScale);
    setOffset({ x: offsetX, y: offsetY });

    canvas.width = containerWidth;
    canvas.height = containerHeight;
  }, [videoDimensions, isMobile]);

  // Video metadata loaded
  const handleVideoLoad = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;
      setCurrentTime(videoRef.current.currentTime);

      setVideoDimensions({ width, height });
      updateCanvasDimensions();
      addTerminalLog(`✓ Video loaded: ${width}x${height}`);
    }
  }, [updateCanvasDimensions]);

  // OAK stream load
  const handleOakStreamLoad = useCallback(() => {
    if (oakStreamRef.current) {
      const img = oakStreamRef.current;
      setVideoDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
      updateCanvasDimensions();
      addTerminalLog(`✓ OAK Stream loaded: ${img.naturalWidth}x${img.naturalHeight}`);
    }
  }, [updateCanvasDimensions]);

  // Resize handler
  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions);
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
    };
  }, [updateCanvasDimensions]);

  // Draw function
  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !drawingContextRef.current) return;

    const canvas = canvasRef.current;
    const ctx = drawingContextRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw static frame for backend mode
    if (backendExtractionMode && staticFrameRef.current) {
      const img = staticFrameRef.current;
      ctx.drawImage(
        img,
        offset.x,
        offset.y,
        videoDimensions.width * scale,
        videoDimensions.height * scale
      );
    }

    // Draw video bounds
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(offset.x, offset.y, videoDimensions.width * scale, videoDimensions.height * scale);

    // Draw all ROIs
    rois.forEach((roi, index) => {
      const color = roiColors[index % roiColors.length];

      if (roi.type === 'rectangle' && roi.points.length === 2) {
        const [p1, p2] = roi.points;
        const x = Math.min(p1.x, p2.x) * scale + offset.x;
        const y = Math.min(p1.y, p2.y) * scale + offset.y;
        const width = Math.abs(p2.x - p1.x) * scale;
        const height = Math.abs(p2.y - p1.y) * scale;

        ctx.fillStyle = `${color}40`;
        ctx.fillRect(x, y, width, height);

        ctx.strokeStyle = color;
        ctx.lineWidth = roi.id === selectedROI ? (isMobile ? 4 : 3) : (isMobile ? 3 : 2);
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = color;
        ctx.font = isMobile ? 'bold 14px Inter, sans-serif' : 'bold 12px Inter, sans-serif';
        ctx.fillText(roi.label, x + 5, y - 5);

      } else if (roi.type === 'polygon' && roi.points.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(roi.points[0].x * scale + offset.x, roi.points[0].y * scale + offset.y);

        for (let i = 1; i < roi.points.length; i++) {
          ctx.lineTo(roi.points[i].x * scale + offset.x, roi.points[i].y * scale + offset.y);
        }

        ctx.closePath();
        ctx.fillStyle = `${color}40`;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = roi.id === selectedROI ? (isMobile ? 4 : 3) : (isMobile ? 3 : 2);
        ctx.stroke();

        roi.points.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x * scale + offset.x, point.y * scale + offset.y, isMobile ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        });

        const centerX = roi.points.reduce((sum, p) => sum + p.x, 0) / roi.points.length;
        const centerY = roi.points.reduce((sum, p) => sum + p.y, 0) / roi.points.length;
        ctx.fillStyle = color;
        ctx.font = isMobile ? 'bold 14px Inter, sans-serif' : 'bold 12px Inter, sans-serif';
        ctx.fillText(roi.label, centerX * scale + offset.x - 15, centerY * scale + offset.y);
      }
    });

    // Draw current ROI being drawn
    if (currentROI && isDrawing) {
      const color = roiColors[rois.length % roiColors.length];

      if (currentROI.type === 'rectangle' && currentROI.points.length === 2) {
        const [p1, p2] = currentROI.points;
        const x = Math.min(p1.x, p2.x) * scale + offset.x;
        const y = Math.min(p1.y, p2.y) * scale + offset.y;
        const width = Math.abs(p2.x - p1.x) * scale;
        const height = Math.abs(p2.y - p1.y) * scale;

        ctx.strokeStyle = color;
        ctx.lineWidth = isMobile ? 3 : 2;
        ctx.setLineDash([5, 3]);
        ctx.strokeRect(x, y, width, height);
        ctx.setLineDash([]);

      } else if (currentROI.type === 'polygon' && currentROI.points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentROI.points[0].x * scale + offset.x, currentROI.points[0].y * scale + offset.y);

        for (let i = 1; i < currentROI.points.length; i++) {
          ctx.lineTo(currentROI.points[i].x * scale + offset.x, currentROI.points[i].y * scale + offset.y);
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = isMobile ? 3 : 2;
        ctx.setLineDash([5, 3]);
        ctx.stroke();
        ctx.setLineDash([]);

        currentROI.points.forEach((point, i) => {
          ctx.beginPath();
          ctx.arc(point.x * scale + offset.x, point.y * scale + offset.y, isMobile ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        });
      }
    }
  }, [rois, currentROI, isDrawing, selectedROI, scale, offset, videoDimensions, isMobile, backendExtractionMode]);

  // Redraw when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const hoveredROIData = hoveredROI ? rois.find((roi) => roi.id === hoveredROI) ?? null : null;
  const showLegacyHoverOverlay = false;

  const clearTooltipHideTimeout = useCallback(() => {
    if (tooltipHideTimeoutRef.current) {
      clearTimeout(tooltipHideTimeoutRef.current);
      tooltipHideTimeoutRef.current = null;
    }
  }, []);

  const scheduleTooltipHide = useCallback((delay = 220) => {
    clearTooltipHideTimeout();
    tooltipHideTimeoutRef.current = setTimeout(() => {
      tooltipHideTimeoutRef.current = null;
      if (!tooltipHoveredRef.current) {
        setHoveredROI(null);
      }
    }, delay);
  }, [clearTooltipHideTimeout]);

  const getROIBoundsInContainer = useCallback((roi: ROI) => {
    if (roi.type === 'rectangle' && roi.points.length === 2) {
      const [p1, p2] = roi.points;
      const x = Math.min(p1.x, p2.x) * scale + offset.x;
      const y = Math.min(p1.y, p2.y) * scale + offset.y;
      const width = Math.abs(p2.x - p1.x) * scale;
      const height = Math.abs(p2.y - p1.y) * scale;
      return { x, y, width: Math.max(width, 1), height: Math.max(height, 1) };
    }

    if (roi.points.length === 0) {
      return { x: offset.x, y: offset.y, width: 1, height: 1 };
    }

    const xs = roi.points.map((point) => point.x);
    const ys = roi.points.map((point) => point.y);
    const minX = Math.min(...xs) * scale + offset.x;
    const minY = Math.min(...ys) * scale + offset.y;
    const maxX = Math.max(...xs) * scale + offset.x;
    const maxY = Math.max(...ys) * scale + offset.y;

    return {
      x: minX,
      y: minY,
      width: Math.max(maxX - minX, 1),
      height: Math.max(maxY - minY, 1)
    };
  }, [scale, offset]);

  const updateTooltipPosition = useCallback(() => {
    if (!hoveredROIData || !containerRef.current || !tooltipRef.current || viewMode !== 'training') {
      setTooltipPosition((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const roiBounds = getROIBoundsInContainer(hoveredROIData);
    const roiRect = {
      left: containerRect.left + roiBounds.x,
      top: containerRect.top + roiBounds.y,
      right: containerRect.left + roiBounds.x + roiBounds.width,
      bottom: containerRect.top + roiBounds.y + roiBounds.height,
      width: roiBounds.width,
      height: roiBounds.height
    };
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;
    const viewportPadding = 8;
    const gap = 12;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const candidates = [
      {
        left: roiRect.right + gap,
        top: roiRect.top + (roiRect.height - tooltipHeight) / 2
      },
      {
        left: roiRect.left - tooltipWidth - gap,
        top: roiRect.top + (roiRect.height - tooltipHeight) / 2
      },
      {
        left: roiRect.left + (roiRect.width - tooltipWidth) / 2,
        top: roiRect.bottom + gap
      },
      {
        left: roiRect.left + (roiRect.width - tooltipWidth) / 2,
        top: roiRect.top - tooltipHeight - gap
      }
    ];

    const fitsViewport = (candidate: { left: number; top: number }) => (
      candidate.left >= viewportPadding &&
      candidate.top >= viewportPadding &&
      candidate.left + tooltipWidth <= viewportWidth - viewportPadding &&
      candidate.top + tooltipHeight <= viewportHeight - viewportPadding
    );

    const viewportOverflow = (candidate: { left: number; top: number }) => {
      const leftOverflow = Math.max(viewportPadding - candidate.left, 0);
      const topOverflow = Math.max(viewportPadding - candidate.top, 0);
      const rightOverflow = Math.max(candidate.left + tooltipWidth - (viewportWidth - viewportPadding), 0);
      const bottomOverflow = Math.max(candidate.top + tooltipHeight - (viewportHeight - viewportPadding), 0);
      return leftOverflow + topOverflow + rightOverflow + bottomOverflow;
    };

    const chosenCandidate = candidates.find(fitsViewport) ??
      candidates.reduce((best, current) => (
        viewportOverflow(current) < viewportOverflow(best) ? current : best
      ));

    const clampedLeft = Math.min(
      Math.max(chosenCandidate.left, viewportPadding),
      Math.max(viewportPadding, viewportWidth - tooltipWidth - viewportPadding)
    );
    const clampedTop = Math.min(
      Math.max(chosenCandidate.top, viewportPadding),
      Math.max(viewportPadding, viewportHeight - tooltipHeight - viewportPadding)
    );

    setTooltipPosition({ left: clampedLeft, top: clampedTop, visible: true });
  }, [hoveredROIData, getROIBoundsInContainer, viewMode]);

  useEffect(() => {
    if (!hoveredROIData || viewMode !== 'training') {
      setTooltipPosition((prev) => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }

    const frame = window.requestAnimationFrame(updateTooltipPosition);
    const handleViewportChange = () => updateTooltipPosition();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [hoveredROIData, updateTooltipPosition, viewMode]);

  useEffect(() => () => clearTooltipHideTimeout(), [clearTooltipHideTimeout]);

  // Canvas interaction functions
  const getCanvasCoordinates = (clientX: number, clientY: number): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const convertToVideoCoordinates = (canvasPoint: Point): Point => {
    return {
      x: (canvasPoint.x - offset.x) / scale,
      y: (canvasPoint.y - offset.y) / scale
    };
  };

  const getVideoCoordinates = (clientX: number, clientY: number): Point => {
    const canvasCoords = getCanvasCoordinates(clientX, clientY);

    // For remote camera, use actual image dimensions
    if (inputSource === 'remote' && remoteImageRef.current) {
      const img = remoteImageRef.current;
      const rect = canvasRef.current?.getBoundingClientRect();

      if (!rect) return { x: 0, y: 0 };

      // Get displayed dimensions (accounting for object-contain scaling)
      const displayedWidth = videoDimensions.width * scale;
      const displayedHeight = videoDimensions.height * scale;

      // Calculate position within the displayed image
      const relativeX = (canvasCoords.x - offset.x) / scale;
      const relativeY = (canvasCoords.y - offset.y) / scale;

      // Clamp to image bounds
      const boundedX = Math.max(0, Math.min(relativeX, videoDimensions.width));
      const boundedY = Math.max(0, Math.min(relativeY, videoDimensions.height));

      return { x: boundedX, y: boundedY };
    }

    // Original logic for other sources
    return convertToVideoCoordinates(canvasCoords);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const videoCoords = getVideoCoordinates(event.clientX, event.clientY);

    if (drawingMode === 'rectangle') {
      if (!isDrawing) {
        const newROI: ROI = {
          id: `roi_${Date.now()}`,
          type: 'rectangle',
          points: [videoCoords, videoCoords],
          label: `ROI ${rois.length + 1}`,
          color: roiColors[rois.length % roiColors.length],
          training: []
        };

        setCurrentROI(newROI);
        setIsDrawing(true);

      } else if (currentROI && currentROI.type === 'rectangle') {
        const updatedPoints = [...currentROI.points];
        updatedPoints[1] = videoCoords;
        const updatedROI = { ...currentROI, points: updatedPoints };

        // Instead of committing immediately:
        setPendingROI(updatedROI);
        setTimeout(() => setIsOpen(true), 500); // open popup
        setCurrentROI(null);
        setIsDrawing(false);
        // else if (currentROI && currentROI.type === 'rectangle') {
        //         const updatedPoints = [...currentROI.points];
        //         updatedPoints[1] = videoCoords;
        //         const updatedROI = { ...currentROI, points: updatedPoints };
        //         setRois(prev => [...prev, updatedROI]);
        //         setCurrentROI(null);
        //         setIsDrawing(false);
        //         setSelectedROI(updatedROI.id);
        //         addTerminalLog(`✓ Created ROI: ${updatedROI.label} (${updatedROI.type})`);
      }
    } else if (drawingMode === 'polygon') {
      if (!currentROI) {
        const newROI: ROI = {
          id: `roi_${Date.now()}`,
          type: 'polygon',
          points: [videoCoords],
          label: `ROI ${rois.length + 1}`,
          color: roiColors[rois.length % roiColors.length],
          training: []//here I have to pass the selected training 

        };

        setCurrentROI(newROI);
        setIsDrawing(true);
      } else {
        const updatedPoints = [...currentROI.points, videoCoords];
        setCurrentROI({ ...currentROI, points: updatedPoints });

        if (updatedPoints.length > 2) {
          const first = updatedPoints[0];
          const last = updatedPoints[updatedPoints.length - 1];
          const distance = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);

          if (distance < 20) {

            finishPolygon();
          }
        }
      }
    } else if (drawingMode === 'select') {
      let clickedROI = null;
      for (const roi of rois) {
        if (isPointInROI(videoCoords, roi)) {
          clickedROI = roi;
          break;
        }
      }
      setSelectedROI(clickedROI?.id || null);
    }
  };

  const handleCanvasTouch = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      const videoCoords = getVideoCoordinates(touch.clientX, touch.clientY);

      if (drawingMode === 'rectangle') {
        if (!isDrawing) {
          const newROI: ROI = {
            id: `roi_${Date.now()}`,
            type: 'rectangle',
            points: [videoCoords, videoCoords],
            label: `ROI ${rois.length + 1}`,
            color: roiColors[rois.length % roiColors.length],
            training: []
          };
          setCurrentROI(newROI);
          setIsDrawing(true);
        } else if (currentROI && currentROI.type === 'rectangle') {
          const updatedPoints = [...currentROI.points];
          updatedPoints[1] = videoCoords;
          const updatedROI = { ...currentROI, points: updatedPoints };
          setPendingROI(updatedROI);
          setTimeout(() => setIsOpen(true), 500); // open popup
          setCurrentROI(null);
          setIsDrawing(false);

          // setRois(prev => [...prev, updatedROI]);
          // setCurrentROI(null);
          // setIsDrawing(false);
          // setSelectedROI(updatedROI.id);
          // addTerminalLog(`✓ Created ROI: ${updatedROI.label} (${updatedROI.type})`);
        }
      } else if (drawingMode === 'polygon') {
        if (!currentROI) {
          const newROI: ROI = {
            id: `roi_${Date.now()}`,
            type: 'polygon',
            points: [videoCoords],
            label: `ROI ${rois.length + 1}`,
            color: roiColors[rois.length % roiColors.length],
            training: []
          };
          setCurrentROI(newROI);
          setIsDrawing(true);
        } else {
          const updatedPoints = [...currentROI.points, videoCoords];
          setCurrentROI({ ...currentROI, points: updatedPoints });

          if (updatedPoints.length > 2) {
            const first = updatedPoints[0];
            const last = updatedPoints[updatedPoints.length - 1];
            const distance = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);

            if (distance < 30) {
              finishPolygon();
            }
          }
        }
      } else if (drawingMode === 'select') {
        let clickedROI = null;
        for (const roi of rois) {
          if (isPointInROI(videoCoords, roi)) {
            clickedROI = roi;
            break;
          }
        }
        setSelectedROI(clickedROI?.id || null);
      }
    }
  };

  const handleCanvasTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing || !currentROI || event.touches.length !== 1) return;

    const touch = event.touches[0];
    const videoCoords = getVideoCoordinates(touch.clientX, touch.clientY);

    if (currentROI.type === 'rectangle') {
      const updatedPoints = [...currentROI.points];
      updatedPoints[1] = videoCoords;
      setCurrentROI({ ...currentROI, points: updatedPoints });
    }
  };
  // --- Interaction Logic ---
  const getVideoCoords = (clientX: number, clientY: number): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale
    };
  };
  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getVideoCoords(event.clientX, event.clientY);

    // Hover detection
    let foundHover: string | null = null;
    for (let i = rois.length - 1; i >= 0; i--) {
      if (isPointInROI(coords, rois[i])) {
        foundHover = rois[i].id;
        break;
      }
    }
    if (foundHover) {
      clearTooltipHideTimeout();
      if (hoveredROI !== foundHover) {
        setHoveredROI(foundHover);
      }
    } else if (!tooltipHoveredRef.current && hoveredROI && !tooltipHideTimeoutRef.current) {
      scheduleTooltipHide();
    }
    if (!isDrawing || !currentROI) return;

    const videoCoords = getVideoCoordinates(event.clientX, event.clientY);

    if (currentROI.type === 'rectangle') {
      const updatedPoints = [...currentROI.points];
      updatedPoints[1] = videoCoords;
      setCurrentROI({ ...currentROI, points: updatedPoints });
    }
  };

  const isPointInROI = (point: Point, roi: ROI): boolean => {
    if (roi.type === 'rectangle' && roi.points.length === 2) {
      const [p1, p2] = roi.points;
      const minX = Math.min(p1.x, p2.x);
      const maxX = Math.max(p1.x, p2.x);
      const minY = Math.min(p1.y, p2.y);
      const maxY = Math.max(p1.y, p2.y);

      return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY;
    } else if (roi.type === 'polygon' && roi.points.length >= 3) {
      let inside = false;
      for (let i = 0, j = roi.points.length - 1; i < roi.points.length; j = i++) {
        const xi = roi.points[i].x, yi = roi.points[i].y;
        const xj = roi.points[j].x, yj = roi.points[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
          && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    }
    return false;
  };


  const finishPolygon = () => {
    if (currentROI && currentROI.type === 'polygon' && currentROI.points.length >= 3) {
      const points = [...currentROI.points];
      if (points.length > 3) {
        const first = points[0];
        const last = points[points.length - 1];
        const distance = Math.sqrt((last.x - first.x) ** 2 + (last.y - first.y) ** 2);
        if (distance < (isMobile ? 30 : 20)) {
          points.pop();
        }
      }
      const finalROI = { ...currentROI, points };
      setPendingROI(finalROI);
      setTimeout(() => setIsOpen(true), 300);
      setCurrentROI(null);
      setIsDrawing(false);
      // addTerminalLog(`✓ Polygon complete: ${finalROI.label} (${points.length} points) – select training types`);
    }
  };

  // ROI management
  const addNewROI = (type: 'rectangle' | 'polygon') => {
    setDrawingMode(type);

    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    setCurrentROI(null);
    setIsDrawing(false);
    addTerminalLog(`Drawing mode set to: ${type}`);
  };

  const deleteROI = (id: string) => {
    const roiToDelete = rois.find(roi => roi.id === id);
    setRois(prev => prev.filter(roi => roi.id !== id));
    if (selectedROI === id) {
      setSelectedROI(null);
    }
    if (hoveredROI === id) {
      setHoveredROI(null);
    }
    if (roiToDelete) {
      addTerminalLog(`Deleted ROI: ${roiToDelete.label}`);
    }
  };

  const updateROILabel = (id: string, label: string) => {
    setRois(prev => prev.map(roi =>
      roi.id === id ? { ...roi, label } : roi
    ));
  };
  const captureFrame = async (frameNumber: number) => {
    const video = videoRef.current;
    const captureCanvas = captureCanvasRef.current;

    if (!captureCanvas) {
      console.error('Capture canvas not available');
      addTerminalLog('❌ Capture canvas not available');
      return;
    }

    const captureCtx = captureCanvas.getContext('2d');
    if (!captureCtx) {
      console.error('Capture context not available');
      addTerminalLog('❌ Capture context not available');
      return;
    }

    captureCanvas.width = videoDimensions.width;
    captureCanvas.height = videoDimensions.height;
    captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);

    // Select frame source
    if (inputSource === 'oak' && oakStreamRef.current) {
      captureCtx.drawImage(
        oakStreamRef.current,
        0, 0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else if (inputSource === 'upload' && extractorVideoRef.current) {
      await extractFrame(frameNumber, frameRate, captureCanvas);
    } else if (inputSource === 'camera' && video && video.srcObject) {
      captureCtx.drawImage(
        video,
        0, 0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else if (inputSource === 'remote') {
      // Handle remote camera capture - FIXED VERSION
      try {
        await captureRemoteFrame(captureCanvas, captureCtx, frameNumber);
      } catch (error) {
        console.error('Error capturing remote frame:', error);
        // addTerminalLog(`❌ Failed to capture remote frame ${frameNumber}: ${error.message}`);
        return;
      }
    } else {
      console.error('No valid source available for capture');
      addTerminalLog(`❌ No valid source available for frame ${frameNumber}`);
      return;
    }

    console.log(`📸 Capturing frame ${frameNumber}...`);

    if (rois.length === 0) {
      await captureFullFrame(frameNumber);
    } else {
      for (const roi of rois) {
        let x = 0, y = 0, width = 0, height = 0;

        if (roi.type === 'rectangle' && roi.points.length === 2) {
          const [p1, p2] = roi.points;
          x = Math.min(p1.x, p2.x);
          y = Math.min(p1.y, p2.y);
          width = Math.abs(p2.x - p1.x);
          height = Math.abs(p2.y - p1.y);
        } else if (roi.type === 'polygon' && roi.points.length >= 3) {
          const xs = roi.points.map(p => p.x);
          const ys = roi.points.map(p => p.y);
          x = Math.min(...xs);
          y = Math.min(...ys);
          width = Math.max(...xs) - x;
          height = Math.max(...ys) - y;
        }

        if (width > 10 && height > 10) {
          await captureROIArea(x, y, width, height, roi, frameNumber);
        } else {
          console.warn(`ROI ${roi.label} too small: ${width}x${height}`);
        }
      }
    }

    setCaptureCount(prev => prev + 1);
  };


  // Update the captureRemoteFrame function:
  const captureRemoteFrame = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, frameNumber: number) => {
    return new Promise<void>((resolve, reject) => {
      if (!remoteCameraFrame) {
        reject(new Error('No remote camera frame available'));
        return;
      }

      // Create a new image object from the base64 data
      const img = new Image();
      img.onload = () => {
        // Set canvas to image dimensions
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Update video dimensions if needed
        if (videoDimensions.width !== img.naturalWidth || videoDimensions.height !== img.naturalHeight) {
          setVideoDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
          });
        }

        resolve();
      };

      img.onerror = () => {
        reject(new Error('Failed to load remote image'));
      };

      img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;

      // Timeout in case image takes too long to load
      setTimeout(() => {
        if (!img.complete) {
          reject(new Error('Image loading timeout'));
        }
      }, 1000);
    });
  };

  const captureFullFrame = async (frameNumber: number) => {
    const captureCanvas = captureCanvasRef.current;
    const captureCtx = captureCanvas?.getContext('2d');

    if (!captureCanvas || !captureCtx) {
      console.error('Capture canvas not available');
      addTerminalLog('❌ Capture canvas not available');
      return;
    }

    captureCanvas.width = videoDimensions.width;
    captureCanvas.height = videoDimensions.height;
    captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);

    if (inputSource === 'oak' && oakStreamRef.current) {
      captureCtx.drawImage(
        oakStreamRef.current,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else if (inputSource === 'upload' && extractorVideoRef.current) {
      await extractFrame(frameNumber, frameRate, captureCanvas);
    } else if (videoRef.current && videoRef.current.videoWidth > 0) {
      captureCtx.drawImage(
        videoRef.current,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else if (videoRef.current && videoRef.current.srcObject) {
      captureCtx.drawImage(
        videoRef.current,
        0,
        0,
        captureCanvas.width,
        captureCanvas.height
      );
    } else {
      console.error('No valid source available for full frame capture');
      addTerminalLog(`❌ No valid source available for frame ${frameNumber}`);
      return;
    }

    captureCanvas.toBlob(async (blob) => {
      if (blob && blob.size > 1000) {
        await sendFullFrameToBackend(blob, frameNumber);
      } else {
        console.error('Blob creation failed or blob too small');
        addTerminalLog(`❌ Failed to capture full frame for frame ${frameNumber}`);
      }
    }, 'image/jpeg', 0.9);
  };

  const sendFullFrameToBackend = async (blob: Blob, frameNumber: number) => {
    const formData = new FormData();
    formData.append('frame', blob, `frame_${frameNumber}.jpg`);
    formData.append('session_id', sessionName);
    formData.append('frame_number', frameNumber.toString());
    formData.append('video_width', videoDimensions.width.toString());
    formData.append('video_height', videoDimensions.height.toString());

    try {
      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/full-frame`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setLastSaveStatus(`✓ Full frame ${frameNumber} saved`);
        console.log('Full frame saved:', result);
      } else {
        const errorText = await response.text();
        console.error(`Failed to send full frame: ${response.status} - ${errorText}`);
        setLastSaveStatus(`❌  Failed to save full frame ${frameNumber}`);
      }
    } catch (error) {
      console.error('Error sending full frame:', error);
      setLastSaveStatus(`❌  Error sending full frame ${frameNumber}`);
    }
  };

  const captureROIArea = async (x: number, y: number, width: number, height: number, roi: ROI, frameNumber: number) => {
    const captureCanvas = captureCanvasRef.current;
    const captureCtx = captureCanvas?.getContext('2d');

    if (!captureCanvas || !captureCtx) {
      console.error('Capture canvas not available');
      addTerminalLog('❌  Capture canvas not available');
      return;
    }

    const imageData = captureCtx.getImageData(x, y, width, height);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0);

      tempCanvas.toBlob(async (blob) => {
        if (blob && blob.size > 1000) {
          console.log(`Sending frame ${frameNumber} for ROI ${roi.label}, size: ${blob.size} bytes`);
          await sendFrameToBackend(blob, roi, frameNumber);
        } else {
          console.error(`Failed to create blob or blob too small for ROI ${roi.label}`);
          addTerminalLog(`❌ Failed to capture ROI ${roi.label} for frame ${frameNumber}`);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const sendFrameToBackend = async (blob: Blob, roi: ROI, frameNumber: number) => {
    const formData = new FormData();
    formData.append('frame', blob, `frame_${frameNumber}.jpg`);
    formData.append('session_id', sessionName);
    formData.append('roi_id', roi.id);
    formData.append('roi_label', roi.label);
    formData.append('roi_type', roi.type);

    const pointsArray = roi.points.map(p => [p.x, p.y]);
    formData.append('roi_points', JSON.stringify(pointsArray));

    formData.append('frame_number', frameNumber.toString());
    formData.append('video_width', videoDimensions.width.toString());
    formData.append('video_height', videoDimensions.height.toString());

    if (roi.type === 'polygon' && roi.points.length >= 3) {
      const xs = roi.points.map(p => p.x);
      const ys = roi.points.map(p => p.y);
      const bbox = {
        x_min: Math.min(...xs),
        y_min: Math.min(...ys),
        x_max: Math.max(...xs),
        y_max: Math.max(...ys),
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys)
      };
      formData.append('bounding_box', JSON.stringify(bbox));
    }

    try {
      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/frames/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        addTerminalLog(`↑ Uploaded frame ${frameNumber} → ${roi.label}`);

        const result = await response.json();
        setLastSaveStatus(`✓ Frame ${frameNumber} saved for ${roi.label}`);
        console.log('Frame saved with metadata:', result.roi_metadata);
      } else {
        const errorText = await response.text();
        console.error(`Failed to send frame: ${response.status} - ${errorText}`);
        setLastSaveStatus(`❌ Failed to save frame ${frameNumber} for ${roi.label}`);
      }
    } catch (error) {
      console.error('Error sending frame:', error);
      setLastSaveStatus(`❌ Error sending frame ${frameNumber} for ${roi.label}`);
    }
  };

  // Training functions
  const connectToTrainingWebSocket = (trainingId: string) => {
    // Choose ws/wss based on current page protocol
    const wsScheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl = `${wsScheme}://${NEXT_PUBLIC_BACKEND_URL}/api/training/ws/${trainingId}`;

    console.log('Connecting to WebSocket:', wsUrl);

    let attempts = 0;
    const maxAttempts = 5;

    let ws: WebSocket | null = null;
    let connectionTimeout: ReturnType<typeof setTimeout> | null = null;

    const create = () => {
      attempts += 1;
      try {
        ws = new WebSocket(wsUrl);
      } catch (err) {
        console.error('Failed to construct WebSocket:', err);
        addTerminalLog('❌ Failed to create WebSocket.');
        scheduleReconnect();
        return;
      }

      connectionTimeout = setTimeout(() => {
        if (ws && ws.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          try { ws.close(); } catch (_) { }
          addTerminalLog('❌ WebSocket connection timeout. Please check your connection.');
        }
      }, 5000);

      ws.onopen = () => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        attempts = 0;
        addTerminalLog('✓ Connected to training WebSocket');
        setTrainingWebSocket(ws);
      };

      ws.onmessage = (event) => {
        // Keep the log here for debugging
        console.log('WebSocket message received:', event.data);
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'log') {
            addTerminalLog(data.message);
          } else if (data.type === 'status_update') {
            console.log('Training status update:', data);
            if (data.status === 'completed') {
              setTrainingStatus('completed');
              void inference.loadModels();
              addTerminalLog('✓ Training completed successfully!');
            } else if (data.status === 'failed') {
              setTrainingStatus('failed');
              addTerminalLog(`❌ Training failed: ${data.message}`);
            } else if (data.status === 'processing') {
              setTrainingStatus('running');
            }
          } else if (data.type === 'pong') {
            console.log('WebSocket pong received');
          } else if (data.type === 'initial_status') {
            console.log('Initial status received:', data);
            if (data.data && data.data.logs) {
              data.data.logs.forEach((log: string) => {
                if (!terminalLogs.includes(log)) {
                  setTerminalLogs(prev => [...prev, log]);
                }
              });
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error event:', event);
        addTerminalLog('❌ WebSocket connection error');
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
      };

      ws.onclose = (event) => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        const timestamp = new Date().toLocaleTimeString();
        addTerminalLog(`${timestamp} - WebSocket disconnected (code ${event.code})`);
        console.log('WebSocket closed:', event.code, event.reason);
        // Try to reconnect with backoff
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (attempts >= maxAttempts) {
        addTerminalLog('❌ WebSocket reconnection failed after multiple attempts.');
        return;
      }

      const backoff = Math.min(30000, 1000 * 2 ** attempts);
      addTerminalLog(`↻ Attempting WebSocket reconnect in ${Math.round(backoff / 1000)}s (attempt ${attempts + 1}/${maxAttempts})`);
      setTimeout(() => {
        create();
      }, backoff);
    };

    create();
    return ws;
  };

  const toggleRecording = () => {
    if (!isRecording) {
      // Validate input source
      if (inputSource === 'remote' && !isRemoteCameraReady()) {
        showToast('Remote camera not connected or no frame available', "warning");
        return;
      }
      if (
        inputSource === 'upload' &&
        !backendExtractionMode &&
        (!videoUrl || !videoRef.current?.videoWidth)
      ) {
        showToast("Please upload a video first", "warning")
        return;
      }

      if (inputSource === 'oak' && !isOakStreaming) {
        showToast('Please start OAK camera first', "warning");
        return;
      }

      if (inputSource === 'remote' && remoteCameraStatus !== 'connected') {
        showToast('Please connect remote camera first', "warning");
        return;
      }

      setIsRecording(true);
      setRecordingProgress(0);
      setRemainingTime(recordingDuration);
      setCaptureCount(0);

      addTerminalLog(`=== Starting Recording ===`);
      addTerminalLog(`Session: ${sessionName}`);
      addTerminalLog(`Duration: ${recordingDuration} seconds`);
      addTerminalLog(`Frame Rate: ${frameRate} FPS`);
      addTerminalLog(`ROIs: ${rois.length} (${rois.length === 0 ? 'Full Frame mode' : 'ROI mode'})`);
      addTerminalLog(`========================`);

      let currentFrame = 0;
      const totalFrames = recordingDuration * frameRate;
      const runRecording = async () => {
        for (let i = 0; i < totalFrames; i++) {
          if (!isRecording) break;

          await captureFrame(i);
          const progress = ((i + 1) / totalFrames) * 100;
          setRecordingProgress(progress);
          setCaptureCount(prev => prev + 1);

          if (i < totalFrames - 1) {
            await new Promise(res => setTimeout(res, 1000 / frameRate));
          }
        }

        setIsRecording(false);
        addTerminalLog(`✓ Recording completed.`);
      };

      runRecording();



      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsRecording(false);
            addTerminalLog(`✓ Recording completed. Captured ${captureCount} frames.`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setRecordingTimer(timer);

    } else {
      // Stop recording
      setIsRecording(false);

      // Clear remote camera interval if it exists
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }

      addTerminalLog(`Recording stopped manually. Captured ${captureCount} frames.`);
    }
  };

  useEffect(() => {
    if (inputSource === 'remote' && remoteCameraFrame) {
      // Update canvas when remote frame dimensions change
      const updateRemoteCanvas = () => {
        if (!containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;

        // Get actual container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = isMobile ? containerWidth * 0.75 : container.clientHeight;

        // Calculate scale based on actual video dimensions
        const scaleX = containerWidth / videoDimensions.width;
        const scaleY = containerHeight / videoDimensions.height;
        const newScale = Math.min(scaleX, scaleY);

        // Calculate offset to center the image
        const offsetX = (containerWidth - videoDimensions.width * newScale) / 2;
        const offsetY = (containerHeight - videoDimensions.height * newScale) / 2;

        setScale(newScale);
        setOffset({ x: offsetX, y: offsetY });

        // Set canvas to container size
        canvas.width = containerWidth;
        canvas.height = containerHeight;

        // Redraw
        drawCanvas();
      };

      updateRemoteCanvas();

      // Also update on window resize
      const handleResize = () => updateRemoteCanvas();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [inputSource, remoteCameraFrame, videoDimensions, isMobile]);

  const startTraining = async () => {
    try {
      // Show training analysis
      startAnalysis('training');

      addTerminalLog(`=== Starting Training Session ===`);
      addTerminalLog(`Session: ${sessionName}`);

      // Check if we need to wait for backend extraction
      if (backendExtractionMode && extractionStatus !== 'completed') {
        if (extractionStatus === 'processing') {
          addTerminalLog(`⏳ Waiting for backend frame extraction to complete...`);
          addTerminalLog(`📈 Progress: ${extractionProgress.toFixed(1)}%`);
          showToast('Please wait for backend frame extraction to complete before starting training.', 'warning');
          setShowUpload(false);
          return;
        } else if (extractionStatus === 'idle' || extractionStatus === 'failed' || extractionStatus === 'uploading') {
          addTerminalLog(`❌ Backend frame extraction not completed or failed`);
          showToast('Please complete backend frame extraction first or try uploading the video again.', 'warning');
          setShowUpload(false);
          return;
        }
      }

      if (rois.length === 0) {
        addTerminalLog(`Mode: Full Frame (no ROIs drawn)`);
      } else {
        addTerminalLog(`Mode: ROI-based`);
        addTerminalLog(`Number of ROIs: ${rois.length}`);
      }

      addTerminalLog(`Frame Rate: ${frameRate} FPS`);
      addTerminalLog(`================================`);

      // Validate input sources
      if (
        inputSource === 'upload' &&
        !backendExtractionMode &&
        (!videoUrl || !videoRef.current?.videoWidth)
      ) {
        showToast('Please load a video first', 'warning');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'oak' && !isOakStreaming) {
        addTerminalLog(`❌ ERROR: Please start OAK camera first`);
        showToast('Please start OAK camera first', 'warning');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'remote' && remoteCameraStatus !== 'connected') {
        addTerminalLog(`❌ ERROR: Please connect remote camera first`);
        showToast('Please connect remote camera first', 'warning');
        setShowUpload(false);
        return;
      }

      if (inputSource === 'camera' && !currentCameraStream) {
        addTerminalLog(`❌ ERROR: Please start camera first`);
        showToast('Please start camera first', 'warning');
        setShowUpload(false);
        return;
      }

      if (!recordingDuration || recordingDuration <= 0) {
        addTerminalLog(`❌Training cancelled: Invalid duration`);
        setShowUpload(false);
        return;
      }

      const totalFrames = recordingDuration * frameRate;

      // SPECIAL HANDLING FOR REMOTE CAMERA - Capture from canvas
      if (inputSource === 'remote') {
        addTerminalLog(`🔄 Remote Camera: Using canvas-based frame capture`);
        await captureFramesFromCanvas(totalFrames);
      } else {
        // Original logic for other sources
        addTerminalLog(`Step 1: Capturing ${totalFrames} frames (${recordingDuration} seconds)...`);
        setIsCapturingTrainingFrames(true);

        for (let i = 0; i < totalFrames; i++) {
          await captureFrame(i);
          const progress = ((i + 1) / totalFrames) * 100;
          addTerminalLog(`[CAPTURE] ${renderProgressBar(progress)} (${i + 1}/${totalFrames})`);

          if (i < totalFrames - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));
          }
        }

        setIsCapturingTrainingFrames(false);
      }

      addTerminalLog(`Step 2: Waiting for frames to save to backend...`);
      await new Promise(resolve => setTimeout(resolve, 3000));

      addTerminalLog(`Step 3: Verifying saved frames...`);
      try {
        const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/sessions/${sessionName}/frame-count`);
        if (response.ok) {
          const data = await response.json();
          const totalSavedFrames = data.total_frames || 0;
          addTerminalLog(`✓ ${totalSavedFrames} frames saved successfully`);

          if (totalSavedFrames === 0) {
            addTerminalLog(`❌  ERROR: No frames were saved. Check backend connection.`);
            showToast('No frames were saved. Please check backend connection and try again.', 'error');
            setShowUpload(false);
            return;
          }
        }
      } catch (error) {
        addTerminalLog(`⚠ WARNING: Could not verify frames: ${error}`);
      }

      addTerminalLog(`Step 4: Starting training process...`);
      setShowUpload(true);

      const trainingROIs = rois.length === 0
        ? [{
          id: 'full_frame',
          type: 'rectangle',
          points: [
            { x: 0, y: 0 },
            { x: videoDimensions.width, y: videoDimensions.height }
          ],
          label: 'Full Frame',
          color: '#3b82f6'
        }]
        : rois;

      const trainingOptions = getSelectedTrainingOptions();

      if (trainingOptions.length === 0) {
        trainingOptions.push("anomaly");
        addTerminalLog("⚠ No training type selected, defaulting to Anomaly Training");
      }

      addTerminalLog(`📊  Selected Training Types: ${trainingOptions.join(", ")}`);

      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionName,
          rois: trainingROIs,
          frame_rate: backendExtractionMode ? frameRate : frameRate,
          training_options: trainingOptions,
          source_type: inputSource === 'remote' ? 'remote_camera' : (backendExtractionMode ? 'backend_extraction' : inputSource),
        })
      });

      if (response.ok) {
        const result = await response.json();
        addTerminalLog(`✓ Training started successfully!`);
        addTerminalLog(`Training ID: ${result.training_id}`);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('mint:last-training-model-id', result.training_id);
        }
        addTerminalLog(`Status: ${result.status}`);
        addTerminalLog(`Training Types: ${result.details?.training_options?.join(', ') || 'Anomaly'}`);

        if (result.details) {
          addTerminalLog(`Total frames: ${result.details.total_frames || 0}`);
          if (result.details.frames_by_roi) {
            Object.entries(result.details.frames_by_roi).forEach(([roiId, info]: [string, any]) => {
              if (info.frames > 0) {
                addTerminalLog(` ROI ${info.label}: ${info.frames} frames`);
              }
            });
          }
        }

        // Connect to WebSocket for logs
        connectToTrainingWebSocket(result.training_id);

        // Update analysis modal
        setAnalysisStatus('completed');
        setAnalysisMessage('Training started successfully!');
        setAnalysisDetails(prev => [...prev, '✓ Training session created', `✓ Training ID: ${result.training_id}`]);

        // Switch to terminal view
        setShowUpload(false);
        setActivePanel('terminal');
        setTrainingStatus('running');

      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to start training';

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorText;
        } catch {
          errorMessage = errorText;
        }

        addTerminalLog(`❌ ERROR: ${errorMessage}`);
        showToast(`Failed to start training: ${errorMessage}`, 'error');
        setShowUpload(false);
      }
    } catch (error) {
      console.error('Error starting training:', error);
      addTerminalLog(`❌ ERROR: Error in training process: ${error}`);
      showToast('Error in training process', 'error');
      setShowUpload(false);
    }
  };

  // NEW HELPER FUNCTION: Capture frames from canvas (for Remote Camera)
  const captureFramesFromCanvas = async (totalFrames: number) => {
    try {
      addTerminalLog(`🖼 Capturing ${totalFrames} frames from canvas...`);
      setIsCapturingTrainingFrames(true);
      setCaptureCount(0);

      // Create a canvas for capturing
      const captureCanvas = document.createElement('canvas');
      captureCanvas.width = videoDimensions.width;
      captureCanvas.height = videoDimensions.height;
      const captureCtx = captureCanvas.getContext('2d');

      if (!captureCtx) {
        throw new Error('Failed to create capture canvas context');
      }

      for (let i = 0; i < totalFrames; i++) {
        // For remote camera, draw the current remote frame onto canvas
        if (inputSource === 'remote') {
          if (!remoteCameraFrame) {
            addTerminalLog(`⏳ Waiting for remote frame ${i + 1}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));
            continue;
          }

          // Create image from base64
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = `data:image/jpeg;base64,${remoteCameraFrame}`;
          });

          // Draw to capture canvas
          captureCtx.clearRect(0, 0, captureCanvas.width, captureCanvas.height);
          captureCtx.drawImage(img, 0, 0, captureCanvas.width, captureCanvas.height);
        }

        // Now capture from this canvas (same as other sources)
        if (rois.length === 0) {
          await captureFullFrameFromCanvas(captureCanvas, i);
        } else {
          for (const roi of rois) {
            await captureROIFromCanvas(captureCanvas, captureCtx, roi, i);
          }
        }

        setCaptureCount(prev => prev + 1);
        const progress = ((i + 1) / totalFrames) * 100;
        addTerminalLog(`[CANVAS CAPTURE] ${renderProgressBar(progress)} (${i + 1}/${totalFrames})`);

        if (i < totalFrames - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 / frameRate));
        }
      }

      setIsCapturingTrainingFrames(false);
      addTerminalLog(`✓ Canvas capture completed: ${captureCount} frames`);

    } catch (error) {
      console.error('Error in canvas capture:', error);
      addTerminalLog(`❌ Canvas capture error: ${error}`);
      throw error;
    }
  };

  // Canvas-based capture functions
  const captureFullFrameFromCanvas = async (canvas: HTMLCanvasElement, frameNumber: number) => {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
    });

    if (blob && blob.size > 1000) {
      const formData = new FormData();
      formData.append('frame', blob, `frame_${frameNumber}.jpg`);
      formData.append('session_id', sessionName);
      formData.append('frame_number', frameNumber.toString());
      formData.append('video_width', videoDimensions.width.toString());
      formData.append('video_height', videoDimensions.height.toString());

      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/full-frame`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        addTerminalLog(`â†‘ Uploaded full frame ${frameNumber} from canvas`);
        return await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to upload frame: ${errorText}`);
      }
    } else {
      throw new Error('Failed to create blob from canvas');
    }
  };

  const captureROIFromCanvas = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, roi: ROI, frameNumber: number) => {
    let x = 0, y = 0, width = 0, height = 0;

    if (roi.type === 'rectangle' && roi.points.length === 2) {
      const [p1, p2] = roi.points;
      x = Math.min(p1.x, p2.x);
      y = Math.min(p1.y, p2.y);
      width = Math.abs(p2.x - p1.x);
      height = Math.abs(p2.y - p1.y);
    } else if (roi.type === 'polygon' && roi.points.length >= 3) {
      const xs = roi.points.map(p => p.x);
      const ys = roi.points.map(p => p.y);
      x = Math.min(...xs);
      y = Math.min(...ys);
      width = Math.max(...xs) - x;
      height = Math.max(...ys) - y;
    }

    if (width > 10 && height > 10) {
      // Extract ROI from canvas
      const imageData = ctx.getImageData(x, y, width, height);
      const roiCanvas = document.createElement('canvas');
      roiCanvas.width = width;
      roiCanvas.height = height;
      const roiCtx = roiCanvas.getContext('2d');

      if (roiCtx) {
        roiCtx.putImageData(imageData, 0, 0);

        const blob = await new Promise<Blob | null>((resolve) => {
          roiCanvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
        });

        if (blob && blob.size > 1000) {
          const formData = new FormData();
          formData.append('frame', blob, `frame_${frameNumber}_${roi.id}.jpg`);
          formData.append('session_id', sessionName);
          formData.append('roi_id', roi.id);
          formData.append('roi_label', roi.label);
          formData.append('roi_type', roi.type);
          formData.append('frame_number', frameNumber.toString());
          formData.append('video_width', videoDimensions.width.toString());
          formData.append('video_height', videoDimensions.height.toString());

          const pointsArray = roi.points.map(p => [p.x, p.y]);
          formData.append('roi_points', JSON.stringify(pointsArray));

          const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/training/frames/`, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            addTerminalLog(`↑ Uploaded frame ${frameNumber} for ROI ${roi.label} from canvas`);
            return await response.json();
          } else {
            const errorText = await response.text();
            throw new Error(`Failed to upload ROI frame: ${errorText}`);
          }
        } else {
          throw new Error('Failed to create blob from ROI canvas');
        }
      }
    } else {
      throw new Error(`ROI ${roi.label} too small: ${width}x${height}`);
    }
  };

  // Backend connection functions
  const checkBackendConnection = async () => {
    try {
      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/health`, { skipAuth: true });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setBackendConnected(true);
          addTerminalLog(`✓ Backend connected: ${data.service} v${data.version}`);
          return true;
        }
      }
    } catch (error) {
      console.error('Main backend connection failed:', error);
    }

    try {
      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/health/`, { skipAuth: true });
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'ok') {
          setBackendConnected(true);
          addTerminalLog(`✓ Backend connected: ${data.service} v${data.version}`);
          return true;
        }
      }
    } catch (error) {
      console.error('Main backend connection failed (with slash):', error);
    }

    setBackendConnected(false);
    addTerminalLog('❌ Backend connection failed');
    return false;
  };

  const checkOakCameraConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        return data.camera_running ? 'streaming' : 'idle';
      }
    } catch (error) {
      console.error('OAK camera backend connection failed:', error);
    }
    return 'error';
  };

  const listOakDevices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/camera/devices');
      if (response.ok) {
        const data = await response.json();
        setOakDevices(data.devices || []);
        if (data.devices && data.devices.length > 0) {
          setSelectedDevice(data.devices[0].mxid);
        }
      }
    } catch (error) {
      console.error('Error listing OAK devices:', error);
    }
  };

  const startOakCamera = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/camera/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to start camera');

      setIsOakStreaming(true);
      setOakCameraState('streaming');
      handleInputSourceChange('oak');
      setStreamUrl('http://localhost:5000/api/camera/stream');
      addTerminalLog('✓ OAK Camera started streaming');

    } catch (error) {
      console.error('Error starting OAK camera:', error);
      setOakCameraState('error');
      addTerminalLog(`❌ Error starting OAK camera: ${error}`);
    }
  };

  const stopOakCamera = async () => {
    try {
      await fetch('http://localhost:5000/api/camera/stop', { method: 'POST' });

      setIsOakStreaming(false);
      setOakCameraState('idle');
      setStreamUrl('');
      addTerminalLog('✓ OAK Camera stopped');

    } catch (error) {
      console.error('Error stopping OAK camera:', error);
      addTerminalLog(`❌ Error stopping OAK camera: ${error}`);
    }
  };

  const copyTerminalLogs = () => {
    const logsText = terminalLogs.join('\n');
    navigator.clipboard.writeText(logsText).then(() => {
      addTerminalLog('✓ Logs copied to clipboard');
    });
  };;

  const clearTerminalLogs = () => {
    setTerminalLogs([]);
    setTrainingLogs([]);

  };

  const testCapture = async () => {
    addTerminalLog('Testing frame capture...');
    await captureFrame(0);
    addTerminalLog('✓ Test capture completed');
    showToast('Test capture completed', 'success');
  };

  const checkDatasets = async () => {
    try {
      const response = await authFetch(`http://${NEXT_PUBLIC_BACKEND_URL}/api/datasets`);
      const data = await response.json();
      console.log('Datasets:', data);
      addTerminalLog(`Found ${data.datasets?.length || 0} datasets`);
      showToast(`Found ${data.datasets?.length || 0} datasets on server`, 'success');
    } catch (error) {
      console.error('Failed to list datasets:', error);
      addTerminalLog(`❌ Error checking datasets: ${error}`);
      showToast(`Error checking datasets: ${error}`, 'error');
    }
  };

  // Particle Animation Component
  const ParticleAnimation = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );




  // --- Global Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 't':
          handleViewModeChange('training');
          break;
        case 'i':
          handleViewModeChange('inference');
          break;
        case 'r':
          if (viewMode === 'training') addNewROI('rectangle');
          break;
        case 'p':
          if (viewMode === 'training') addNewROI('polygon');
          break;
        case 's':
          if (viewMode === 'training') {
            setDrawingMode('select');
            setCurrentROI(null);
            setIsDrawing(false);
          }
          break;
        case ' ':
          e.preventDefault();
          if (viewMode === 'training') {
            const canRecord = !((inputSource === 'camera' && !currentCameraStream) || (inputSource === 'oak' && !isOakStreaming) || (inputSource === 'remote' && remoteCameraStatus !== 'connected'));
            if (canRecord) toggleRecording();
          }
          break;
        case 'escape':
          setActivePanel(null);
          setOpenDropdown(null);
          setCollapsedSections({
            inputSource: false,
            trainingTypes: false,
            roiTools: false,
            backendExtraction: false,
            recordingSettings: false,
            sessionInfo: false,
            debugTools: false,
          });
          break;
        case 'delete':
        case 'backspace':
          if (selectedROI) {
            deleteROI(selectedROI);
          }
          break;
        case '`':
          togglePanel('terminal');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, selectedROI, togglePanel, inputSource, currentCameraStream, isOakStreaming, remoteCameraStatus]);


  type User = {
    id: string
    name: string
    email: string
  }

  const [user, setUser] = useState<User | null>(null)


  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    authFetch("http://localhost:8000/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setIsLoggedIn(true)
      })
      .catch(() => {
        localStorage.removeItem("access_token")
        setIsLoggedIn(false)
      })
  }, [])
  const Header = () => (
    <header className={`shrink-0 h-13 ${ds.colors.surfaceBlur} border-b ${ds.colors.borderSubtle} flex items-center px-6 justify-between z-50`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/10`}>
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {/* <span className="text-sm font-bold tracking-tight text-zinc-100 italic">DIME</span> */}
            <span className="text-sm font-bold tracking-tight text-blue-500 uppercase">MINT</span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.25em] text-zinc-500 uppercase opacity-70">Vision INTELLIGENCE</span>
        </div>
      </div>
      <nav className="flex gap-10">
        {(['training', 'inference'] as const).map((mode) => {
          const active = viewMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => handleViewModeChange(mode)}
              className={`relative flex flex-col items-center px-1 py-1 text-sm font-bold uppercase tracking-wide transition-colors duration-200 ${active ? 'text-blue-500' : 'text-zinc-400 hover:text-zinc-200'
                }`}
            >
              <span>{mode}</span>
              <span className="mt-1 h-0.5 w-10 rounded-full bg-transparent">
                {active && (
                  <motion.span
                    layoutId="mint-header-tab"
                    className="block h-full w-full rounded-full bg-blue-500"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-8">

        <div className="w-px h-4 bg-zinc-800" />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full border ${backendConnected
            ? 'bg-green-500/20 border-none text-green-400 '
            : 'bg-red-500/20 border-none text-red-400'
            }`}
        >
          {backendConnected ? <CloudCheck className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 group"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-zinc-300">{isLoggedIn ? user?.name : "Guest"}</span>
              <span className="text-[9px] text-blue-500/70 font-mono">STABLE_v2.0.4</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
              <User className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  {!isLoggedIn ? (
                    <>
                      <Link
                        href="/auth"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link
                        href="/auth"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Plus className="w-4 h-4" />
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        localStorage.removeItem("access_token")
                        setUser(null)
                        setIsLoggedIn(false)
                        setShowProfileMenu(false)
                        router.push("/auth")
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                    >
                      <Power className="w-4 h-4" />
                      Log Out
                    </button>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );

  return (
    <main className={`h-screen ${ds.colors.bg} ${ds.colors.textPrimary} flex flex-col overflow-hidden selection:bg-blue-500/30`}>
      <Header />
      <Toaster position="top-right" />
      {/* QR Code Modal */}
      {showQRCode && remoteCameraSession && (
        <div className="fixed inset-0 bg-black/80 z-500 flex items-center justify-center p-4">
          <div className={`${panelCard} max-w-sm w-full max-h-[90vh] p-4`}>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-semibold flex items-center">
                <QrCode className="w-4 h-4 mr-2 text-blue-400" />
                Connect Mobile Camera
              </h3>
              <button
                onClick={() => setShowQRCode(false)}
                className="p-1 hover:bg-neutral-800 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center mb-4">
              <p className="text-xs text-neutral-300 mb-3">
                Scan this QR code with your phone camera to connect
              </p>

              <div className="flex justify-center mb-3">
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeCanvas
                    value={`${window.location.origin}/mobile-camera?session=${remoteCameraSession.sessionId}`}
                    size={110}   // 🔥 Reduced from 200
                    level="H"
                    includeMargin={true}
                  />
                </div>
              </div>

              <div className="text-xs text-neutral-400 mb-2">
                Session ID: {remoteCameraSession.sessionId}
              </div>

              <div className="text-xs">
                <div className={`inline-block px-2 py-1 rounded-full ${remoteCameraStatus === 'connected'
                  ? 'bg-blue-600'
                  : remoteCameraStatus === 'connecting'
                    ? 'bg-amber-600'
                    : 'bg-rose-600'
                  }`}>
                  {remoteCameraStatus === 'connected'
                    ? 'Connected'
                    : remoteCameraStatus === 'connecting'
                      ? 'Waiting...'
                      : 'Disconnected'}
                </div>
              </div>
            </div>

            <div className="space-y-3 ">
              <div className="text-xs text-neutral-300">
                <strong>Instructions:</strong>
                <ol className="list-decimal pl-4 mt-2 space-y-2">
                  <li>Open your phone camera app</li>
                  <li>Point it at the QR code above</li>
                  <li>Tap the notification/link that appears</li>
                  <li>Allow camera permissions on your phone</li>
                  <li>Click "Start Camera" then "Connect & Stream"</li>
                </ol>
              </div>

              <div className="flex gap-2 pb-4">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/mobile-camera?session=${remoteCameraSession.sessionId}`;
                    navigator.clipboard.writeText(url);
                    addTerminalLog('✓ Mobile URL copied to clipboard');
                  }}
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium"
                >
                  Copy Link
                </button>

                <button
                  onClick={() => setShowQRCode(false)}
                  className="flex-1 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Main workspace (grid + footer) fills remaining height */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Workspace Grid */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 p-3 min-h-0 overflow-hidden">
          {/* Left Column - Canvas & Tools (Span 8) */}
          <div className="flex-1 flex flex-col gap-3 min-h-0">
            {/* Top Toolbar / Mode Switcher Section */}
            <div className={`flex items-center justify-between p-1.5 ${ds.colors.surfaceBlur} border ${ds.colors.borderSubtle} ${ds.radius.md} relative z-[200]`}>
              <div className="flex items-center gap-2  text-[10px] font-bold tracking-[0.1em] text-zinc-400 uppercase">
                {/* Status Dot */}
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${inputSource === "oak"
                      ? isOakStreaming
                        ? "bg-green-500"
                        : "bg-red-500"
                      : inputSource === "camera"
                        ? currentCameraStream
                          ? "bg-green-500"
                          : "bg-red-500"
                        : inputSource === "remote"
                          ? remoteCameraStatus === "connected"
                            ? "bg-green-500"
                            : remoteCameraStatus === "connecting"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          : isPlaying
                            ? "bg-green-500"
                            : "bg-yellow-500"
                      }`}
                  />
                </div>

                {/* Label */}
                <span>
                  {inputSource === "upload"
                    ? "Upload Video"
                    : inputSource === "camera"
                      ? "Live Camera"
                      : inputSource === "oak"
                        ? "OAK Camera"
                        : inputSource === "remote"
                          ? "Remote Camera"
                          : "Upload Video"}
                  {backendExtractionMode && " (Backend Processing)"}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-neutral-500 flex items-center gap-1">
                      {inputSource === "upload" && videoFile ? videoFile.name : null}
                    </span>

                  </div>
                </div>
              </div>


              {/* Toolbar Actions */}
              <div className="flex items-center gap-2 pr-1">
                {/* Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                {backendConnected && (
                  <button
                    onClick={() => {
                      handleInputSourceChange("upload");
                      fileInputRef.current?.click();
                    }}
                    className={`${toolbarIconButton} ${openDropdown === 'inputSource' ? '!text-blue-400 !border-blue-500/30 bg-blue-500/10' : ''}`}
                    title="Upload Video"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                )}

                {backendConnected && (
                  <div className="flex items-center gap-1.5 ml-1">
                    {/* Live Camera */}
                    <button
                      onClick={async () => {
                        const cameras = await listAvailableCameras();
                        if (cameras.length > 1) {
                          setShowCameraSelection(true);
                        } else if (cameras.length === 1) {
                          await startCamera(cameras[0].deviceId);
                        } else {
                          await startCamera();
                        }
                      }}
                      className={`${toolbarIconButton} ${inputSource === 'camera' ? '!text-blue-400 !border-blue-500/30 bg-blue-500/10' : ''}`}
                      title="Live Camera"
                    >
                      <Camera className="w-4 h-4" />

                    </button>
                    {showCameraSelection && availableCameras.length > 0 && (
                      <div className="mt-3 p-3 bg-neutral-800/50 rounded-lg border border-neutral-700">
                        <div className="text-xs text-neutral-400 mb-2">Select Camera:</div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {availableCameras.map((camera, index) => (
                            <label
                              key={camera.deviceId}
                              className={`flex items-center p-2 rounded cursor-pointer ${selectedCameraId === camera.deviceId
                                ? 'bg-blue-900/30 border border-blue-700'
                                : 'hover:bg-neutral-700/50'
                                }`}
                            >
                              <input
                                type="radio"
                                name="camera"
                                value={camera.deviceId}
                                checked={selectedCameraId === camera.deviceId}
                                onChange={(e) => setSelectedCameraId(e.target.value)}
                                className="mr-2"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="text-sm truncate">
                                  {camera.label || `Camera ${index + 1}`}
                                </div>
                                <div className="text-xs text-neutral-500 truncate">
                                  ID: {camera.deviceId.substring(0, 8)}...
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={handleCameraSelect}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
                          >
                            Use Selected Camera
                          </button>
                          <button
                            onClick={() => setShowCameraSelection(false)}
                            className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 rounded text-sm font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Neuron Camera */}
                    <button
                      onClick={async () => {
                        handleInputSourceChange('oak');
                        await startOakCamera();
                      }}
                      className={`${toolbarIconButton} ${inputSource === 'oak' ? '!text-blue-400 !border-blue-500/30 bg-blue-500/10' : ''}`}
                      title="Neuron Camera"
                    >
                      <Cpu className="w-4 h-4" />
                    </button>

                    {/* Remote Stream */}
                    <button
                      onClick={() => {
                        handleInputSourceChange('remote');
                        startRemoteCameraSession();
                      }}
                      className={`${toolbarIconButton} ${inputSource === 'remote' ? '!text-emerald-400 !border-emerald-500/30 bg-emerald-500/10' : ''}`}
                      title="Remote Stream"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STOP BUTTON */}
                {(currentCameraStream || isOakStreaming || remoteCameraActive) && (
                  <button
                    onClick={() => {
                      stopCamera()
                      stopOakCamera()
                      stopRemoteCamera()
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg hover:bg-rose-500/20 transition-colors"
                    title="Stop Input"
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Stop</span>
                  </button>
                )}



                {viewMode === 'training' ? (
                  <button
                    onClick={() => {
                      setRoiToolsVisible((v) => !v);
                      setDrawingMode('select');
                    }}

                    className={`${toolbarIconButton} ${roiToolsVisible ? '!text-blue-400 !border-blue-500/30 bg-blue-500/10' : ''}`}
                    title="ROI Tools"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                ) : null}

                <button
                  onClick={() => togglePanel("terminal")}
                  className={`${toolbarIconButton} ${showTerminal ? '!text-blue-400 !border-blue-500/30 bg-blue-500/10' : ''}`}
                  title="Terminal"
                >
                  <Terminal className="w-4 h-4" />
                </button>

                <button
                  onClick={() => togglePanel('instructions')}
                  className={`${toolbarIconButton} ${showInstructions ? '!text-blue-400 !border-blue-500/30 bg-blue-500/10' : ''}`}
                  title="Instructions"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>

                {viewMode === 'inference' && (
                  <button
                    onClick={() => {
                      void openFullscreenPopup();
                    }}
                    className={toolbarIconButton}
                    title="Expand inference output"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>


            {/* Main Canvas Area */}
            <div className={`flex-1 relative ${ds.radius.lg} overflow-hidden bg-black border ${ds.colors.borderSubtle} ${ds.shadow.strong}`}>
              {/* Canvas Header */}
              <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                  <div className="px-2 py-0.5  border rounded-lg border-white/20 text-[10px] text-zinc-400 ">{videoDimensions.width}x{videoDimensions.height}</div>
                  {/* <div className="px-2 py-1 bg-black/80 border border-white/20 text-xs font-paragraph text-white">{backendExtractionMode && 'Backend Mode'}</div> */}
                </div>

              </div>
              <TrainingTypeModal
                open={isOpen}
                pendingROI={pendingROI}
                trainingTypes={trainingTypes}
                onTrainingTypesChange={setTrainingTypes}
                onConfirm={(roi) => {
                  setRois((prev) => [...prev, roi]);
                  setSelectedROI(roi.id);
                  addTerminalLog(
                    roi.type === 'rectangle'
                      ? `✓ Created ROI: ${roi.label} (${roi.type}) | Training: ${roi.training.join(', ')}`
                      : `✓ Created Polygon ROI: ${roi.label} with ${roi.points.length} points | Training: ${roi.training.join(', ')}`
                  );

                  setIsOpen(false);
                  setPendingROI(null);
                  setTrainingTypes(initialTrainingTypes);
                }}
                onCancel={() => {
                  addTerminalLog(`⚠ ROI creation canceled`);
                  setIsOpen(false);
                  setPendingROI(null);
                  setTrainingTypes(initialTrainingTypes);
                }}
              />

              {showUpload && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  {/* Simple modal container */}
                  <div className={`relative ${panelCard} p-6 max-w-sm w-full`}>
                    {/* Close button */}
                    <button
                      onClick={() => setShowUpload(false)}
                      className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors"
                      aria-label="Close"
                    >
                      <svg className="w-3 h-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Content */}
                    <div className="flex flex-col items-center justify-center py-4">
                      {/* Upload spinner */}
                      <div className="relative mb-6">
                        <div className="w-16 h-16 rounded-full border-4 border-neutral-700 flex items-center justify-center">
                          {/* Spinner circle */}
                          <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-neutral-400 animate-spin"></div>

                          {/* File icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-6 h-6 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Text content */}
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Uploading File
                      </h3>
                      <p className="text-neutral-400 text-center mb-4">
                        Please wait while we process your file...
                      </p>

                      {/* Simple progress indicator */}
                      <div className="w-full space-y-2">
                        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neutral-400 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-neutral-500 text-center">
                          Uploading...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Backend Extraction Backend Processing- Only show if active  */}

              {/* {backendExtractionMode && (
                <div className={`${panelCard} overflow-hidden`}>
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-neutral-800/50 transition-colors"
                    onClick={() => toggleSection('backendExtraction')}
                  >
                    <div className="flex items-center">
                      <CloudUpload className="w-4 h-4 mr-2 text-indigo-400" />
                      <span className="text-sm font-bold">Backend Processing</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${collapsedSections.backendExtraction ? 'rotate-180' : ''}`} />
                  </div>

                  {!collapsedSections.backendExtraction && (
                    <div className="px-4 pb-4">
                      {renderBackendExtractionStatus()}
                    </div>
                  )}
                </div>
              )} */}
              <BackendExtractionCard
                viewMode={viewMode}
                backendExtractionMode={backendExtractionMode}
                extractionStatus={extractionStatus}
                extractionProgress={extractionProgress}
                extractedFramesCount={extractedFramesCount}
                videoFile={videoFile}
                extractionJobId={extractionJobId}
                uploadVideoToBackend={uploadVideoToBackend}
                cancelBackendExtraction={cancelBackendExtraction}
              />

              <div
                ref={containerRef}
                className="w-full h-full bg-gradient-to-b from-neutral-900/80 to-black/80 relative overflow-hidden ">

                {/* Backend extraction mode overlay */}
                {/* {backendExtractionMode && (
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
                      <div className={`text-center p-4 ${panelCard} mx-4`}>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                          {extractionStatus === 'processing' || extractionStatus === 'uploading' ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                          ) : extractionStatus === 'completed' ? (
                            <Check className="w-6 h-6" />
                          ) : (
                            <CloudUpload className="w-6 h-6" />
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-white mb-2">
                          {extractionStatus === 'processing' ? 'Backend Processing' :
                            extractionStatus === 'uploading' ? 'Uploading to Backend' :
                              extractionStatus === 'completed' ? 'Processing Complete' :
                                'Backend Processing Required'}
                        </h3>
                        <p className="text-xs text-amber-900 mb-3">
                          {extractionStatus === 'processing' ? 'Extracting frames on backend...' :
                            extractionStatus === 'uploading' ? 'Uploading video...' :
                              extractionStatus === 'completed' ? 'Ready for training' :
                                'Click "Process on Backend" to start'}
                        </p>

                        {extractionStatus === 'processing' && (
                          <div className="space-y-1">
                            <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${extractionProgress}%` }}
                              />
                            </div>
                            <div className="text-xs text-white">
                              {extractionProgress.toFixed(1)}% • {extractedFramesCount} frames
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )} */}
                {/* --- NEW UX CONSOLIDATED UI IN VIDEO CONTAINER --- */}

                {/* 1. Workflow Stepper (Training Mode) */}
                {/* {viewMode === 'training' && showStepper && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#16181D]/80 backdrop-blur-md px-4 py-2 border border-white/10 rounded-2xl shadow-lg">
                    <div className={`flex items-center gap-1.5 ${inputSource ? 'text-blue-400' : 'text-neutral-500'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${inputSource ? 'bg-blue-500/20' : 'bg-white/5'}`}>1</div>
                      <span className="text-xs font-medium">Source</span>
                    </div>
                    <div className="w-8 h-[1px] bg-white/10" />
                    <div className={`flex items-center gap-1.5 ${rois.length > 0 ? 'text-indigo-400' : (inputSource ? 'text-white' : 'text-neutral-500')}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${rois.length > 0 ? 'bg-indigo-500/20' : (inputSource ? 'bg-white/10' : 'bg-white/5')}`}>2</div>
                      <span className="text-xs font-medium">Draw ROI</span>
                    </div>
                    <div className="w-8 h-[1px] bg-white/10" />
                    <div className={`flex items-center gap-1.5 ${rois.length > 0 ? 'text-white' : 'text-neutral-500'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${rois.length > 0 ? 'bg-white/10' : 'bg-white/5'}`}>3</div>
                      <span className="text-xs font-medium">Train</span>
                    </div>
                    <button onClick={() => setShowStepper(false)} className="ml-2 p-1 text-neutral-400 hover:text-white rounded-full hover:bg-white/10 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )} */}

                {/* 2. ROI Tool Palette – visible only when ROI icon clicked (Training Mode) */}
                {viewMode === 'training' && (
                  <ROIToolsPalette
                    visible={roiToolsVisible}
                    drawingMode={drawingMode}
                    isDrawing={isDrawing}
                    onSelectMode={() => { setDrawingMode('select'); setCurrentROI(null); setIsDrawing(false); }}
                    onRectangleMode={() => addNewROI('rectangle')}
                    onPolygonMode={() => addNewROI('polygon')}
                    onClearAll={() => setRois([])}
                    onFinishPolygon={finishPolygon}
                  />
                )}

                {/* Video sources Placeholder */}
                {(!videoUrl && inputSource === 'upload') && (
                  <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative mb-6 flex flex-col items-center gap-4 p-6 rounded-2xl backdrop-blur-xl"
                    >
                      {/* Glow background */}


                      {/* Upload icon circle */}
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center bg-blue-500/5">
                        <Upload className="w-5 h-5 text-blue-400 opacity-70" />
                      </div>

                      {/* Helper text */}
                      <p className=" text-zinc-400  text-[10px] font-bold tracking-widest uppercase text-center max-w-xs">
                        Upload a video stream to start.
                      </p>

                      {/* Action button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-blue-500/10 text-white text-xs font-bold tracking-widest rounded-lg shadow-md shadow-blue-500/20 transition-transform active:scale-95"
                      >
                        Select Video
                      </button>
                    </motion.div>

                    <div className="absolute bottom-15 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-blue-500/30" /> MP4</span>
                      <div className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-blue-500/30" /> MOV </span>
                    </div>
                  </div>
                )}

                {inputSource === 'oak' && isOakStreaming && (
                  <img
                    ref={oakStreamRef}
                    src={streamUrl}
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${inferenceSourceVisibilityClass}`}
                    alt="OAK Camera Stream"
                    onLoad={handleOakStreamLoad}
                    crossOrigin="anonymous"
                  />
                )}

                {inputSource === 'upload' && playbackMode === 'video' && !backendExtractionMode && (
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${inferenceSourceVisibilityClass}`}
                    autoPlay
                    muted
                    loop
                    // onLoadedMetadata={handleLoadedMetadata}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleVideoLoad}
                    playsInline
                  />
                )}

                {inputSource === 'camera' && (
                  <video
                    ref={videoRef}
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${inferenceSourceVisibilityClass}`}
                    autoPlay
                    muted
                    playsInline
                    onLoadedMetadata={handleVideoLoad}
                  />
                )}

                {inputSource === 'remote' && remoteCameraFrame && (
                  <img
                    ref={remoteImageRef}
                    src={`data:image/jpeg;base64,${remoteCameraFrame}`}
                    className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${inferenceSourceVisibilityClass}`}
                    alt="Remote Camera Stream"
                    onLoad={(e) => {
                      const img = e.currentTarget;
                      // Update dimensions from actual image
                      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        setVideoDimensions({
                          width: img.naturalWidth,
                          height: img.naturalHeight
                        });
                        // Force redraw with new dimensions
                        setTimeout(() => drawCanvas(), 100);
                      }
                    }}
                    crossOrigin="anonymous"
                  />
                )}

                {viewMode === 'inference' && (
                  <div className="absolute inset-0 z-30">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-4">
                      <div className="space-y-2 pointer-events-auto">
                        {inference.inferenceWarning && (
                          <div className="max-w-sm rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-200 backdrop-blur-md">
                            {inference.inferenceWarning}
                          </div>
                        )}
                        {inference.downloadError && inference.showDownloadPopup === false && (
                          <div className="max-w-sm rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-200 backdrop-blur-md">
                            {inference.downloadError}
                          </div>
                        )}
                      </div>

                      <div className="pointer-events-auto inline-flex rounded-full border border-white/10 bg-black/55 p-1 backdrop-blur-md">
                        {(['processed', 'original'] as const).map((mode) => {
                          const active = inferenceViewerMode === mode;
                          return (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setInferenceViewerMode(mode)}
                              className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] transition-colors ${active
                                ? 'bg-blue-600 text-white'
                                : 'text-zinc-400 hover:text-zinc-100'
                                }`}
                            >
                              {mode === 'processed' ? 'Processed' : 'Original'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div
                      className={`absolute inset-0 bg-black transition-opacity duration-300 ${inferenceViewerMode === 'processed' ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                    />

                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${inferenceViewerMode === 'processed' ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}
                    >
                      {showPersistedProcessedVideo ? (
                        <>
                          <video
                            key={inference.processedVideoUrl}
                            ref={processedInferenceVideoRef}
                            src={inference.processedVideoUrl}
                            className="h-full w-full object-contain bg-black"
                            autoPlay
                            muted={false}
                            controls
                            playsInline
                            preload="auto"
                            crossOrigin="anonymous"
                            onLoadedMetadata={() => {
                              // Clear previous errors on successful load
                              videoErrorCountRef.current = 0;
                              void processedInferenceVideoRef.current?.play().catch((err) => {
                                addTerminalLog(`⚠️ Autoplay blocked: ${err.message}`);
                              });
                            }}
                            onCanPlay={() => {
                              // Silent success - don't spam logs
                              videoErrorCountRef.current = 0;
                            }}
                            onError={(e: any) => {
                              const videoElement = e.currentTarget as HTMLVideoElement;
                              const errorCode = videoElement.error?.code;
                              const errorMessages: Record<number, string> = {
                                1: 'MEDIA_ERR_ABORTED - Playback aborted',
                                2: 'MEDIA_ERR_NETWORK - Network error',
                                3: 'MEDIA_ERR_DECODE - Decoding error',
                                4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported',
                              };
                              const errorMsg = errorMessages[errorCode || 0] || `Unknown error (${errorCode})`;

                              // Prevent infinite error loop - only log once per 3 errors
                              videoErrorCountRef.current += 1;
                              if (videoErrorCountRef.current % 3 === 1) {
                                // Don't pass the event object to console to avoid Promise serialization errors
                                console.error('Video error code:', errorCode);
                                addTerminalLog(`❌ Video error: ${errorMsg}`);
                              }

                              // Attempt to reload the video (max 2 attempts)
                              if (
                                videoReloadAttemptsRef.current < 2 &&
                                processedInferenceVideoRef.current &&
                                inference.processedVideoUrl
                              ) {
                                videoReloadAttemptsRef.current += 1;
                                const attempt = videoReloadAttemptsRef.current;
                                if (attempt === 1) {
                                  addTerminalLog(`⏳ Reload attempt ${attempt}/2...`);
                                  processedInferenceVideoRef.current.src = '';
                                  setTimeout(() => {
                                    if (processedInferenceVideoRef.current) {
                                      processedInferenceVideoRef.current.src = inference.processedVideoUrl;
                                    }
                                  }, 800);
                                } else if (attempt === 2) {
                                  addTerminalLog(`⏳ Final reload with preload reset...`);
                                  processedInferenceVideoRef.current.preload = 'none';
                                  processedInferenceVideoRef.current.src = '';
                                  setTimeout(() => {
                                    if (processedInferenceVideoRef.current) {
                                      processedInferenceVideoRef.current.preload = 'auto';
                                      processedInferenceVideoRef.current.src = inference.processedVideoUrl;
                                    }
                                  }, 1000);
                                }
                              } else if (videoReloadAttemptsRef.current >= 2) {
                                // Mark video as unsupported after retries exhausted and fall back to image frame
                                if (videoErrorCountRef.current % 10 === 1) {
                                  addTerminalLog('⚠️ Video reload attempts exhausted. Falling back to latest processed frame.');
                                }
                                setProcessedVideoUnsupported(true);
                              }
                            }}
                            onLoadStart={() => {
                              // Reduced logging to avoid spam
                              if (videoReloadAttemptsRef.current === 0) {
                                addTerminalLog('⏳ Video loading...');
                              }
                            }}
                            onProgress={() => {
                              const video = processedInferenceVideoRef.current;
                              if (video && video.buffered.length > 0) {
                                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                                const duration = video.duration;
                                // Only log buffering at major milestones (25%, 50%, 75%, 100%)
                                if (duration && bufferedEnd < duration) {
                                  const percent = Math.floor((bufferedEnd / duration) * 100);
                                  if (percent % 25 === 0 && percent > 0) {
                                    addTerminalLog(`📦 Buffered: ${percent}%`);
                                  }
                                }
                              }
                            }}
                          />
                          {/* Fallback text if video fails */}
                          {!inference.processedVideoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                              <div className="text-center">
                                <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
                                <div className="text-sm text-red-300">Video URL unavailable</div>
                                <button
                                  onClick={() => {
                                    const jobId = inference.backendVideoProcessing.jobId;
                                    if (jobId) {
                                      void inference.fetchProcessedVideoFromBackend?.(jobId);
                                    }
                                  }}
                                  className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                                >
                                  Retry
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : showProcessedPreviewFrame ? (
                        <img
                          src={inference.processedFrame}
                          className="h-full w-full object-contain bg-black"
                          alt="AI Inference Output"
                          onError={() => {
                            addTerminalLog('❌ Failed to load preview frame');
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black">
                          <div className="text-center p-4">
                            <Brain className="mx-auto mb-2 h-12 w-12 text-neutral-600" />
                            <div className="text-neutral-500">AI Inference Output</div>
                            <div className="mt-1 text-xs text-neutral-600">
                              {inference.backendVideoProcessing.isProcessing
                                ? `Processing: ${inference.backendVideoProcessing.currentFrame}/${inference.backendVideoProcessing.totalFrames}`
                                : inference.backendVideoProcessing.status === 'completed' || inference.backendVideoProcessing.status === 'paused'
                                  ? 'Click "Processed" tab above to view video'
                                  : 'Start inference to see processed feed'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Canvas for ROI drawing */}
                {viewMode === 'training' && (
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onTouchStart={handleCanvasTouch}
                    onTouchMove={handleCanvasTouchMove}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseLeave={() => {
                      if (isDrawing && currentROI && currentROI.type === 'rectangle') {
                        setIsDrawing(false);
                      }
                      if (!tooltipHoveredRef.current && hoveredROI) {
                        scheduleTooltipHide();
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      if (isDrawing && currentROI && currentROI.type === 'polygon') {
                        finishPolygon();
                      }
                    }}
                    className={`absolute w-full h-full inset-0 z-10 cursor-crosshair ${drawingMode === 'select' ? 'pointer-events-none' : ''}`}
                  />
                )}

                {/* Drawing Instructions */}
                {viewMode === 'training' && drawingMode !== 'select' && (
                  <div className="absolute top-2 right-2 px-3 py-1.5 text-[10px] text-neutral-400 font-mono tracking-wider  pointer-events-auto bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 shadow-xl">
                    {drawingMode === 'rectangle' ? 'Click and drag to draw rectangle' : 'Click to add Polygon points'}
                  </div>
                )}

                {/* 3. Consolidated Status Bar (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2  pointer-events-none">
                  <div className="flex items-center gap-3">
                    {/* Recording status */}
                    {isRecording && (
                      <div className="flex items-center mb-10 gap-2 px-3 py-1 bg-blue-600/20 border border-blue-600/30 text-blue-500 rounded-full backdrop-blur-md pointer-events-auto">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold tracking-wider">REC {remainingTime}s</span>
                      </div>
                    )}

                    {/* Backend Extraction Mode Badge */}
                    <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
                      {backendExtractionMode && (
                        <div className="flex items-center mb-10 gap-1.5 px-1 py-1 bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 rounded-lg text-[10px] uppercase font-bold tracking-wider">
                          <CloudUpload className="w-3 h-3" />  Backend Processing
                        </div>
                      )}

                      {/* Camera Status */}
                      {inputSource === 'camera' && (
                        <div className={`flex items-center mb-10 gap-1.5 px-1 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border ${currentCameraStream ? 'bg-blue-600/20 border-blue-600/30 text-blue-300' : 'bg-neutral-500/20 border-neutral-500/30 text-neutral-400'}`}>
                          <VideoIcon className="w-3 h-3" /> ON
                        </div>
                      )}
                      {/* Remote Camera Status */}
                      {inputSource === 'remote' && (
                        <div className={`flex items-center mb-10 gap-1.5 px-1 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border ${remoteCameraStatus === 'connected' ? 'bg-blue-600/20 border-blue-600/30 text-blue-300' : 'bg-amber-600/20 border-amber-600/30 text-amber-300'}`}>
                          <Smartphone className="w-3 h-3" /> {remoteCameraStatus}
                        </div>
                      )}
                      {/* OAK Camera Status */}
                      {inputSource === 'oak' && (
                        <div className={`flex items-center mb-10 gap-1.5 px-1 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border ${isOakStreaming ? 'bg-blue-600/20 border-blue-600/30 text-blue-300' : 'bg-neutral-500/20 border-neutral-500/30 text-neutral-400'}`}>
                          <Camera className="w-3 h-3" /> OAK-D
                        </div>
                      )}

                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Inference status */}
                    {viewMode === 'inference' && (
                      <div className={`flex items-center mb-10 gap-2 px-3 py-1 rounded-lg text-xs font-bold tracking-wider border pointer-events-auto ${inference.isProcessing ? 'bg-orange-500/20 border-orange-500/30 text-orange-400' : 'bg-neutral-500/20 border-neutral-500/30 text-neutral-400'}`}>
                        <Activity className={`w-3.5 h-3.5 ${inference.isProcessing ? 'animate-pulse' : ''}`} />
                        {inference.isProcessing ? 'Inferencing' : 'Model Idle'}
                      </div>
                    )}

                    {viewMode === 'inference' && visibleInferenceAnomalyCount > 0 && (
                      <div className="flex mb-10 items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg font-bold text-xs pointer-events-auto">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {visibleInferenceAnomalyCount} Anomalies
                      </div>
                    )}



                  </div>
                  {/* <div>Start Recording</div> */}
                </div>

                {/* ROI Hover Details Overlay */}
                <AnimatePresence>
                  {showLegacyHoverOverlay && hoveredROI && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute z-30 bg-[#16181D]/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl pointer-events-auto"
                      style={{
                        left: (rois.find(r => r.id === hoveredROI)?.points[0].x || 0) * scale + offset.x + 0,
                        top: (rois.find(r => r.id === hoveredROI)?.points[0].y || 0) * scale + offset.y + 0,
                      }}
                    >
                      {(() => {
                        const roi = rois.find(r => r.id === hoveredROI);
                        if (!roi) return null;
                        return (
                          <div className="space-y-3 min-w-[175px]">
                            <div className="flex items-center justify-between gap-1">
                              <input
                                type="text"
                                value={roi.label}
                                onChange={(e) => updateROI(roi.id, { label: e.target.value })}
                                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm font-bold text-white focus:outline-none focus:border-blue-500 w-full"
                              />
                              <button
                                onClick={() => deleteROI(roi.id)}
                                className="p-1.5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Training Types</p>
                              <div className="flex flex-wrap gap-1">
                                {['anomaly', 'sequential', 'motion'].map(type => (
                                  <button
                                    key={type}
                                    onClick={() => {
                                      const newTraining = roi.training.includes(type as TrainingType)
                                        ? roi.training.filter(t => t !== type)
                                        : [...roi.training, type as TrainingType];
                                      updateROI(roi.id, { training: newTraining });
                                    }}
                                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${roi.training.includes(type as TrainingType)
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-white/5 text-neutral-500 hover:bg-white/10'
                                      }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-neutral-500">
                                {roi.points.length} Points {roi.type}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}
                </AnimatePresence>

                {typeof window !== 'undefined' && createPortal(
                  <AnimatePresence>
                    {viewMode === 'training' && hoveredROIData && (
                      <motion.div
                        ref={tooltipRef}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onAnimationComplete={updateTooltipPosition}
                        onMouseEnter={() => {
                          tooltipHoveredRef.current = true;
                          clearTooltipHideTimeout();
                        }}
                        onMouseLeave={() => {
                          tooltipHoveredRef.current = false;
                          scheduleTooltipHide();
                        }}
                        className="fixed z-[120] bg-[#16181D]/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl pointer-events-auto"
                        style={{
                          left: tooltipPosition.left,
                          top: tooltipPosition.top,
                          visibility: tooltipPosition.visible ? 'visible' : 'hidden'
                        }}
                      >
                        <div className="space-y-3 min-w-[175px]">
                          <div className="flex items-center justify-between gap-1">
                            <input
                              type="text"
                              value={hoveredROIData.label}
                              onChange={(e) => updateROI(hoveredROIData.id, { label: e.target.value })}
                              className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm font-bold text-white focus:outline-none focus:border-blue-500 w-full"
                            />
                            <button
                              onClick={() => deleteROI(hoveredROIData.id)}
                              className="p-1.5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="space-y-2">
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Training Types</p>
                            <div className="flex flex-wrap gap-1">
                              {['anomaly', 'sequential', 'motion'].map(type => (
                                <button
                                  key={type}
                                  onClick={() => {
                                    const newTraining = hoveredROIData.training.includes(type as TrainingType)
                                      ? hoveredROIData.training.filter(t => t !== type)
                                      : [...hoveredROIData.training, type as TrainingType];
                                    updateROI(hoveredROIData.id, { training: newTraining });
                                  }}
                                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${hoveredROIData.training.includes(type as TrainingType)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-neutral-500 hover:bg-white/10'
                                    }`}
                                >
                                  {type}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-neutral-500">
                              {hoveredROIData.points.length} Points | {hoveredROIData.type}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>,
                  document.body
                )}

              </div>
              <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-10 pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                  <div className="px-2 py-0.5  border rounded-lg border-white/20 text-[10px] text-zinc-400 ">{videoDimensions.width}x{videoDimensions.height}</div>
                  {/* <div className="px-2 py-1 bg-black/80 border border-white/20 text-xs font-paragraph text-white">{backendExtractionMode && 'Backend Mode'}</div> */}
                </div>

              </div>

              {/* Training Playback Controls Bottom Strip */}
              {viewMode === 'training' && (
                <div className="absolute bottom-0 left-0 w-full z-[100] h-12 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end px-4 pb-2 pointer-events-auto transition-transform">
                  <div className="flex items-center justify-between w-full">

                    {/* Left Controls */}
                    <div className="flex items-center gap-3">
                      {inputSource === 'upload' && !backendExtractionMode && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = 0;
                              }
                            }}
                            className="text-neutral-400 hover:text-white transition-colors p-1"
                            title="Restart"
                          >
                            <SkipBack className="w-3 h-3" />
                          </button>
                          <button
                            onClick={togglePlay}
                            className="text-white hover:text-blue-400 transition-colors p-1 flex items-center justify-center rounded-full hover:bg-white/10"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4 fill-current" />
                            ) : (
                              <Play className="w-4 h-4 fill-current ml-0.5" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.currentTime = Math.min(
                                  videoRef.current.duration,
                                  videoRef.current.currentTime + 5
                                );
                              }
                            }}
                            className="text-neutral-400 hover:text-white transition-colors p-1"
                          >
                            <SkipForward className="w-3 h-3" />
                          </button>
                          <div className="flex items-center gap-3 flex-1 max-w-4xl s">

                            <div className=" relative flex items-center h-full w-40 flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={recordingProgress}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  setRecordingProgress(value);
                                  if (videoRef.current && videoRef.current.duration) {
                                    videoRef.current.currentTime =
                                      (value / 100) * videoRef.current.duration;
                                  }
                                }}
                                className="slider w-full h-[3px] bg-white/20 rounded-full appearance-none outline-none hover:h-[4px] transition-all"
                                style={{ accentColor: '#3b82f6' }}
                              />
                            </div>
                            <span className="text-[10px] font-mono text-neutral-400">
                              {new Date(currentTime * 1000).toISOString().substr(14, 5)}
                            </span>
                            {/* <span className="text-[10px] font-mono text-neutral-400">
                              {new Date(duration * 1000).toISOString().substr(14, 5)}
                            </span> */}
                          </div>
                        </div>
                      )}
                    </div>



                    {/* Right Controls (Recording + AI Training) */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={toggleRecording}
                        disabled={
                          !inputSource ||
                          (inputSource === 'camera' && !currentCameraStream) ||
                          (inputSource === 'oak' && !isOakStreaming) ||
                          (inputSource === 'remote' && remoteCameraStatus !== 'connected')
                        }
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all ${isRecording
                          ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:bg-rose-500/30'
                          : 'bg-white/10 text-white hover:bg-white/20 disabled:opacity-30'
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-rose-400 animate-pulse' : 'bg-white'
                            }`}
                        />
                        {isRecording ? `Stop REC (${remainingTime}s)` : 'Start Recording'}
                      </button>

                      <button
                        onClick={() => setShowConfirm(true)}
                        disabled={!backendConnected || isCapturingTrainingFrames}

                        className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all border ${!backendConnected || isCapturingTrainingFrames
                          ? 'bg-zinc-900/40 border-white/5 text-zinc-600 cursor-not-allowed'
                          : 'bg-zinc-800/80 border-white/10 text-zinc-100 hover:bg-zinc-700/80'
                          }`}
                      >
                        <Brain className="w-3.5 h-3.5" />
                        {isCapturingTrainingFrames ? 'Capturing' : 'AI Training'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
            {/* Playback Controls Bar (Inference) */}
            {/* {viewMode !== 'training' && (
              <div className="h-14 bg-[#16181D]/90 backdrop-blur-md border-t border-white/5 flex items-center px-2 rounded-b-xl">
                <div className="flex items-center justify-between  gap-2">
                  <span className="text-xs text-neutral-400 shrink-0">
                    Threshold:
                  </span>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={inference.advancedSettings.threshold}
                    onChange={(e) =>
                      inference.setAdvancedSettings(prev => ({
                        ...prev,
                        threshold: parseFloat(e.target.value),
                      }))
                    }
                    className="slider w-50 rounded-full h-1 bg-neutral-700 appearance-none cursor-pointer"
                  />

                  <span className="text-xs font-mono text-white shrink-0">
                    {inference.advancedSettings.threshold.toFixed(2)}
                  </span>
                </div>
              </div>
            )} */}


            {/* Subtle Confirmation Popup */}
            {showConfirm && (
              <div className="fixed inset-0 mt-75 right-4 bottom-2 flex items-center justify-center z-50 ">
                <div className={`bg-zinc-900 p-3 w-[230px]  rounded-lg `}>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-2">
                    Confirm Session
                  </div>
                  <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="w-full px-2 py-1 text-[10px] bg-neutral-800 border border-neutral-700 rounded-md text-white outline-none focus:border-blue-500 mb-2"
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-2 py-1 bg-neutral-700 text-neutral-300 rounded-md text-[10px] hover:bg-neutral-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(false);
                        startTraining();
                      }}
                      className="px-2 py-1 bg-blue-600 text-white rounded-md text-[10px] hover:bg-blue-700"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Controls & Panels */}
          <div className="w-full lg:w-[320px] flex flex-col gap-4 min-h-0">
            <AnimatePresence mode="wait">
              {/* ================= NORMAL CONTROLS (TRAINING) ================= */}
              {activePanel === null && viewMode === "training" && (
                <motion.div
                  key="controls-training"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col gap-3 min-h-0 h-full overflow-hidden"
                >
                  {/* Configuration Card */}
                  <div className={panelCard + " min-h-0"}>
                    <div className="p-3 flex flex-col h-full overflow-hidden">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-3">
                        <h3 className={ds.text.label + " text-zinc-500"}>Model </h3>
                        <Activity className="w-3.5 h-3.5 text-zinc-600" />
                      </div>

                      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
                        <button
                          onClick={() => setTrainingTypes(prev => ({ ...prev, anomaly: !prev.anomaly }))}
                          className={`w-full flex items-center gap-3 px-3 py-2 ${ds.radius.sm} border transition-all ${trainingTypes.anomaly ? "bg-blue-600/5 border-blue-600/30 text-blue-400" : "bg-white/1 border-white/5 text-zinc-500 hover:border-white/10"}`}
                        >
                          <div className={`p-1.5 rounded-md ${trainingTypes.anomaly ? "bg-blue-600/10" : "bg-zinc-800/30"}`}><Bug className="w-3.5 h-3.5" /></div>
                          <span className="flex-1 text-left text-[10px] font-bold tracking-widest uppercase">Anomaly</span>
                          <span className="text-sm font-mono">
                            {trainingTypes.anomaly ? "✓" : "○"}
                          </span>
                        </button>

                        <button
                          onClick={() => setTrainingTypes(prev => ({ ...prev, sequential: !prev.sequential }))}
                          className={`w-full flex items-center gap-3 px-3 py-2 ${ds.radius.sm} border transition-all ${trainingTypes.sequential ? "bg-blue-600/5 border-blue-600/30 text-blue-400" : "bg-white/1 border-white/5 text-zinc-500 hover:border-white/10"}`}
                        >
                          <div className={`p-1.5 rounded-md ${trainingTypes.sequential ? "bg-blue-600/10" : "bg-zinc-800/30"}`}><Workflow className="w-3.5 h-3.5" /></div>
                          <span className="flex-1 text-left text-[10px] font-bold tracking-widest uppercase">Sequential</span>
                          <span className="text-sm font-mono">
                            {trainingTypes.sequential ? "✓" : "○"}
                          </span>
                        </button>

                        <button
                          onClick={() => setTrainingTypes(prev => ({ ...prev, motion: !prev.motion }))}
                          className={`w-full flex items-center gap-3 px-3 py-2 ${ds.radius.sm} border transition-all ${trainingTypes.motion ? "bg-blue-600/5 border-blue-600/30 text-blue-400" : "bg-white/1 border-white/5 text-zinc-500 hover:border-white/10"}`}
                        >
                          <div className={`p-1.5 rounded-md ${trainingTypes.motion ? "bg-blue-600/10" : "bg-zinc-800/30"}`}><Crosshair className="w-3.5 h-3.5" /></div>
                          <span className="flex-1 text-left text-[10px] font-bold tracking-widest uppercase">Motion</span>
                          <span className="text-sm font-mono">
                            {trainingTypes.motion ? "✓" : "○"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recording settings Card */}
                  <div className={panelCard + " h-42 shrink-0"}>
                    <div className="p-3 flex flex-col h-full overflow-hidden">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                        <h3 className={ds.text.label + " text-zinc-500"}>Recording</h3>
                        <Settings2 className="w-3.5 h-3.5 text-zinc-600" />
                      </div>

                      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                            <span>Frame Rate</span>
                            <span className="font-mono text-blue-500">{frameRate} FPS</span>
                          </div>
                          <input type="range" min="1" max="60" value={frameRate} onChange={(e) => setFrameRate(parseInt(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                            <span>Duration</span>
                            <span className="font-mono text-blue-500">{recordingDuration}S</span>
                          </div>
                          <input type="range" min="5" max="60" value={recordingDuration} onChange={(e) => setRecordingDuration(parseInt(e.target.value))} className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500" />
                        </div>

                        {isRecording && (
                          <div className="pt-2">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1 animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> REC PHASE</span>
                              <span className="text-[9px] font-mono text-zinc-500">{captureCount} FRS</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
                              <div className="h-full bg-blue-600 transition-all" style={{ width: `${((recordingDuration - remainingTime) / recordingDuration) * 100}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className={panelCard + " h-15 shrink-0 mb-1"}>
                    <div className="p-3 flex flex-row gap-2 h-full items-center justify-between">

                      <button onClick={checkDatasets} className={buttonSecondary + " w-full text-[9px]! uppercase tracking-widest h-10"}>
                        <Database className="w-3 h-3" /> Check Dataset
                      </button>
                      <button onClick={testCapture} className={buttonSecondary + " w-full text-[9px]! uppercase tracking-widest opacity-50 cursor-not-allowed h-10"}>
                        <Clock className="w-3 h-3" /> Test Capture
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ================= INFERENCE PANEL ================= */}
              {activePanel === null && viewMode === "inference" && (
                <motion.div
                  key="controls-inference"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-1 min-h-0"
                >
                  <InferenceModelDropdown
                    open={openDropdown === 'inferenceModel'}
                    onToggle={() => toggleDropdown('inferenceModel')}
                    onClose={closeDropdowns}
                    models={inference.models}
                    selectedModel={inference.selectedModel}
                    selectedModelType={inference.selectedModelType}
                    onSelectModel={(modelId) => {
                      inference.setSelectedModel(modelId);
                      closeDropdowns();
                    }}
                    onSelectModelType={(modelType) => inference.setSelectedModelType(modelType)}
                    selectedModelInfo={inference.selectedModelInfo}
                    selectedModelAvailableTypes={inference.selectedModelAvailableTypes}
                    getModelTypeLabel={inference.getModelTypeLabel}
                    isModelLoaded={inference.isModelLoaded}
                    modelLoading={inference.modelLoading}
                    onRefreshModels={inference.loadModels}
                    onLoadModel={() => {
                      if (inference.selectedModel) {
                        void inference.loadSpecificModel(inference.selectedModel);
                      }
                      closeDropdowns();
                    }}
                    onUnloadModel={() => {
                      if (inference.selectedModel) void inference.unloadModel(inference.selectedModel);
                      closeDropdowns();
                    }}
                    onOpenDownload={(modelId, modelInfo) => {
                      void inference.downloadModel(modelId, modelInfo);
                    }}
                    onStartDownload={() => {
                      void inference.startModelDownload();
                    }}
                    showDownloadPopup={inference.showDownloadPopup}
                    onCloseDownloadPopup={() => {
                      inference.setShowDownloadPopup(false);
                    }}
                    selectedModelForDownload={inference.selectedModelForDownload}
                    isDownloading={inference.isDownloading}
                    downloadProgress={inference.downloadProgress}
                    downloadError={inference.downloadError}
                    downloadDebugInfo={inference.downloadDebugInfo}
                    addTerminalLog={addTerminalLog}
                  />
                  <InferenceControls
                    activeTab={activeInferenceTab}
                    onActiveTabChange={setActiveInferenceTab}
                    inputSource={inputSource}
                    videoFile={videoFile}
                    isRealtime={inference.isRealtime}
                    setIsRealtime={(value) => inference.setIsRealtime(value)}
                    selectedModel={inference.selectedModel}
                    selectedModelInfo={inference.selectedModelInfo}
                    selectedModelAvailableTypes={inference.selectedModelAvailableTypes}
                    isOakStreaming={isOakStreaming}
                    modelLoading={inference.modelLoading}
                    connectionError={inference.connectionError}
                    isProcessing={inference.isProcessing}
                    inferenceWarning={inference.inferenceWarning}
                    backendVideoStatus={inference.backendVideoProcessing.status}
                    uploadedVideoInfo={inference.uploadedVideoInfo}
                    predictions={inference.predictions}
                    inferenceStats={inference.inferenceStats}
                    onToggleRealtimeInference={() => {
                      void inference.toggleRealtimeInference();
                    }}
                    onProcessSingleFrame={() => {
                      void inference.processFrameWithRetry();
                    }}
                    onUploadVideoForBackend={() => {
                      if (videoFile) {
                        void inference.processVideoOnBackend(videoFile, false);
                      }
                    }}
                    onStartUploadedVideoInference={() => {
                      void inference.startInferenceOnUploadedVideo();
                    }}
                    onCancelBackendVideo={() => {
                      void inference.cancelBackendVideoProcessing();
                    }}
                    batchFiles={inference.batchFiles}
                    isBatchProcessing={inference.isBatchProcessing}
                    onBatchFilesSelected={inference.handleBatchFileUpload}
                    onProcessBatch={() => {
                      void inference.processBatch();
                    }}
                  />
                </motion.div>
              )}

              {/* ================= TERMINAL PANEL ================= */}
              {activePanel === "terminal" && (
                <motion.div
                  key="panel-terminal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex flex-col flex-1 min-h-0 ${ds.colors.surfaceBlur} border ${ds.colors.borderStrong} ${ds.radius.md} ${ds.shadow.strong} overflow-hidden`}
                >
                  <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-blue-500" />
                      <span className={ds.text.label + " text-zinc-300"}>Live Output</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setTerminalLogs([])} className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-rose-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setActivePanel(null)} className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div ref={terminalRef} className="flex-1 p-4 font-mono text-[9px] overflow-y-auto space-y-1.5 bg-black/40 custom-scrollbar">
                    {[...new Set(terminalLogs)].map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.includes("ERROR") || log.includes("❌")
                            ? "text-red-400"
                            : log.includes("WARNING") || log.includes("⚠")
                              ? "text-yellow-400"
                              : log.includes("INFO") || log.includes("INFO]") || log.includes("✓")
                                ? "text-blue-400"
                                : log.includes("[PROGRESS]")
                                  ? "text-green-400 font-bold"
                                  : log.includes("SUCCESS")
                                    ? "text-green-400"
                                    : "text-neutral-300"
                        }
                      >
                        <span className="text-blue-500/50 mr-2">›</span>
                        {log}
                      </div>
                    ))}
                    {terminalLogs.length === 0 && (
                      <div className="text-neutral-600 italic">No logs yet. Start recording or training to see logs here.</div>
                    )}
                  </div>

                  <div className="px-3 py-2 border-t border-white/5 bg-black/20 flex items-center gap-2">
                    <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Buffer: {terminalLogs.length}/500</span>
                  </div>
                </motion.div>
              )}

              {/* ================= INSTRUCTIONS PANEL ================= */}
              {activePanel === 'instructions' && (
                <motion.div
                  key="panel-instructions"
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex flex-col flex-1 min-h-0 ${ds.colors.surfaceBlur} border ${ds.colors.borderStrong} ${ds.radius.md} ${ds.shadow.strong} overflow-hidden font-paragraph`}
                >
                  <div className="p-3 border-b border-white/5 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                      <span className={ds.text.label + " text-zinc-300"}>Guide</span>
                    </div>
                    <button onClick={() => setActivePanel(null)} className="p-1.5 hover:bg-white/5 rounded text-zinc-400 hover:text-white transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-4">
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest border-l-2 border-blue-500 pl-2">Workflow</h4>
                      <ol className="space-y-2.5 text-[11px] text-zinc-400 leading-relaxed">
                        <li><span className="text-zinc-100 font-bold">01.</span> Setup your input source from the top toolbar</li>
                        <li><span className="text-zinc-100 font-bold">02.</span> Draw ROIs using the target tools palette</li>
                        <li><span className="text-zinc-100 font-bold">03.</span> Select training modes and recording duration</li>
                        <li><span className="text-zinc-100 font-bold">04.</span> Run recording and deploy training session</li>
                      </ol>
                    </div>
                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] text-zinc-500 leading-normal italic">
                      Tip: You can use overlapping ROIs for complex detection tasks.
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {viewMode === 'inference' && (
          <BackendVideoProcessingPanel
            processingState={inference.backendVideoProcessing}
            processedVideoUrl={inference.processedVideoUrl}
            onCancelProcessing={() => {
              void inference.stopBackendVideoProcessing();
            }}
            onDismissError={inference.dismissBackendVideoError}
            onPreviousFrame={() => {
              const jobId = inference.backendVideoProcessing.jobId;
              if (!jobId) return;
              void inference.fetchProcessedFrame(
                jobId,
                Math.max(0, inference.backendVideoProcessing.currentFrame - 1)
              );
            }}
            onNextFrame={() => {
              const jobId = inference.backendVideoProcessing.jobId;
              if (!jobId) return;
              void inference.fetchProcessedFrame(
                jobId,
                Math.min(
                  inference.backendVideoProcessing.totalFrames,
                  inference.backendVideoProcessing.currentFrame + 1
                )
              );
            }}
            onRefreshLatest={() => {
              const jobId = inference.backendVideoProcessing.jobId;
              if (!jobId) return;
              void inference.fetchLatestProcessedFrame(jobId);
            }}
            onPlayProcessedVideo={async () => {
              try {
                const jobId = inference.backendVideoProcessing.jobId;

                // If we previously marked the processed video unsupported, fall back to latest image frame
                if (processedVideoUnsupported) {
                  addTerminalLog('⚠️ Processed video unsupported — showing latest processed frame instead');
                  if (jobId && inference.fetchLatestProcessedFrame) await inference.fetchLatestProcessedFrame(jobId);
                  setInferenceViewerMode('processed');
                  await openFullscreenPopup();
                  return;
                }

                // If a processed video URL isn't available yet, try fetching it from backend
                if (!inference.processedVideoUrl) {
                  if (jobId && inference.fetchProcessedVideoFromBackend) {
                    addTerminalLog('📥 Fetching processed video before play...');
                    const url = await inference.fetchProcessedVideoFromBackend(jobId);
                    if (!url) {
                      // fallback: fetch latest processed frame (still shows image)
                      addTerminalLog('⚠️ Processed video unavailable, loading latest frame instead');
                      if (inference.fetchLatestProcessedFrame) await inference.fetchLatestProcessedFrame(jobId);
                      setInferenceViewerMode('processed');
                      await openFullscreenPopup();
                      return;
                    }
                  } else if (jobId && inference.fetchLatestProcessedFrame) {
                    addTerminalLog('⚠️ No processed video URL; loading latest frame');
                    await inference.fetchLatestProcessedFrame(jobId);
                    setInferenceViewerMode('processed');
                    await openFullscreenPopup();
                    return;
                  }
                }

                // Finally, open processed viewer and attempt to play
                playProcessedInferenceVideo();
                await openFullscreenPopup();
              } catch (err) {
                addTerminalLog(`❌ Failed to prepare processed video: ${err}`);
              }
            }}
            onDownloadVideo={inference.downloadProcessedVideo}
          />
        )}

        {showFullscreenPopup && (
          <div className="fixed inset-0 z-[350] flex flex-col bg-black/95">
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Brain className="mr-2 h-5 w-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Inference Fullscreen</h2>
                </div>
                <div className="text-sm text-neutral-400">
                  <span
                    className={`rounded-lg px-3 py-1.5 ${popupCurrentFrame === 'original' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                      }`}
                  >
                    {popupCurrentFrame === 'original'
                      ? 'Original Feed'
                      : showPersistedProcessedVideo
                        ? 'Processed Video'
                        : 'Processed Frame'}
                  </span>
                  <span className="mx-2 text-neutral-600">|</span>
                  <span>
                    Press <kbd className="ml-1 rounded bg-neutral-800 px-2 py-0.5">K</kbd> to swap
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsLiveView(!isLiveView)}
                  className={`flex items-center rounded-lg px-3 py-1.5 text-sm ${isLiveView ? 'bg-green-600 hover:bg-green-700' : 'bg-neutral-800 hover:bg-neutral-700'
                    }`}
                >
                  {isLiveView ? (
                    <>
                      <div className="mr-2 h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                      <span>Live ON</span>
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Live OFF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={refreshPopupFrame}
                  className="flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm hover:bg-blue-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </button>

                <button
                  onClick={downloadPopupFrame}
                  className="flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    popupCurrentFrame === 'original'
                      ? !popupOriginalFrame
                      : !(showPersistedProcessedVideo || popupProcessedFrame)
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  {popupCurrentFrame === 'processed' && showPersistedProcessedVideo
                    ? 'Download Video'
                    : 'Download'}
                </button>

                <button
                  onClick={closeFullscreenPopup}
                  className="flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-sm hover:bg-red-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Close
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden bg-black">
              <div className="absolute left-4 top-4 z-20">
                <div className="rounded-lg bg-black/70 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
                  {popupCurrentFrame === 'original'
                    ? 'Original Feed'
                    : showPersistedProcessedVideo
                      ? 'Processed Video'
                      : 'Processed Frame'}
                  {isLiveView && (
                    <span className="ml-2 text-green-400">
                      {showPersistedProcessedVideo && popupCurrentFrame === 'processed'
                        ? 'VIDEO READY'
                        : 'LIVE'}
                    </span>
                  )}
                </div>
              </div>

              <div className="absolute right-4 top-4 z-20 rounded-lg bg-black/70 px-3 py-1.5 backdrop-blur-sm">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-sm text-neutral-200">
                    {showPersistedProcessedVideo && popupCurrentFrame === 'processed'
                      ? 'Processed video playback'
                      : 'Live updates active'}
                  </span>
                </div>
              </div>

              <div className="flex h-full w-full items-center justify-center p-8">
                {popupCurrentFrame === 'original' ? (
                  popupOriginalFrame ? (
                    <img
                      ref={fullscreenImageRef}
                      src={popupOriginalFrame}
                      className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                      alt="Original frame"
                    />
                  ) : (
                    <div className="rounded-xl bg-neutral-900/60 p-8 text-center">
                      <Video className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
                      <div className="mb-2 text-lg text-neutral-300">No original frame available</div>
                      <div className="text-sm text-neutral-500">
                        Make sure the source feed is playing before opening fullscreen.
                      </div>
                    </div>
                  )
                ) : showPersistedProcessedVideo && inference.processedVideoUrl ? (
                  <video
                    key={inference.processedVideoUrl}
                    ref={fullscreenVideoRef}
                    src={inference.processedVideoUrl}
                    className="max-h-full max-w-full rounded-lg bg-black object-contain shadow-2xl"
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => {
                      setLastFrameUpdateTime(Date.now());
                      void fullscreenVideoRef.current?.play().catch(() => undefined);
                    }}
                    onTimeUpdate={() => {
                      setLastFrameUpdateTime(Date.now());
                    }}
                    onError={() => {
                      addTerminalLog('Failed to load fullscreen processed video');
                    }}
                  />
                ) : popupProcessedFrame ? (
                  <img
                    ref={fullscreenImageRef}
                    src={popupProcessedFrame}
                    className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
                    alt="Processed frame"
                  />
                ) : (
                  <div className="rounded-xl bg-neutral-900/60 p-8 text-center">
                    <Brain className="mx-auto mb-4 h-16 w-16 text-neutral-600" />
                    <div className="mb-2 text-lg text-neutral-300">No processed output available</div>
                    <div className="text-sm text-neutral-500">
                      Run inference or refresh the latest processed result.
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setPopupCurrentFrame('original')}
                className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 backdrop-blur-sm transition-all ${popupCurrentFrame === 'original'
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-800/70 text-neutral-300 hover:bg-neutral-700/70'
                  }`}
                title="Show original"
              >
                <Eye className="h-5 w-5" />
              </button>

              <button
                onClick={() => setPopupCurrentFrame('processed')}
                className={`absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 backdrop-blur-sm transition-all ${popupCurrentFrame === 'processed'
                    ? 'bg-purple-600 text-white'
                    : 'bg-neutral-800/70 text-neutral-300 hover:bg-neutral-700/70'
                  }`}
                title="Show processed"
              >
                <Brain className="h-5 w-5" />
              </button>

              {inference.backendVideoProcessing.isProcessing && (
                <div className="absolute bottom-4 left-4 rounded-lg bg-black/70 px-3 py-2">
                  <div className="text-sm">
                    Frame: {inference.backendVideoProcessing.currentFrame}/
                    {inference.backendVideoProcessing.totalFrames}
                  </div>
                  <div className="text-xs text-neutral-400">
                    {inference.backendVideoProcessing.progress.toFixed(1)}% complete
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 right-4 rounded-lg bg-black/70 px-3 py-2">
                <div className="text-xs text-neutral-400">
                  Last update:{' '}
                  {lastFrameUpdateTime ? new Date(lastFrameUpdateTime).toLocaleTimeString() : 'Never'}
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-800 bg-neutral-950/90 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <div>
                    <span className="text-neutral-400">Current:</span>
                    <span className="ml-2 font-medium">
                      {popupCurrentFrame === 'original'
                        ? 'Original'
                        : showPersistedProcessedVideo
                          ? 'Processed Video'
                          : 'Processed Frame'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Live:</span>
                    <span className={`ml-2 font-medium ${isLiveView ? 'text-green-400' : 'text-red-400'}`}>
                      {isLiveView ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Model:</span>
                    <span className="ml-2 font-medium">
                      {inference.selectedModelInfo?.display_name || 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Frames:</span>
                    <span className="ml-2 font-medium">{inference.inferenceStats.totalFrames}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400">Anomalies:</span>
                    <span className="ml-2 font-medium text-red-400">
                      {inference.inferenceStats.totalAnomalies}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-2 w-2 rounded-full ${popupCurrentFrame === 'original' ? 'bg-blue-500' : 'bg-neutral-700'
                        }`}
                    />
                    <span className="text-xs text-neutral-400">Original</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-2 w-2 rounded-full ${popupCurrentFrame === 'processed' ? 'bg-purple-500' : 'bg-neutral-700'
                        }`}
                    />
                    <span className="text-xs text-neutral-400">Processed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Footer */}
        {viewMode === "training" ? (
          <TrainingFooter
            roisCount={rois.length}
            frameRate={frameRate}
            sessionName={sessionName}
            recordingDuration={recordingDuration}
            captureCount={captureCount}
            backendExtractionMode={backendExtractionMode}
            extractionStatus={extractionStatus}
            inputSource={inputSource}
            remoteCameraStatus={remoteCameraStatus}
            drawingMode={drawingMode}
            showTerminal={showTerminal}
          />
        ) : (
          <InferenceFooter
            selectedModelInfo={inference.selectedModelInfo}
            inferenceStats={inference.inferenceStats}
            isProcessing={inference.isProcessing}
            activeTab={activeInferenceTab}
            inputSource={inputSource}
            isOakStreaming={isOakStreaming}
            availableCameras={availableCameras}
            connectionError={inference.connectionError}
            loadedModelInfo={inference.loadedModelInfo}
          />
        )}
      </div>
    </main >
  );
}
