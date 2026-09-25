import { NavLink } from "react-router-dom";

function Logo() {
  return (
    <NavLink
      to="/dashboard"
      className="group flex items-center gap-3 px-3 py-2"
    >
      {/* LOGO ICON */}
      <div
        className="
          relative flex h-11 w-11 items-center justify-center
          overflow-hidden rounded-xl bg-teal-600
          shadow-sm
          transition-all duration-500
          group-hover:scale-110
          group-hover:rotate-3
          group-hover:shadow-lg
          group-hover:shadow-teal-200
        "
      >
        {/* subtle background circle */}
        <div
          className="
            absolute h-16 w-16 rounded-full
            border border-white/20
            transition-all duration-700
            group-hover:scale-150
            group-hover:opacity-0
          "
        />

        {/* CHART */}
        <div className="relative flex h-6 items-end gap-[3px]">

          {/* BAR 1 */}
          <div
            className="
              h-2 w-[4px] rounded-sm bg-white
              transition-all duration-500
              group-hover:h-4
            "
          />

          {/* BAR 2 */}
          <div
            className="
              h-4 w-[4px] rounded-sm bg-white
              transition-all duration-500
              delay-75
              group-hover:h-6
            "
          />

          {/* BAR 3 */}
          <div
            className="
              h-3 w-[4px] rounded-sm bg-white
              transition-all duration-500
              delay-150
              group-hover:h-5
            "
          />

          {/* BAR 4 */}
          <div
            className="
              h-5 w-[4px] rounded-sm bg-white
              transition-all duration-500
              delay-200
              group-hover:h-3
            "
          />

        </div>

        {/* SMALL MOVING DOT */}
        <div
          className="
            absolute right-2 top-2
            h-1.5 w-1.5 rounded-full bg-emerald-200
            opacity-0
            transition-all duration-500
            group-hover:translate-x-1
            group-hover:-translate-y-1
            group-hover:opacity-100
          "
        />
      </div>

      {/* BRAND NAME */}
      <div className="min-w-0">

        <div className="flex items-center">
          <h1
            className="
              text-xl font-bold tracking-tight text-slate-900
              transition-colors duration-300
              group-hover:text-teal-600
            "
          >
            Karma
          </h1>

          <span
            className="
              text-xl font-bold text-teal-600
              transition-all duration-300
              group-hover:translate-x-0.5
            "
          >
            360
          </span>
        </div>

        <p
          className="
            text-[10px] font-medium tracking-wide text-slate-400
            transition-all duration-300
            group-hover:tracking-wider
            group-hover:text-slate-500
          "
        >
          Manage. Analyze. Grow.
        </p>

      </div>
    </NavLink>
  );
}

export default Logo;