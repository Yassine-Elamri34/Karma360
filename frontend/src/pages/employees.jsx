import { useEffect, useMemo, useState } from "react";

import {
  Users,
  UserPlus,
  Search,
  BriefcaseBusiness,
  DollarSign,
  Building2,
  UserCheck,
  Pencil,
  Trash2,
  X,
  Save,
  Mail,
  Phone,
} from "lucide-react";

const STORAGE_KEY = "karma360_employees";

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const departments = [
  "Executive & Management",
  "Technology",
  "Sales",
  "Marketing",
  "Operations",
  "Finance & Administration",
  "Customer Support",
];

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contractor",
  "Intern",
];

const employeeStatuses = [
  "Active",
  "On Leave",
  "Inactive",
];

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function createEmptyForm() {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sinLast4: "",

    department: "Technology",
    jobTitle: "",

    employmentType: "Full-time",
    status: "Active",

    payType: "Salary",
    annualSalary: "",
    hourlyRate: "",
    hoursPerWeek: "40",

    startDate: getToday(),

    manager: "",

    emergencyContactName: "",
    emergencyContactPhone: "",
  };
}

function safeReadStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function calculateMonthlyCost(employee) {
  if (employee.payType === "Salary") {
    return Number(employee.annualSalary || 0) / 12;
  }

  const hourlyRate = Number(employee.hourlyRate || 0);
  const hoursPerWeek = Number(employee.hoursPerWeek || 0);

  return (hourlyRate * hoursPerWeek * 52) / 12;
}

