import React from 'react';
import {
  ArrowRight,
  CloudRain,
  ShieldCheck,
  Sprout,
  TrendingUp,
  Users,
  Waves,
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAdminLogin: () => void;
}

const highlights = [
  {
    icon: CloudRain,
    title: 'Local weather alerts',
    description: 'Stay ahead of heavy rain, heat, and changing conditions near your farm.',
  },
  {
    icon: ShieldCheck,
    title: 'Protect what matters',
    description: 'Prepare crops, livestock, equipment, and essential farm documents.',
  },
  {
    icon: TrendingUp,
    title: 'Plan your recovery',
    description: 'Find practical next steps, support programs, and emergency assistance.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenAdminLogin,
}) => (
  <div className="min-h-screen overflow-hidden bg-[#F8FAF9] text-[#17211B]">
    <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <a href="#" aria-label="KisanRakshak home" className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#146B3A] text-white shadow-lg shadow-emerald-900/15">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <span>
          <span className="block text-lg font-extrabold tracking-tight text-[#146B3A]">KisanRakshak</span>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#65736B]">Karnataka</span>
        </span>
      </a>

      <nav aria-label="Main navigation" className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenAdminLogin}
          className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-[#526158] transition hover:bg-white hover:text-[#146B3A] sm:inline-flex"
        >
          Officer portal
        </button>
        <button
          type="button"
          onClick={onOpenLogin}
          className="rounded-xl px-3 py-2.5 text-sm font-bold text-[#146B3A] transition hover:bg-white sm:px-4"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={onOpenRegister}
          className="rounded-xl bg-[#146B3A] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0D542D] focus:outline-none focus:ring-2 focus:ring-[#146B3A] focus:ring-offset-2"
        >
          Join free
        </button>
      </nav>
    </header>

    <main>
      <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-20">
        <div className="absolute -left-40 top-16 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" aria-hidden="true" />
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3.5 py-2 text-xs font-bold text-[#146B3A] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Built for Karnataka farmers
          </div>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-[#17211B] sm:text-5xl lg:text-6xl">
            Protect your farm.
            <span className="mt-2 block text-[#146B3A]">Prepare for tomorrow.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#65736B] sm:text-lg sm:leading-8">
            Practical weather alerts and farm-safety guidance to help you protect your crops, family, and livelihood before disaster strikes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onOpenRegister}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#146B3A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#0D542D] focus:outline-none focus:ring-2 focus:ring-[#146B3A] focus:ring-offset-2"
            >
              Create your farmer account <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onOpenLogin}
              className="rounded-xl border border-[#DCE6DF] bg-white px-6 py-3.5 text-sm font-bold text-[#304239] transition hover:border-emerald-300 hover:bg-emerald-50"
            >
              I already have an account
            </button>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-[#65736B]">
            <span className="flex -space-x-2" aria-hidden="true">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F8FAF9] bg-amber-100 text-xs font-bold text-amber-800">RK</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F8FAF9] bg-emerald-100 text-xs font-bold text-emerald-800">SP</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#F8FAF9] bg-sky-100 text-xs font-bold text-sky-800">MN</span>
            </span>
            <span><strong className="text-[#304239]">One platform</strong> for safer, more prepared farms</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-lime-200/50 blur-2xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-[#EAF6EE] via-[#F5FAF5] to-[#D9EBDD] p-5 shadow-2xl shadow-emerald-950/10 sm:p-8">
            <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full border-[30px] border-white/30" aria-hidden="true" />
            <div className="relative rounded-3xl border border-white/80 bg-white/90 p-5 shadow-xl shadow-emerald-950/10 backdrop-blur sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#65736B]">Farm safety overview</p>
                  <h2 className="mt-1 text-xl font-extrabold text-[#17211B]">Your farm, prepared</h2>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF6EE] text-[#146B3A]">
                  <Sprout className="h-6 w-6" />
                </span>
              </div>

              <div className="mt-6 rounded-2xl bg-[#F4F8F5] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#65736B]">Kalaburagi district</p>
                    <p className="mt-1 text-2xl font-black text-[#17211B]">Weather watch</p>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <CloudRain className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#8A5A13]">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Stay informed. Be ready to act.
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#E8EEE9] p-4">
                  <ShieldCheck className="h-5 w-5 text-[#146B3A]" />
                  <p className="mt-3 text-xs font-semibold text-[#65736B]">Protection plan</p>
                  <p className="mt-1 font-extrabold text-[#17211B]">Step by step</p>
                </div>
                <div className="rounded-2xl border border-[#E8EEE9] p-4">
                  <Waves className="h-5 w-5 text-sky-700" />
                  <p className="mt-3 text-xs font-semibold text-[#65736B]">Farm resources</p>
                  <p className="mt-1 font-extrabold text-[#17211B]">All in one place</p>
                </div>
              </div>
            </div>
            <div className="relative mt-5 flex items-center gap-3 rounded-2xl bg-[#146B3A] px-4 py-3.5 text-white shadow-lg shadow-emerald-950/15">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Users className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-bold">Support for your whole farm</p>
                <p className="mt-0.5 text-xs text-emerald-100">Farmers and agriculture officers, connected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E8EEE9] bg-white/75">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#146B3A]">Preparedness starts here</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#17211B] sm:text-4xl">A trusted companion for every season</h2>
            <p className="mt-4 leading-7 text-[#65736B]">Make confident decisions with clear, local information and useful tools designed around the realities of farming.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-2xl border border-[#E8EEE9] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-950/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF6EE] text-[#146B3A]"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-5 text-lg font-extrabold text-[#17211B]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#65736B]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>

    <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-[#65736B] sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <span>© {new Date().getFullYear()} KisanRakshak Karnataka</span>
      <button type="button" onClick={onOpenAdminLogin} className="w-fit font-semibold hover:text-[#146B3A]">Agriculture officer sign in</button>
    </footer>
  </div>
);
