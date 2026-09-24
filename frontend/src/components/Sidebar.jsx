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
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
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
    {
      name: "Employees",
      icon: UserRoundCog,
      path: "/employees",
    },
     {
      name: "schedule",
      icon: CalendarClock,
      path: "/schedule",
    },
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
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="sticky top-0 h-screen w-64 flex-shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-3 py-5">
      
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
          <BarChart3 size={25} />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Karma360
          </h1>

          <p className="text-[10px] text-slate-400">
            Manage. Analyze. Grow.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                flex min-h-11 w-full items-center gap-3 rounded-lg px-4
                py-3 text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                }
                `
              }
            >
              <Icon size={20} strokeWidth={1.8} />

              <span>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;