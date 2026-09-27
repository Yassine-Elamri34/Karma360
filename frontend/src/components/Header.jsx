import { UserRound, LogIn } from "lucide-react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">

      {/* Left side */}
      <div>
        <p className="text-sm text-slate-400">
          Karma360
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        <NavLink
          to="/login"
          className="
            flex h-10 items-center gap-2
            rounded-xl border border-slate-200
            bg-white px-3
            text-sm font-medium text-slate-600
            transition-all duration-200
            hover:scale-[1.03]
            hover:border-blue-200
            hover:bg-blue-50
            hover:text-blue-600
          "
        >
          <LogIn size={17} />

          <span>
            Login
          </span>
        </NavLink>

        <button
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full bg-slate-100
            text-slate-600
            transition-all duration-200
            hover:scale-105
            hover:bg-blue-100
            hover:text-blue-600
          "
        >
          <UserRound size={19} />
        </button>

      </div>

    </header>
  );
}

export default Header;