import React from 'react';
import Layout from '../../components/Layout/Layout';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, BookOpen, Calculator, CheckCircle, Search, Utensils, Zap, Flame } from 'lucide-react';

const HEALTH_TIPS = [
  {
    category: 'Nutrition',
    title: 'Why Protein is the King of Macros',
    excerpt: 'High protein intake boosts metabolism, reduces appetite and changes several weight-regulating hormones.',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    readTime: '4 min read',
  },
  {
    category: 'Fitness',
    title: 'Calorie Deficit: The Only Rule for Fat Loss',
    excerpt: 'Understanding energy balance is the foundation of every successful fat loss journey, regardless of the diet you follow.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    readTime: '3 min read',
  },
  {
    category: 'Habit',
    title: 'Tracking Your Food Actually Works — Here\'s Why',
    excerpt: 'Studies show that people who log their meals consistently lose twice as much weight as those who don\'t.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    readTime: '5 min read',
  },
];

const FEATURES = [
  {
    icon: Calculator,
    title: 'Smart Calorie Calculator',
    description: 'Input your stats and get a science-backed daily calorie goal using the Mifflin-St Jeor formula.',
    color: 'text-violet-400',
    bg: 'bg-violet-400/10 border-violet-400/20',
    link: '/caloriecalculator',
  },
  {
    icon: Utensils,
    title: 'Food Diary',
    description: 'Search from hundreds of foods and log your meals with one click. Macros calculated automatically.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/20',
    link: '/track',
  },
  {
    icon: BarChart2,
    title: 'Progress History',
    description: 'View your calorie intake history day by day. See trends and stay accountable over time.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10 border-amber-400/20',
    link: '/history',
  },
  {
    icon: Zap,
    title: 'Activity & Burn',
    description: 'Log workouts, track calories burnt, and monitor water intake to see your full energy balance.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10 border-orange-400/20',
    link: '/burn',
  },
  {
    icon: Search,
    title: 'Recipe Discovery',
    description: 'Search thousands of healthy recipes to keep your meals interesting while hitting your goals.',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10 border-rose-400/20',
    link: '/recipes',
  },
];

const STEPS = [
  { step: '01', title: 'Set your goal', desc: 'Calculate your daily calorie needs based on your body stats and activity level.' },
  { step: '02', title: 'Log your meals', desc: 'Search and add food items throughout the day. Track every meal effortlessly.' },
  { step: '03', title: 'Stay consistent', desc: 'Review your daily progress and history to build sustainable healthy habits.' },
];

const STATS = [
  { value: '500+', label: 'Food items in database' },
  { value: 'Free', label: 'No subscription needed' },
  { value: '100%', label: 'Science-backed formulas' },
  { value: 'Daily', label: 'Calorie & macro tracking' },
];

function Home() {
  return (
    <Layout>
      <main className="min-h-screen">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden pt-20 pb-24 px-4">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Smart nutrition tracking made simple
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6 animate-fade-in-up delay-100">
              Eat with{' '}
              <span className="text-shimmer">
                intention.
              </span>
              <br />
              Live with purpose.
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
              Track calories, log meals, and monitor your macros — all in one clean, minimal app. No guesswork, just progress.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up delay-300">
              <Link
                to="/caloriecalculator"
                className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-7 py-3.5 rounded-xl transition-all active:scale-[0.98] text-sm"
              >
                Calculate My Calories
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-7 py-3.5 rounded-xl transition-all text-sm border border-zinc-700"
              >
                <Utensils className="w-4 h-4" />
                Log Today's Food
              </Link>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ── */}
        <section className="border-y border-zinc-800/60 bg-zinc-900/40">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STATS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black text-emerald-400">{value}</p>
                  <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section className="max-w-6xl mx-auto px-4 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Everything you need</h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">Nutrify gives you the tools to take control of your nutrition without the overwhelm.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {FEATURES.map(({ icon: Icon, title, description, color, bg, link }) => (
              <Link
                key={title}
                to={link}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 hover:bg-zinc-800/60 transition-all"
              >
                <div className={`w-10 h-10 ${bg} border rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-emerald-400 transition-colors">{title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="bg-zinc-900/40 border-y border-zinc-800/60 py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How it works</h2>
              <p className="text-zinc-400 text-lg">Three simple steps to start your journey</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {STEPS.map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <span className="text-emerald-400 font-black text-lg">{step}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NUTRITION TIPS / BLOG PREVIEW ── */}
        <section className="max-w-6xl mx-auto px-4 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Learn & grow</h2>
              <p className="text-zinc-400">Evidence-based nutrition tips to fuel your journey</p>
            </div>
            <Link to="/blogs" className="hidden sm:flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              All articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HEALTH_TIPS.map((tip) => (
              <article key={tip.title} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all">
                <div className="h-44 overflow-hidden">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                      {tip.category}
                    </span>
                    <span className="text-xs text-zinc-600">{tip.readTime}</span>
                  </div>
                  <h3 className="text-white font-semibold leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                    {tip.title}
                  </h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{tip.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── CTA SECTION ── */}
        <section className="max-w-4xl mx-auto px-4 pb-24">
          <div className="bg-gradient-to-br from-emerald-950/60 to-zinc-900 border border-emerald-500/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent)] pointer-events-none" />
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Start tracking today
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-lg mx-auto">
                Join others who have taken control of their nutrition. It's free, fast, and built around you.
              </p>
              <Link
                to="/caloriecalculator"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-8 py-3.5 rounded-xl transition-all text-sm"
              >
                Get Started — It's Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-zinc-800/60 py-8 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
                <Zap className="w-3 h-3 text-black fill-black" />
              </div>
              <span className="text-sm font-bold text-white">Nutrify</span>
            </div>
            <p className="text-xs text-zinc-600">Built to help you live healthier, one meal at a time.</p>
            <div className="flex items-center gap-4">
              <Link to="/blogs" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Blog</Link>
              <Link to="/recipes" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Recipes</Link>
            </div>
          </div>
        </footer>

      </main>
    </Layout>
  );
}

export default Home;
