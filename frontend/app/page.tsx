import Link from "next/link";

export default function Home() {
  return (
    <div className="relative overflow-hidden py-12 sm:py-16 md:py-24 fade-in-up">
      {/* Decorative background blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-indigo-200/20 dark:bg-indigo-950/10 blur-3xl -z-10"></div>
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-100 text-sm font-semibold text-violet-700">
          <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse"></span>
          ✨ Streamline Your Weekly Standups
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Supercharge your team's <span className="gradient-text">weekly reporting</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A clean, modern workspace for developers to write weekly updates and managers to monitor progress, compliance, and blockers in real-time.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link
            href="/register"
            className="w-full sm:w-auto btn-primary px-8 py-3.5 text-base"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto btn-secondary px-8 py-3.5 text-base flex items-center justify-center gap-2"
          >
            Sign In to Dashboard <span>→</span>
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="mt-24 sm:mt-32 max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Everything you need to stay in sync</h2>
          <p className="text-slate-500 mt-2">Ditch the messy Slack messages and coordinate reporting effortlessly</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl font-bold mb-6">
              📋
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive List Builder</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Easily record tasks completed, future goals, and current blockers using our dynamic input lists. No more formatting headaches.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card p-8 border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl font-bold mb-6">
              📊
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Real-time Visual Analytics</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Managers gain instant visibility with auto-generated charts displaying task trends, category distributions, and outstanding blockers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card p-8 border border-slate-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl font-bold mb-6">
              👑
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Compliance Tracking</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
              Identify which team members have completed their reports and who needs a reminder, helping your team hit deadlines consistently.
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Sub-text */}
      <div className="mt-24 sm:mt-32 text-center border-t border-slate-200/60 pt-8 max-w-5xl mx-auto">
        <p className="text-xs text-slate-400">
          Built with Next.js, Tailwind CSS v4, Express, and MongoDB. Professional & Secure.
        </p>
      </div>
    </div>
  );
}
