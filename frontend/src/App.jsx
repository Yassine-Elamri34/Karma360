import { Routes, Route, Navigate } from "react-router-dom";

import Employees from "./pages/Employees.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Sales from "./pages/Sales.jsx";
import Expenses from "./pages/Expenses.jsx";


function PlaceholderPage({ title }) {
  return (
    <main className="min-h-screen flex-1 bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-2 text-slate-500">
        This section of Karma360 will be built next.
      </p>
    </main>
  );
}

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<PlaceholderPage title="Dashboard" />}
          />

          <Route
            path="/sales"
            element={<Sales />}
          />

          <Route
            path="/orders"
            element={<PlaceholderPage title="Orders" />}
          />

          <Route
            path="/products"
            element={<PlaceholderPage title="Products & Services" />}
          />

          <Route
            path="/inventory"
            element={<PlaceholderPage title="Inventory" />}
          />

          <Route
            path="/customers"
            element={<PlaceholderPage title="Customers" />}
          />

          <Route
            path="/invoices"
            element={<PlaceholderPage title="Invoices" />}
          />

          <Route
  path="/expenses"
  element={<Expenses />}
/>

         <Route
  path="/employees"
  element={<Employees />}
/>
   <Route
            path="/schedule"
            element={<PlaceholderPage title="Schedule" />}
          />
          <Route
            path="/suppliers"
            element={<PlaceholderPage title="Suppliers" />}
          />

          <Route
            path="/analytics"
            element={<PlaceholderPage title="Analytics" />}
          />

          <Route
            path="/forecast"
            element={<PlaceholderPage title="Forecast" />}
          />

          <Route
            path="/insights"
            element={<PlaceholderPage title="Insights" />}
          />

          <Route
            path="/settings"
            element={<PlaceholderPage title="Settings" />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;