function Employees() {
  const [employees, setEmployees] = useState(safeReadStorage);

  const [form, setForm] = useState(createEmptyForm());

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(employees)
    );
  }, [employees]);

  const activeEmployees = useMemo(() => {
    return employees.filter(
      (employee) => employee.status === "Active"
    ).length;
  }, [employees]);

  const monthlyPayroll = useMemo(() => {
    return employees
      .filter(
        (employee) => employee.status === "Active"
      )
      .reduce(
        (total, employee) =>
          total + calculateMonthlyCost(employee),
        0
      );
  }, [employees]);

  const fullTimeEmployees = useMemo(() => {
    return employees.filter(
      (employee) =>
        employee.employmentType === "Full-time"
    ).length;
  }, [employees]);

  const departmentSummary = useMemo(() => {
    return departments.map((department) => {
      const count = employees.filter(
        (employee) =>
          employee.department === department &&
          employee.status === "Active"
      ).length;

      return {
        department,
        count,
      };
    });
  }, [employees]);

  const largestDepartment = useMemo(() => {
    if (!departmentSummary.length) {
      return null;
    }

    return [...departmentSummary].sort(
      (a, b) => b.count - a.count
    )[0];
  }, [departmentSummary]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const query = search.toLowerCase();

      const matchesSearch =
        employee.firstName
          .toLowerCase()
          .includes(query) ||
        employee.lastName
          .toLowerCase()
          .includes(query) ||
        employee.email
          .toLowerCase()
          .includes(query) ||
        employee.jobTitle
          .toLowerCase()
          .includes(query);

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        employee.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    employees,
    search,
    departmentFilter,
    statusFilter,
  ]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(createEmptyForm());
    setEditingId(null);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!form.email.trim()) {
      setError("Work email is required.");
      return;
    }

    if (!form.jobTitle.trim()) {
      setError("Job title is required.");
      return;
    }

    if (
      form.sinLast4 &&
      !/^\d{4}$/.test(form.sinLast4)
    ) {
      setError(
        "For the prototype, SIN must contain only the last 4 digits."
      );

      return;
    }

    if (
      form.payType === "Salary" &&
      Number(form.annualSalary) < 0
    ) {
      setError("Salary cannot be negative.");
      return;
    }

    if (
      form.payType === "Hourly" &&
      Number(form.hourlyRate) < 0
    ) {
      setError("Hourly rate cannot be negative.");
      return;
    }

    if (editingId) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingId
            ? {
                ...employee,
                ...form,
              }
            : employee
        )
      );

      resetForm();

      return;
    }

    const newEmployee = {
      id:
        window.crypto?.randomUUID?.() ||
        Date.now().toString(),

      employeeNumber: `K360-${String(
        employees.length + 1
      ).padStart(4, "0")}`,

      ...form,

      createdAt: new Date().toISOString(),
    };

    setEmployees((previous) => [
      newEmployee,
      ...previous,
    ]);

    resetForm();
  }

  function editEmployee(employee) {
    setEditingId(employee.id);

    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone || "",
      sinLast4: employee.sinLast4 || "",

      department: employee.department,
      jobTitle: employee.jobTitle,

      employmentType: employee.employmentType,
      status: employee.status,

      payType: employee.payType,
      annualSalary: employee.annualSalary || "",
      hourlyRate: employee.hourlyRate || "",
      hoursPerWeek:
        employee.hoursPerWeek || "40",

      startDate: employee.startDate,

      manager: employee.manager || "",

      emergencyContactName:
        employee.emergencyContactName || "",

      emergencyContactPhone:
        employee.emergencyContactPhone || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteEmployee(id) {
    setEmployees((previous) =>
      previous.filter(
        (employee) => employee.id !== id
      )
    );

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <main className="min-w-0 flex-1 bg-slate-50">

      <div className="mx-auto max-w-[1700px] p-5 lg:p-8">

        {/* HEADER */}

        <div className="mb-7">

          <p className="mb-1 text-sm font-medium text-blue-600">
            Karma360
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Employees
          </h1>

          <p className="mt-1 max-w-3xl text-sm text-slate-500">
            Manage your team, employment information,
            departments and payroll costs from one place.
          </p>

        </div>

        {/* KPI */}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            title="Total Employees"
            value={employees.length}
            icon={Users}
          />

          <MetricCard
            title="Active Employees"
            value={activeEmployees}
            icon={UserCheck}
          />

          <MetricCard
            title="Full-Time"
            value={fullTimeEmployees}
            icon={BriefcaseBusiness}
          />

          <MetricCard
            title="Est. Monthly Payroll"
            value={currency.format(monthlyPayroll)}
            icon={DollarSign}
          />

        </section>

        {/* ADD EMPLOYEE */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <UserPlus size={21} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  {editingId
                    ? "Edit Employee"
                    : "Add Employee"}
                </h2>

                <p className="text-xs text-slate-500">
                  Store employee and employment details.
                </p>
              </div>

            </div>

            {editingId && (
              <button
                onClick={resetForm}
                className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                <X size={16} />
                Cancel
              </button>
            )}

          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >

            <Input
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Yassine"
            />

            <Input
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Elamri"
            />

            <Input
              label="Work Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="employee@company.com"
            />

            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="647-555-0123"
            />

            <Input
              label="Job Title"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              placeholder="Frontend Developer"
            />

            <Select
              label="Department"
              name="department"
              value={form.department}
              onChange={handleChange}
              options={departments}
            />

            <Select
              label="Employment Type"
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              options={employmentTypes}
            />

            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={employeeStatuses}
            />

            <Select
              label="Pay Type"
              name="payType"
              value={form.payType}
              onChange={handleChange}
              options={["Salary", "Hourly"]}
            />

            {form.payType === "Salary" ? (
              <Input
                label="Annual Salary"
                name="annualSalary"
                type="number"
                value={form.annualSalary}
                onChange={handleChange}
                placeholder="65000"
              />
            ) : (
              <>
                <Input
                  label="Hourly Rate"
                  name="hourlyRate"
                  type="number"
                  value={form.hourlyRate}
                  onChange={handleChange}
                  placeholder="28"
                />

                <Input
                  label="Hours / Week"
                  name="hoursPerWeek"
                  type="number"
                  value={form.hoursPerWeek}
                  onChange={handleChange}
                  placeholder="40"
                />
              </>
            )}

            <Input
              label="Start Date"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
            />

            <Input
              label="Manager / Supervisor"
              name="manager"
              value={form.manager}
              onChange={handleChange}
              placeholder="Manager name"
            />

            <Input
              label="SIN - Last 4 Only"
              name="sinLast4"
              value={form.sinLast4}
              onChange={handleChange}
              placeholder="1234"
              maxLength={4}
            />

            <Input
              label="Emergency Contact"
              name="emergencyContactName"
              value={form.emergencyContactName}
              onChange={handleChange}
              placeholder="Contact name"
            />

            <Input
              label="Emergency Phone"
              name="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={handleChange}
              placeholder="647-555-0100"
            />

            <div className="flex items-end">

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >

                {editingId ? (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    Add Employee
                  </>
                )}

              </button>

            </div>

          </form>

          {error && (
            <p className="mt-4 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

          <div className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">
            Karma360 prototype stores only the final four
            digits of a SIN. Do not put real full SIN numbers
            into browser local storage.
          </div>

        </section>

        {/* BI SECTION */}

        <section className="mb-7 grid gap-5 xl:grid-cols-[1.4fr_1fr]">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5">

              <h2 className="font-bold text-slate-900">
                Team Distribution
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Active employees by department
              </p>

            </div>

            <div className="space-y-4">

              {departmentSummary.map((item) => {
                const percentage =
                  activeEmployees > 0
                    ? (item.count / activeEmployees) * 100
                    : 0;

                return (
                  <div key={item.department}>

                    <div className="mb-1.5 flex items-center justify-between">

                      <span className="text-sm font-medium text-slate-700">
                        {item.department}
                      </span>

                      <span className="text-sm font-bold text-slate-900">
                        {item.count}
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Workforce Insights
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Quick BI summary of your workforce
            </p>

            <div className="mt-5 space-y-4">

              <Insight
                label="Largest Department"
                value={
                  largestDepartment?.count > 0
                    ? largestDepartment.department
                    : "No employee data"
                }
              />

              <Insight
                label="Monthly Payroll"
                value={currency.format(monthlyPayroll)}
              />

              <Insight
                label="Active Workforce"
                value={
                  employees.length
                    ? `${(
                        (activeEmployees /
                          employees.length) *
                        100
                      ).toFixed(1)}%`
                    : "0%"
                }
              />

              <Insight
                label="Average Monthly Cost / Employee"
                value={
                  activeEmployees > 0
                    ? currency.format(
                        monthlyPayroll /
                          activeEmployees
                      )
                    : currency.format(0)
                }
              />

            </div>

          </div>

        </section>

        {/* DIRECTORY */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <div>
                <h2 className="font-bold text-slate-900">
                  Employee Directory
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Search and manage all registered employees.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">

                <div className="relative">

                  <Search
                    size={16}
                    className="absolute left-3 top-3 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search employees..."
                    className="h-10 rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                  />

                </div>

                <select
                  value={departmentFilter}
                  onChange={(event) =>
                    setDepartmentFilter(
                      event.target.value
                    )
                  }
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none"
                >

                  <option>All</option>

                  {departments.map((department) => (
                    <option key={department}>
                      {department}
                    </option>
                  ))}

                </select>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none"
                >

                  <option>All</option>

                  {employeeStatuses.map((status) => (
                    <option key={status}>
                      {status}
                    </option>
                  ))}

                </select>

              </div>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-left">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">

                <tr>
                  <th className="px-5 py-4">
                    Employee
                  </th>

                  <th className="px-5 py-4">
                    Department
                  </th>

                  <th className="px-5 py-4">
                    Employment
                  </th>

                  <th className="px-5 py-4">
                    Compensation
                  </th>

                  <th className="px-5 py-4">
                    Start Date
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredEmployees.length === 0 ? (

                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-14 text-center text-sm text-slate-400"
                    >
                      No employees found.
                    </td>
                  </tr>

                ) : (

                  filteredEmployees.map((employee) => (

                    <tr
                      key={employee.id}
                      className="border-t border-slate-100 text-sm"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">

                            {employee.firstName
                              .charAt(0)
                              .toUpperCase()}

                            {employee.lastName
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {employee.firstName}{" "}
                              {employee.lastName}
                            </p>

                            <p className="text-xs text-slate-500">
                              {employee.jobTitle}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                              {employee.employeeNumber}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-slate-600">

                          <Building2 size={15} />

                          {employee.department}

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <p className="font-medium text-slate-700">
                          {employee.employmentType}
                        </p>

                        <p className="text-xs text-slate-400">
                          {employee.payType}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        {employee.payType === "Salary" ? (

                          <>
                            <p className="font-semibold text-slate-900">
                              {currency.format(
                                Number(
                                  employee.annualSalary ||
                                    0
                                )
                              )}
                            </p>

                            <p className="text-xs text-slate-400">
                              per year
                            </p>
                          </>

                        ) : (

                          <>
                            <p className="font-semibold text-slate-900">
                              {currency.format(
                                Number(
                                  employee.hourlyRate ||
                                    0
                                )
                              )}
                            </p>

                            <p className="text-xs text-slate-400">
                              per hour
                            </p>
                          </>

                        )}

                      </td>

                      <td className="px-5 py-4 text-slate-600">

                        {new Date(
                          `${employee.startDate}T00:00:00`
                        ).toLocaleDateString(
                          "en-CA",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}

                      </td>

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={employee.status}
                        />

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-1">

                          <button
                            onClick={() =>
                              editEmployee(employee)
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              deleteEmployee(
                                employee.id
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </main>
  );
}

function Input({
  label,
  ...props
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label}
      </label>

      <input
        {...props}
        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
      />

    </div>
  );
}

function Select({
  label,
  options,
  ...props
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label}
      </label>

      <select
        {...props}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
      >

        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={20} />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function Insight({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active:
      "bg-emerald-50 text-emerald-700",

    "On Leave":
      "bg-amber-50 text-amber-700",

    Inactive:
      "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
}

export default Employees;