import { NavLink } from "react-router-dom";

function Logo() {
  return (
    <NavLink
      to="/dashboard"
      className="group flex items-center gap-3 px-3 py-2"
    >
      {/* LOGO ICON */}
      <div className="karma-logo relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-100">

        {/* MOVING GLOW */}
        <div className="karma-glow absolute inset-0" />

        {/* ROTATING RING */}
        <div className="karma-ring absolute h-9 w-9 rounded-full border border-dashed border-white/30" />

        {/* CHART BARS */}
        <div className="relative z-10 flex h-7 items-end gap-[3px]">

          <span className="karma-bar karma-bar-1 w-[4px] rounded-full bg-white" />

          <span className="karma-bar karma-bar-2 w-[4px] rounded-full bg-white" />

          <span className="karma-bar karma-bar-3 w-[4px] rounded-full bg-white" />

          <span className="karma-bar karma-bar-4 w-[4px] rounded-full bg-white" />

        </div>

        {/* ORBITING DATA POINT */}
        <div className="karma-orbit absolute inset-0 z-20">
          <span className="absolute left-1/2 top-[-2px] h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-200 shadow-md shadow-emerald-200" />
        </div>

      </div>

      {/* TEXT */}
      <div className="min-w-0">

        <div className="flex items-center">

          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            Karma
          </h1>

          <span className="karma-360 ml-[2px] text-xl font-extrabold">
            360
          </span>

        </div>

        <div className="mt-[1px] flex items-center gap-1.5">

          {/* LIVE DOT */}
          <span className="karma-live-dot h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <p className="text-[9px] font-medium tracking-wide text-slate-400">
            Manage. Analyze. Grow.
          </p>

        </div>

      </div>
    </NavLink>
  );
}

export default Logo;