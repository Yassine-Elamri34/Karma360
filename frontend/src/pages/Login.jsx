import { Link } from "react-router-dom";
import {
  BarChart3,
  Mail,
  LockKeyhole,
  ArrowRight,
  TrendingUp,
  WalletCards,
  Users,
  CalendarClock,
  Package,
  BrainCircuit,
} from "lucide-react";

function Login() {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

      {/* LEFT SIDE - KARMA360 EXPLANATION */}
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">

        {/* Background glow */}
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />

        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative z-10">

          {/* Brand */}
          <div className="mb-16 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600">
              <BarChart3 size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Karma<span className="text-teal-400">360</span>
              </h1>

              <p className="text-xs text-slate-400">
                Manage. Analyze. Grow.
              </p>
            </div>

          </div>

          {/* Main message */}
          <div className="max-w-xl">

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-teal-400">
              Business Intelligence for SMBs
            </p>

            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              Understand your entire business from one place.
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-300">
              Karma360 is a business management and intelligence platform
              designed for small and medium businesses. It brings your sales,
              expenses, employees, scheduling and operational data together
              so you can understand how your business is really performing.
            </p>

          </div>

          {/* Features */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">

            <Feature
              icon={TrendingUp}
              title="Sales Tracking"
              text="Monitor revenue, trends and performance."
            />

            <Feature
              icon={WalletCards}
              title="Expense Management"
              text="Understand where your business money goes."
            />

            <Feature
              icon={Users}
              title="Employee Management"
              text="Manage your team and payroll information."
            />

            <Feature
              icon={CalendarClock}
              title="Team Scheduling"
              text="Plan shifts and monitor labour costs."
            />

            <Feature
              icon={Package}
              title="Business Operations"
              text="Manage inventory, orders and suppliers."
            />

            <Feature
              icon={BrainCircuit}
              title="BI Insights"
              text="Turn business data into useful decisions."
            />

          </div>

        </div>

        {/* Bottom message */}
        <div className="relative z-10 mt-10">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

            <p className="text-sm font-semibold text-white">
              The idea behind Karma360
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Business owners should not need advanced Excel, Power BI or
              accounting knowledge just to understand whether their business
              is growing, losing money or spending too much.
            </p>

          </div>

        </div>

      </section>


      {/* RIGHT SIDE - LOGIN */}
      <section className="flex min-h-screen items-center justify-center p-6 sm:p-10">

        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
              <BarChart3 size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Karma<span className="text-teal-600">360</span>
              </h1>

              <p className="text-xs text-slate-400">
                Manage. Analyze. Grow.
              </p>
            </div>

          </div>

          <div className="mb-8">

            <p className="mb-2 text-sm font-semibold text-blue-600">
              Welcome back
            </p>

            <h2 className="text-3xl font-bold text-slate-900">
              Sign in to Karma360
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Access your business dashboard, analytics and management tools.
            </p>
            <Link
  to="/about"
  className="
    mt-4 inline-flex items-center gap-2
    text-sm font-semibold text-teal-600
    transition-all
    hover:gap-3
    hover:text-teal-700
  "
>
  Discover Karma360
  <ArrowRight size={15} />
</Link>

          </div>

          <form className="space-y-5">

            {/* Email */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="email"
                  placeholder="you@business.com"
                  className="
                    h-12 w-full rounded-xl
                    border border-slate-200 bg-white
                    pl-10 pr-4 text-sm
                    outline-none transition
                    focus:border-blue-500
                    focus:ring-4 focus:ring-blue-50
                  "
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>

              </div>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="
                    h-12 w-full rounded-xl
                    border border-slate-200 bg-white
                    pl-10 pr-4 text-sm
                    outline-none transition
                    focus:border-blue-500
                    focus:ring-4 focus:ring-blue-50
                  "
                />

              </div>

            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-slate-600">

              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300"
              />

              Remember me

            </label>

            {/* Login */}
            <button
              type="submit"
              className="
                flex h-12 w-full items-center justify-center gap-2
                rounded-xl bg-blue-600
                text-sm font-semibold text-white
                shadow-sm transition-all
                hover:scale-[1.015]
                hover:bg-blue-700
              "
            >
              Sign In
              <ArrowRight size={17} />
            </button>

          </form>

          {/* Register */}
          <div className="mt-8 border-t border-slate-200 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Don't have a Karma360 account?
            </p>

            <button
              className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-800"
            >
              Create your business account
            </button>

          </div>

          {/* Back */}
          <div className="mt-8 text-center">

            <Link
              to="/dashboard"
              className="text-xs font-medium text-slate-400 hover:text-slate-700"
            >
              ← Back to Karma360
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}


function Feature({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">

      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-teal-300">
        <Icon size={18} />
      </div>

      <p className="text-sm font-semibold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        {text}
      </p>

    </div>
  );
}

export default Login;