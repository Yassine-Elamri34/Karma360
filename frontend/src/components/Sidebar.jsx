import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  BadgeDollarSign,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  ReceiptText,
  WalletCards,
  UserRoundCog,
  CalendarClock,
  Truck,
  BarChart3,
  TrendingUp,
  Lightbulb,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Sparkles,
} from "lucide-react";

import Logo from "./Logo.jsx";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [
    {
      title: "Overview",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard",
        },
      ],
    },

    {
      title: "Business",
      items: [
        {
          name: "Sales",
          icon: BadgeDollarSign,
          path: "/sales",
        },
        {
          name: "Orders",
          icon: ShoppingCart,
          path: "/orders",
        },
        {
          name: "Products & Services",
          icon: Package,
          path: "/products",
        },
        {
          name: "Inventory",
          icon: Boxes,
          path: "/inventory",
        },
        {
          name: "Customers",
          icon: Users,
          path: "/customers",
        },
        {
          name: "Invoices",
          icon: ReceiptText,
          path: "/invoices",
        },
        {
          name: "Expenses",
          icon: WalletCards,
          path: "/expenses",
        },
      ],
    },

    {
      title: "Team",
      items: [
        {
          name: "Employees",
          icon: UserRoundCog,
          path: "/employees",
        },
        {
          name: "Schedule",
          icon: CalendarClock,
          path: "/schedule",
        },
      ],
    },

    {
      title: "Intelligence",
      items: [
        {
          name: "Suppliers",
          icon: Truck,
          path: "/suppliers",
        },
        {
          name: "Analytics",
          icon: BarChart3,
          path: "/analytics",
        },
        {
          name: "Forecast",
          icon: TrendingUp,
          path: "/forecast",
        },
        {
          name: "Insights",
          icon: Lightbulb,
          path: "/insights",
          special: true,
        },
      ],
    },

    {
      title: "System",
      items: [
        {
          name: "Settings",
          icon: Settings,
          path: "/settings",
        },
      ],
    },
  ];

  return (
    <aside
      className={`
        sticky top-0 h-screen flex-shrink-0
        border-r border-slate-200/70
        bg-gradient-to-b from-white via-white to-slate-50
        transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      <div className="flex h-full flex-col">

        {/* TOP */}
        <div className="border-b border-slate-100 px-3 pb-4 pt-4">

          {!collapsed ? (
            <Logo />
          ) : (
            <NavLink
              to="/dashboard"
              className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white shadow-lg shadow-teal-100"
            >
              <BarChart3 size={22} />
            </NavLink>
          )}

          {/* Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              mt-3 flex h-9 items-center justify-center
              rounded-xl border border-slate-200
              bg-white text-slate-400
              transition
              hover:border-slate-300
              hover:bg-slate-50
              hover:text-slate-700
              ${collapsed ? "mx-auto w-11" : "w-full"}
            `}
          >
            {collapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <>
                <PanelLeftClose size={16} />
                <span className="ml-2 text-xs font-medium">
                  Collapse sidebar
                </span>
              </>
            )}
          </button>

        </div>

        

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">

          {sections.map((section) => (
            <div
              key={section.title}
              className="mb-5"
            >

              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">

                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      title={
                        collapsed
                          ? item.name
                          : undefined
                      }
                      className={({ isActive }) =>
  `
  group relative flex min-h-11
  items-center rounded-xl
  transition-all duration-200
  hover:scale-[1.025]

  ${
    collapsed
      ? "justify-center px-2"
      : "gap-3 px-3"
  }

  ${
    isActive
      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
      : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
  }
  `
}
                    >
                      {({ isActive }) => (
                        <>
                          {/* active rail */}
                          {isActive && (
                            <span className="absolute left-0 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                          )}

                          {/* icon */}
                          <div
                            className={`
                              flex h-8 w-8 flex-shrink-0
                              items-center justify-center
                              rounded-lg
                              transition-all duration-200

                              ${
                                isActive
                                  ? "bg-white text-blue-600 shadow-sm"
                                  : "text-slate-500 group-hover:bg-slate-100 group-hover:text-blue-600"
                              }
                            `}
                          >
                            <Icon
                              size={17}
                              strokeWidth={1.8}
                            />
                          </div>

                          {!collapsed && (
                            <>
                              <span className="flex-1 text-sm font-medium">
                                {item.name}
                              </span>

                              {item.special && (
                                <span className="flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-[9px] font-bold text-violet-600">
                                  <Sparkles size={10} />
                                  SMART
                                </span>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}

              </div>

            </div>
          ))}

        </div>

        {/* BOTTOM */}
        {!collapsed && (
          <div className="border-t border-slate-100 p-3">

            <div
              className="
                relative overflow-hidden
                rounded-2xl
                border border-indigo-100
                bg-gradient-to-br
                from-indigo-50
                via-blue-50
                to-teal-50
                p-4
              "
            >
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-200/20" />

              <div className="relative">

                <div className="mb-2 flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                    <Sparkles size={16} />
                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    Karma Intelligence
                  </p>

                </div>

                <p className="text-[11px] leading-4 text-slate-500">
                  Business insights generated from your
                  sales, expenses and workforce data.
                </p>

                <NavLink
                  to="/insights"
                  className="mt-3 inline-flex text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  View insights →
                </NavLink>

              </div>
            </div>

          </div>
        )}

      </div>
    </aside>
  );
}

export default Sidebar;