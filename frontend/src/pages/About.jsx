import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  TrendingUp,
  WalletCards,
  Users,
  CalendarClock,
  BrainCircuit,
  DollarSign,
  Sparkles,
  Activity,
} from "lucide-react";

function About() {
  const storyRef = useRef(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!storyRef.current) return;

      const element = storyRef.current;

      const rect = element.getBoundingClientRect();

      const scrollableHeight =
        element.offsetHeight - window.innerHeight;

      const amountScrolled = -rect.top;

      const newProgress =
        scrollableHeight > 0
          ? amountScrolled / scrollableHeight
          : 0;

      setProgress(
        Math.min(Math.max(newProgress, 0), 1)
      );
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const revenue =
    Math.round(18420 * progress);

  const expenses =
    Math.round(12360 * progress);

  const profit =
    revenue - expenses;

  const margin =
    revenue > 0
      ? ((profit / revenue) * 100).toFixed(1)
      : "0.0";

  let stage = 0;

  if (progress > 0.25) stage = 1;
  if (progress > 0.5) stage = 2;
  if (progress > 0.75) stage = 3;

  const stages = [
    {
      title: "Every business starts with activity.",
      description:
        "Sales happen. Bills arrive. Employees work. Inventory moves. But the information often lives in different places.",
    },

    {
      title: "Karma360 brings the business together.",
      description:
        "Revenue, expenses, employees, schedules, inventory and operations become part of one connected system.",
    },

    {
      title: "Your data becomes intelligence.",
      description:
        "Karma360 transforms everyday activity into KPIs, trends, profit margins and performance analysis.",
    },

    {
      title: "Now you understand your business.",
      description:
        "Instead of looking at disconnected numbers, you get a complete 360° view of what is happening and where the business is heading.",
    },
  ];

  return (
    <div className="bg-white text-slate-900">

      {/* ============================
          HERO
      ============================ */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">

        {/* Background effects */}

        <div className="absolute left-[-150px] top-[-150px] h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-100px] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">

          {/* Logo */}

          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 shadow-2xl shadow-teal-500/20">

            <BarChart3 size={30} />

          </div>

          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-teal-400">
            Introducing Karma360
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">

            Your business.

            <br />

            <span className="bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Finally understood.
            </span>

          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-400">

            Karma360 transforms everyday business
            activity into meaningful intelligence —
            helping small and medium businesses
            manage, understand and grow.

          </p>

          <div className="mt-10 flex justify-center">

            <div className="animate-bounce text-sm text-slate-500">

              Scroll to discover

              <div className="mx-auto mt-3 h-10 w-[1px] bg-gradient-to-b from-slate-500 to-transparent" />

            </div>

          </div>

        </div>

      </section>


      {/* ============================
          INTRODUCTION
      ============================ */}

      <section className="px-6 py-32">

        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            The Problem
          </p>

          <h2 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">

            Running a business creates
            thousands of numbers.

            <span className="text-slate-400">
              {" "}Understanding them should not be difficult.
            </span>

          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-500">

            Sales records, employee costs,
            rent, utilities, inventory,
            schedules and customer activity
            often exist separately.

            Karma360 connects them.

          </p>

        </div>

      </section>


      {/* ============================
          APPLE-STYLE SCROLL STORY
      ============================ */}

      <section
        ref={storyRef}
        className="relative h-[420vh] bg-slate-950 text-white"
      >

        {/* STICKY SCREEN */}

        <div className="sticky top-0 flex min-h-screen items-center overflow-hidden px-5 py-10 lg:px-12">

          <div className="mx-auto grid w-full max-w-[1500px] items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">


            {/* LEFT TEXT */}

            <div>

              <div className="mb-6 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-teal-400" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Step {stage + 1} of 4
                </p>

              </div>

              <h2
                key={stage}
                className="animate-[fadeIn_.6s_ease] text-4xl font-bold leading-tight lg:text-5xl"
              >

                {stages[stage].title}

              </h2>

              <p
                key={`${stage}-description`}
                className="mt-6 max-w-lg text-lg leading-8 text-slate-400"
              >

                {stages[stage].description}

              </p>


              {/* Progress */}

              <div className="mt-10">

                <div className="mb-2 flex justify-between text-xs text-slate-500">

                  <span>
                    Business Data
                  </span>

                  <span>
                    Intelligence
                  </span>

                </div>

                <div className="h-1 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-blue-500 transition-all duration-200"
                    style={{
                      width: `${progress * 100}%`,
                    }}
                  />

                </div>

              </div>

            </div>


            {/* RIGHT VISUAL */}

            <div className="relative">

              {/* Glow */}

              <div
                className="absolute inset-10 rounded-full bg-blue-500/10 blur-[100px]"
                style={{
                  opacity:
                    0.3 + progress * 0.7,
                }}
              />

              {/* DASHBOARD */}

              <div
                className="
                  relative overflow-hidden
                  rounded-[28px]
                  border border-white/10
                  bg-slate-900/80
                  shadow-2xl
                  backdrop-blur-xl
                  transition-all duration-500
                "
                style={{
                  transform: `
                    scale(${0.9 + progress * 0.1})
                    translateY(${20 - progress * 20}px)
                  `,
                }}
              >

                {/* Dashboard top */}

                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">

                      <BarChart3 size={18} />

                    </div>

                    <div>

                      <p className="text-sm font-bold">
                        Karma360
                      </p>

                      <p className="text-[9px] text-slate-500">
                        Business Intelligence
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                    <span className="text-xs text-slate-400">
                      Live data
                    </span>

                  </div>

                </div>


                {/* BODY */}

                <div className="p-5">

                  {/* KPI */}

                  <div className="grid grid-cols-3 gap-3">

                    <DashboardCard
                      title="Revenue"
                      value={`$${revenue.toLocaleString()}`}
                      icon={DollarSign}
                      visible={progress > 0.15}
                    />

                    <DashboardCard
                      title="Expenses"
                      value={`$${expenses.toLocaleString()}`}
                      icon={WalletCards}
                      visible={progress > 0.3}
                    />

                    <DashboardCard
                      title="Net Profit"
                      value={`$${profit.toLocaleString()}`}
                      icon={TrendingUp}
                      visible={progress > 0.45}
                    />

                  </div>


                  {/* CHART */}

                  <div
                    className={`
                      mt-4 rounded-2xl
                      border border-white/10
                      bg-slate-950/50
                      p-5
                      transition-all duration-700

                      ${
                        progress > 0.4
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-20"
                      }
                    `}
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <p className="text-sm font-semibold">
                          Business Performance
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Revenue & profitability
                        </p>

                      </div>

                      <Activity
                        size={18}
                        className="text-teal-400"
                      />

                    </div>


                    {/* Fake animated graph */}

                    <div className="mt-8 flex h-36 items-end gap-2">

                      {[
                        30,
                        42,
                        38,
                        55,
                        50,
                        66,
                        61,
                        78,
                        72,
                        92,
                      ].map(
                        (height, index) => (

                          <div
                            key={index}
                            className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600 to-teal-400 transition-all duration-700"
                            style={{
                              height:
                                progress > 0.45
                                  ? `${height}%`
                                  : "4%",
                              transitionDelay: `${
                                index * 60
                              }ms`,
                            }}
                          />

                        )
                      )}

                    </div>

                  </div>


                  {/* BOTTOM INFO */}

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div
                      className={`
                        rounded-2xl border border-white/10
                        bg-slate-950/50 p-4
                        transition-all duration-700

                        ${
                          progress > 0.6
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-8 opacity-0"
                        }
                      `}
                    >

                      <div className="mb-3 flex items-center gap-2">

                        <Users
                          size={16}
                          className="text-blue-400"
                        />

                        <span className="text-xs font-semibold">
                          Workforce
                        </span>

                      </div>

                      <p className="text-xl font-bold">
                        24
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        Active employees
                      </p>

                    </div>


                    <div
                      className={`
                        rounded-2xl border border-white/10
                        bg-slate-950/50 p-4
                        transition-all duration-700

                        ${
                          progress > 0.68
                            ? "translate-x-0 opacity-100"
                            : "translate-x-8 opacity-0"
                        }
                      `}
                    >

                      <div className="mb-3 flex items-center gap-2">

                        <CalendarClock
                          size={16}
                          className="text-violet-400"
                        />

                        <span className="text-xs font-semibold">
                          Scheduled
                        </span>

                      </div>

                      <p className="text-xl font-bold">
                        812 hrs
                      </p>

                      <p className="mt-1 text-[10px] text-slate-500">
                        This month
                      </p>

                    </div>

                  </div>


                  {/* FINAL BI INSIGHT */}

                  <div
                    className={`
                      mt-4 overflow-hidden rounded-2xl
                      border border-teal-500/20
                      bg-gradient-to-r
                      from-teal-500/10
                      to-blue-500/10
                      transition-all duration-1000

                      ${
                        progress > 0.8
                          ? "max-h-40 translate-y-0 p-4 opacity-100"
                          : "max-h-0 translate-y-8 p-0 opacity-0"
                      }
                    `}
                  >

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">

                        <Sparkles size={17} />

                      </div>

                      <div>

                        <p className="text-sm font-bold">
                          Karma Insight
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">

                          Revenue is growing faster
                          than operating costs.
                          Your current estimated
                          net margin is{" "}

                          <span className="font-bold text-emerald-400">
                            {margin}%
                          </span>.

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ============================
          FEATURES
      ============================ */}

      <section className="px-6 py-32">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-600">
              One platform
            </p>

            <h2 className="mt-5 text-4xl font-bold sm:text-5xl">

              Everything connects.

            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-500">

              Every part of Karma360 contributes
              to the bigger picture of your
              business.

            </p>

          </div>


          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon={TrendingUp}
              title="Sales"
              description="Track revenue and understand business growth."
            />

            <FeatureCard
              icon={WalletCards}
              title="Expenses"
              description="See exactly where the business is spending money."
            />

            <FeatureCard
              icon={Users}
              title="Employees"
              description="Manage workforce information and payroll costs."
            />

            <FeatureCard
              icon={CalendarClock}
              title="Scheduling"
              description="Plan employee shifts and understand labour costs."
            />

            <FeatureCard
              icon={BarChart3}
              title="Analytics"
              description="Transform operational data into meaningful KPIs."
            />

            <FeatureCard
              icon={BrainCircuit}
              title="Smart Insights"
              description="Surface important business patterns automatically."
            />

          </div>

        </div>

      </section>


      {/* ============================
          FINAL
      ============================ */}

      <section className="relative overflow-hidden bg-slate-950 px-6 py-32 text-white">

        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">

          <Sparkles
            size={32}
            className="mx-auto mb-7 text-teal-400"
          />

          <h2 className="text-4xl font-bold sm:text-6xl">

            Don't just manage your business.

            <br />

            <span className="text-teal-400">
              Understand it.
            </span>

          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">

            Karma360 gives growing businesses
            the visibility they need to make
            smarter decisions.

          </p>


          <div className="mt-10 flex flex-wrap justify-center gap-3">

            <Link
              to="/login"
              className="flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-slate-900 transition hover:scale-105"
            >

              Sign In

              <ArrowRight size={17} />

            </Link>

            <Link
              to="/dashboard"
              className="flex h-12 items-center gap-2 rounded-xl border border-white/10 px-6 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
            >

              Explore Karma360

            </Link>

          </div>

        </div>

      </section>


      {/* BACK */}

      <div className="bg-slate-950 pb-10 text-center">

        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
        >

          <ArrowLeft size={15} />

          Back to login

        </Link>

      </div>

    </div>
  );
}


function DashboardCard({
  title,
  value,
  icon: Icon,
  visible,
}) {
  return (
    <div
      className={`
        rounded-2xl
        border border-white/10
        bg-slate-950/50
        p-4
        transition-all duration-700

        ${
          visible
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-20"
        }
      `}
    >

      <Icon
        size={16}
        className="mb-3 text-teal-400"
      />

      <p className="text-[10px] uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-lg font-bold">
        {value}
      </p>

    </div>
  );
}


function FeatureCard({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-blue-50 group-hover:text-blue-600">

        <Icon size={21} />

      </div>

      <h3 className="mt-5 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
}


export default About;