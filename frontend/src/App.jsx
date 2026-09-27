import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";

import Login from "./pages/Login.jsx";
import About from "./pages/About.jsx";

import Sales from "./pages/Sales.jsx";
import Expenses from "./pages/Expenses.jsx";
import Employees from "./pages/Employees.jsx";
import Schedule from "./pages/Schedule.jsx";


/* =========================
   PLACEHOLDER PAGE
========================= */

function PlaceholderPage({ title }) {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        This section of Karma360 will be built next.
      </p>
    </main>
  );
}


/* =========================
   MAIN KARMA360 LAYOUT
========================= */

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="min-w-0 flex-1">

        {/* Top header */}
        <Header />

        {/* Current page */}
        <Outlet />

      </div>

    </div>
  );
}


/* =========================
   APP ROUTES
========================= */

function App() {
  return (
    <Routes>

      {/* =========================
          PUBLIC PAGES
          No Sidebar / No Header
      ========================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/about"
        element={<About />}
      />


      {/* =========================
          KARMA360 APPLICATION
      ========================= */}

      <Route element={<AppLayout />}>

        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PlaceholderPage title="Dashboard" />
          }
        />

        {/* Business */}
        <Route
          path="/sales"
          element={<Sales />}
        />

        <Route
          path="/orders"
          element={
            <PlaceholderPage title="Orders" />
          }
        />

        <Route
          path="/products"
          element={
            <PlaceholderPage title="Products & Services" />
          }
        />

        <Route
          path="/inventory"
          element={
            <PlaceholderPage title="Inventory" />
          }
        />

        <Route
          path="/customers"
          element={
            <PlaceholderPage title="Customers" />
          }
        />

        <Route
          path="/invoices"
          element={
            <PlaceholderPage title="Invoices" />
          }
        />

        <Route
          path="/expenses"
          element={<Expenses />}
        />


        {/* Team */}
        <Route
          path="/employees"
          element={<Employees />}
        />

        <Route
          path="/schedule"
          element={<Schedule />}
        />


        {/* Intelligence */}
        <Route
          path="/suppliers"
          element={
            <PlaceholderPage title="Suppliers" />
          }
        />

        <Route
          path="/analytics"
          element={
            <PlaceholderPage title="Analytics" />
          }
        />

        <Route
          path="/forecast"
          element={
            <PlaceholderPage title="Forecast" />
          }
        />

        <Route
          path="/insights"
          element={
            <PlaceholderPage title="Insights" />
          }
        />


        {/* System */}
        <Route
          path="/settings"
          element={
            <PlaceholderPage title="Settings" />
          }
        />

      </Route>


      {/* =========================
          UNKNOWN URL
      ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;