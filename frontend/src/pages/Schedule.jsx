import { useEffect, useMemo, useState } from "react";

import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Clock3,
  DollarSign,
  Building2,
  MapPin,
  Trash2,
  Pencil,
  X,
  Save,
  AlertTriangle,
  BriefcaseBusiness,
  UserCheck,
  CalendarDays,
} from "lucide-react";

const EMPLOYEE_STORAGE_KEY = "karma360_employees";
const SCHEDULE_STORAGE_KEY = "karma360_schedule";

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

const shiftStatuses = [
  "Scheduled",
  "Confirmed",
  "Completed",
  "Absent",
];

const repeatOptions = [
  {
    value: "once",
    label: "Only this day",
  },
  {
    value: "weekdays",
    label: "Monday - Friday",
  },
  {
    value: "everyday",
    label: "Every day this week",
  },
];

function getToday() {
  const date = new Date();

  return toDateInput(date);
}

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date, number) {
  const result = new Date(date);

  result.setDate(result.getDate() + number);

  return result;
}

function startOfWeek(date) {
  const result = new Date(date);

  const day = result.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  result.setDate(
    result.getDate() + difference
  );

  return result;
}

function formatDay(date) {
  return date.toLocaleDateString("en-CA", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function safeReadStorage(key) {
  try {
    const saved =
      localStorage.getItem(key);

    return saved
      ? JSON.parse(saved)
      : [];
  } catch {
    return [];
  }
}

function calculateHours(
  startTime,
  endTime,
  breakMinutes = 0
) {
  if (!startTime || !endTime) {
    return 0;
  }

  const [startHour, startMinute] =
    startTime.split(":").map(Number);

  const [endHour, endMinute] =
    endTime.split(":").map(Number);

  let start =
    startHour * 60 + startMinute;

  let end =
    endHour * 60 + endMinute;

  // Allows overnight shifts
  if (end < start) {
    end += 24 * 60;
  }

  const minutes =
    end -
    start -
    Number(breakMinutes || 0);

  return Math.max(
    minutes / 60,
    0
  );
}

function calculateEmployeeHourlyCost(
  employee
) {
  if (!employee) {
    return 0;
  }

  if (
    employee.payType === "Hourly"
  ) {
    return Number(
      employee.hourlyRate || 0
    );
  }

  const annualSalary = Number(
    employee.annualSalary || 0
  );

  const hoursPerWeek = Number(
    employee.hoursPerWeek || 40
  );

  if (
    annualSalary <= 0 ||
    hoursPerWeek <= 0
  ) {
    return 0;
  }

  return (
    annualSalary /
    (52 * hoursPerWeek)
  );
}

function shiftsOverlap(
  shiftA,
  shiftB
) {
  if (
    shiftA.date !== shiftB.date
  ) {
    return false;
  }

  if (
    !shiftA.employeeId ||
    !shiftB.employeeId
  ) {
    return false;
  }

  if (
    shiftA.employeeId !==
    shiftB.employeeId
  ) {
    return false;
  }

  return (
    shiftA.startTime <
      shiftB.endTime &&
    shiftA.endTime >
      shiftB.startTime
  );
}

function createEmptyForm() {
  return {
    employeeId: "",
    department: "Technology",
    role: "",
    date: getToday(),
    startTime: "09:00",
    endTime: "17:00",
    breakMinutes: "30",
    location: "Office",
    status: "Scheduled",
    note: "",
    repeat: "once",
  };
}

function Schedule() {
  const [employees] = useState(() =>
    safeReadStorage(
      EMPLOYEE_STORAGE_KEY
    )
  );

  const [shifts, setShifts] =
    useState(() =>
      safeReadStorage(
        SCHEDULE_STORAGE_KEY
      )
    );

  const [form, setForm] =
    useState(createEmptyForm());

  const [editingId, setEditingId] =
    useState(null);

  const [weekStart, setWeekStart] =
    useState(() =>
      startOfWeek(new Date())
    );

  const [
    departmentFilter,
    setDepartmentFilter,
  ] = useState("All");

  const [
    employeeFilter,
    setEmployeeFilter,
  ] = useState("All");

  const [error, setError] =
    useState("");

  useEffect(() => {
    localStorage.setItem(
      SCHEDULE_STORAGE_KEY,
      JSON.stringify(shifts)
    );
  }, [shifts]);

  const activeEmployees =
    useMemo(() => {
      return employees.filter(
        (employee) =>
          employee.status === "Active"
      );
    }, [employees]);

  const weekDays = useMemo(() => {
    return Array.from(
      { length: 7 },
      (_, index) =>
        addDays(
          weekStart,
          index
        )
    );
  }, [weekStart]);

  const weekEnd =
    weekDays[6];

  const filteredShifts =
    useMemo(() => {
      const weekStartString =
        toDateInput(weekStart);

      const weekEndString =
        toDateInput(weekEnd);

      return shifts
        .filter(
          (shift) =>
            shift.date >=
              weekStartString &&
            shift.date <=
              weekEndString
        )
        .filter((shift) => {
          if (
            departmentFilter !==
              "All" &&
            shift.department !==
              departmentFilter
          ) {
            return false;
          }

          if (
            employeeFilter !==
              "All" &&
            shift.employeeId !==
              employeeFilter
          ) {
            return false;
          }

          return true;
        });
    }, [
      shifts,
      weekStart,
      weekEnd,
      departmentFilter,
      employeeFilter,
    ]);

  const scheduledEmployeeIds =
    useMemo(() => {
      return new Set(
        filteredShifts
          .filter(
            (shift) =>
              shift.employeeId
          )
          .map(
            (shift) =>
              shift.employeeId
          )
      );
    }, [filteredShifts]);

  const totalHours = useMemo(
    () =>
      filteredShifts.reduce(
        (total, shift) =>
          total +
          calculateHours(
            shift.startTime,
            shift.endTime,
            shift.breakMinutes
          ),
        0
      ),
    [filteredShifts]
  );

  const estimatedLabourCost =
    useMemo(() => {
      return filteredShifts.reduce(
        (total, shift) => {
          if (!shift.employeeId) {
            return total;
          }

          const employee =
            employees.find(
              (item) =>
                item.id ===
                shift.employeeId
            );

          const hourlyCost =
            calculateEmployeeHourlyCost(
              employee
            );

          const hours =
            calculateHours(
              shift.startTime,
              shift.endTime,
              shift.breakMinutes
            );

          return (
            total +
            hourlyCost * hours
          );
        },
        0
      );
    }, [
      filteredShifts,
      employees,
    ]);

  const openShifts =
    filteredShifts.filter(
      (shift) =>
        !shift.employeeId
    ).length;

  const conflictCount =
    useMemo(() => {
      let count = 0;

      filteredShifts.forEach(
        (shift, index) => {
          filteredShifts
            .slice(index + 1)
            .forEach(
              (otherShift) => {
                if (
                  shiftsOverlap(
                    shift,
                    otherShift
                  )
                ) {
                  count++;
                }
              }
            );
        }
      );

      return count;
    }, [filteredShifts]);

  function handleChange(event) {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (
      name === "employeeId" &&
      value
    ) {
      const employee =
        employees.find(
          (item) =>
            item.id === value
        );

      if (employee) {
        setForm((previous) => ({
          ...previous,
          employeeId: value,
          department:
            employee.department,
          role:
            employee.jobTitle ||
            previous.role,
        }));
      }
    }
  }

  function getDatesForRepeat() {
    const selectedDate =
      parseDate(form.date);

    if (
      form.repeat === "once"
    ) {
      return [form.date];
    }

    const selectedWeekStart =
      startOfWeek(
        selectedDate
      );

    if (
      form.repeat ===
      "weekdays"
    ) {
      return Array.from(
        { length: 5 },
        (_, index) =>
          toDateInput(
            addDays(
              selectedWeekStart,
              index
            )
          )
      );
    }

    return Array.from(
      { length: 7 },
      (_, index) =>
        toDateInput(
          addDays(
            selectedWeekStart,
            index
          )
        )
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.date) {
      setError(
        "Select a shift date."
      );
      return;
    }

    if (
      !form.startTime ||
      !form.endTime
    ) {
      setError(
        "Start and end time are required."
      );
      return;
    }

    if (
      calculateHours(
        form.startTime,
        form.endTime,
        form.breakMinutes
      ) <= 0
    ) {
      setError(
        "The shift must contain working hours."
      );
      return;
    }

    if (!form.role.trim()) {
      setError(
        "Enter the role for this shift."
      );
      return;
    }

    if (editingId) {
      const updatedShift = {
        ...form,
        id: editingId,
      };

      const hasConflict =
        shifts.some((shift) => {
          if (
            shift.id === editingId
          ) {
            return false;
          }

          return shiftsOverlap(
            shift,
            updatedShift
          );
        });

      if (hasConflict) {
        setError(
          "This employee already has an overlapping shift."
        );
        return;
      }

      setShifts((previous) =>
        previous.map((shift) =>
          shift.id === editingId
            ? updatedShift
            : shift
        )
      );

      resetForm();

      return;
    }

    const dates =
      getDatesForRepeat();

    const newShifts = [];

    for (const date of dates) {
      const candidate = {
        ...form,

        id:
          window.crypto
            ?.randomUUID?.() ||
          `${Date.now()}-${date}`,

        date,

        repeat: "once",

        createdAt:
          new Date().toISOString(),
      };

      const hasConflict = [
        ...shifts,
        ...newShifts,
      ].some((existingShift) =>
        shiftsOverlap(
          existingShift,
          candidate
        )
      );

      if (hasConflict) {
        setError(
          `Scheduling conflict detected on ${date}. No shifts were added.`
        );

        return;
      }

      newShifts.push(candidate);
    }

    setShifts((previous) => [
      ...previous,
      ...newShifts,
    ]);

    setWeekStart(
      startOfWeek(
        parseDate(form.date)
      )
    );

    resetForm();
  }

  function resetForm() {
    setForm(createEmptyForm());
    setEditingId(null);
    setError("");
  }

  function editShift(shift) {
    setEditingId(shift.id);

    setForm({
      employeeId:
        shift.employeeId || "",
      department:
        shift.department,
      role: shift.role,
      date: shift.date,
      startTime:
        shift.startTime,
      endTime: shift.endTime,
      breakMinutes:
        shift.breakMinutes,
      location:
        shift.location,
      status: shift.status,
      note: shift.note || "",
      repeat: "once",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteShift(id) {
    setShifts((previous) =>
      previous.filter(
        (shift) =>
          shift.id !== id
      )
    );

    if (editingId === id) {
      resetForm();
    }
  }

  function goPreviousWeek() {
    setWeekStart((previous) =>
      addDays(previous, -7)
    );
  }

  function goNextWeek() {
    setWeekStart((previous) =>
      addDays(previous, 7)
    );
  }

  function goCurrentWeek() {
    setWeekStart(
      startOfWeek(
        new Date()
      )
    );
  }

  return (
    <main className="min-w-0 flex-1 bg-slate-50">

      <div className="mx-auto max-w-[1800px] p-5 lg:p-8">

        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>

            <p className="mb-1 text-sm font-medium text-blue-600">
              Karma360
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Team Schedule
            </h1>

            <p className="mt-1 max-w-3xl text-sm text-slate-500">
              Plan employee shifts,
              monitor staffing coverage,
              prevent scheduling
              conflicts and estimate
              weekly labour costs.
            </p>

          </div>

          <div className="flex flex-wrap items-center gap-2">

            <button
              onClick={goPreviousWeek}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={goCurrentWeek}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              This Week
            </button>

            <button
              onClick={goNextWeek}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            >
              <ChevronRight size={18} />
            </button>

          </div>

        </div>

        {/* KPI */}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

          <MetricCard
            title="Scheduled Staff"
            value={
              scheduledEmployeeIds.size
            }
            icon={UserCheck}
          />

          <MetricCard
            title="Total Shifts"
            value={
              filteredShifts.length
            }
            icon={CalendarClock}
          />

          <MetricCard
            title="Scheduled Hours"
            value={`${totalHours.toFixed(
              1
            )} hrs`}
            icon={Clock3}
          />

          <MetricCard
            title="Est. Labour Cost"
            value={currency.format(
              estimatedLabourCost
            )}
            icon={DollarSign}
          />

          <MetricCard
            title="Open Shifts"
            value={openShifts}
            icon={Users}
            alert={openShifts > 0}
          />

        </section>

        {/* ADD SHIFT */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-6 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Plus size={20} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  {editingId
                    ? "Edit Shift"
                    : "Create Shift"}
                </h2>

                <p className="text-xs text-slate-500">
                  Assign an employee or
                  create an open shift.
                </p>

              </div>

            </div>

            {editingId && (

              <button
                onClick={resetForm}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
              >
                <X size={16} />
                Cancel
              </button>

            )}

          </div>

          {activeEmployees.length ===
            0 && (

            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">

              Add active employees in the
              Employees section before
              assigning shifts. You can
              still create an open shift.

            </div>

          )}

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >

            {/* EMPLOYEE */}

            <div>

              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Employee
              </label>

              <select
                name="employeeId"
                value={
                  form.employeeId
                }
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >

                <option value="">
                  Open / Unassigned Shift
                </option>

                {activeEmployees.map(
                  (employee) => (

                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {
                        employee.firstName
                      }{" "}
                      {
                        employee.lastName
                      }{" "}
                      —{" "}
                      {
                        employee.jobTitle
                      }
                    </option>

                  )
                )}

              </select>

            </div>

            {/* DEPARTMENT */}

            <div>

              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Department
              </label>

              <select
                name="department"
                value={
                  form.department
                }
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >

                {departments.map(
                  (department) => (

                    <option
                      key={department}
                    >
                      {department}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* ROLE */}

            <Input
              label="Role / Position"
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Software Developer"
            />

            {/* DATE */}

            <Input
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />

            {/* START */}

            <Input
              label="Start Time"
              name="startTime"
              type="time"
              value={
                form.startTime
              }
              onChange={handleChange}
            />

            {/* END */}

            <Input
              label="End Time"
              name="endTime"
              type="time"
              value={form.endTime}
              onChange={handleChange}
            />

            {/* BREAK */}

            <Input
              label="Break (minutes)"
              name="breakMinutes"
              type="number"
              min="0"
              value={
                form.breakMinutes
              }
              onChange={handleChange}
            />

            {/* LOCATION */}

            <Input
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Office / Remote"
            />

            {/* STATUS */}

            <div>

              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
              >

                {shiftStatuses.map(
                  (status) => (

                    <option
                      key={status}
                    >
                      {status}
                    </option>

                  )
                )}

              </select>

            </div>

            {/* REPEAT */}

            {!editingId && (

              <div>

                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Repeat
                </label>

                <select
                  name="repeat"
                  value={
                    form.repeat
                  }
                  onChange={
                    handleChange
                  }
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >

                  {repeatOptions.map(
                    (option) => (

                      <option
                        key={
                          option.value
                        }
                        value={
                          option.value
                        }
                      >
                        {
                          option.label
                        }
                      </option>

                    )
                  )}

                </select>

              </div>

            )}

            {/* NOTES */}

            <div className="md:col-span-2">

              <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                Shift Notes
              </label>

              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Opening shift, client meeting, remote day..."
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />

            </div>

            <div className="flex items-end">

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >

                {editingId ? (
                  <>
                    <Save size={17} />
                    Save Shift
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Add Shift
                  </>
                )}

              </button>

            </div>

          </form>

          {error && (

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">

              <AlertTriangle
                size={17}
              />

              {error}

            </div>

          )}

        </section>

        {/* WEEK CONTROL */}

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            <div className="flex items-center gap-3">

              <CalendarDays
                size={21}
                className="text-blue-600"
              />

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Schedule Week
                </p>

                <p className="text-sm font-semibold text-slate-800">

                  {weekStart.toLocaleDateString(
                    "en-CA",
                    {
                      month:
                        "short",
                      day: "numeric",
                    }
                  )}

                  {" - "}

                  {weekEnd.toLocaleDateString(
                    "en-CA",
                    {
                      month:
                        "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}

                </p>

              </div>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <select
                value={
                  departmentFilter
                }
                onChange={(event) =>
                  setDepartmentFilter(
                    event.target.value
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
              >

                <option value="All">
                  All Departments
                </option>

                {departments.map(
                  (department) => (

                    <option
                      key={department}
                    >
                      {department}
                    </option>

                  )
                )}

              </select>

              <select
                value={
                  employeeFilter
                }
                onChange={(event) =>
                  setEmployeeFilter(
                    event.target.value
                  )
                }
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none"
              >

                <option value="All">
                  All Employees
                </option>

                {activeEmployees.map(
                  (employee) => (

                    <option
                      key={employee.id}
                      value={employee.id}
                    >
                      {
                        employee.firstName
                      }{" "}
                      {
                        employee.lastName
                      }
                    </option>

                  )
                )}

              </select>

            </div>

          </div>

        </section>

        {/* CONFLICT WARNING */}

        {conflictCount > 0 && (

          <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">

            <AlertTriangle
              size={20}
            />

            <div>

              <p className="font-semibold">
                Scheduling Conflict
              </p>

              <p className="text-sm">
                {conflictCount} overlapping
                employee shift
                {conflictCount !== 1
                  ? "s"
                  : ""}{" "}
                found.
              </p>

            </div>

          </div>

        )}

        {/* WEEKLY BOARD */}

        <section className="mb-7">

          <div className="mb-4">

            <h2 className="text-lg font-bold text-slate-900">
              Weekly Schedule
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Team coverage across the
              selected week.
            </p>

          </div>

          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-7">

            {weekDays.map((date) => {

              const dateKey =
                toDateInput(date);

              const dayShifts =
                filteredShifts
                  .filter(
                    (shift) =>
                      shift.date ===
                      dateKey
                  )
                  .sort((a, b) =>
                    a.startTime.localeCompare(
                      b.startTime
                    )
                  );

              const dayHours =
                dayShifts.reduce(
                  (total, shift) =>
                    total +
                    calculateHours(
                      shift.startTime,
                      shift.endTime,
                      shift.breakMinutes
                    ),
                  0
                );

              return (

                <div
                  key={dateKey}
                  className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  <div className="border-b border-slate-100 p-4">

                    <p className="font-bold text-slate-900">
                      {formatDay(date)}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {
                        dayShifts.length
                      }{" "}
                      shifts ·{" "}
                      {dayHours.toFixed(
                        1
                      )}{" "}
                      hrs
                    </p>

                  </div>

                  <div className="space-y-3 p-3">

                    {dayShifts.length ===
                    0 ? (

                      <div className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">
                        No shifts
                      </div>

                    ) : (

                      dayShifts.map(
                        (shift) => {

                          const employee =
                            employees.find(
                              (
                                item
                              ) =>
                                item.id ===
                                shift.employeeId
                            );

                          return (

                            <ShiftCard
                              key={
                                shift.id
                              }
                              shift={
                                shift
                              }
                              employee={
                                employee
                              }
                              onEdit={
                                editShift
                              }
                              onDelete={
                                deleteShift
                              }
                            />

                          );
                        }
                      )

                    )}

                  </div>

                </div>

              );
            })}

          </div>

        </section>

        {/* BI SUMMARY */}

        <section className="mb-7 grid gap-5 xl:grid-cols-2">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Department Coverage
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Scheduled labour hours by
              department this week.
            </p>

            <div className="mt-6 space-y-4">

              {departments.map(
                (department) => {

                  const departmentHours =
                    filteredShifts
                      .filter(
                        (shift) =>
                          shift.department ===
                          department
                      )
                      .reduce(
                        (
                          total,
                          shift
                        ) =>
                          total +
                          calculateHours(
                            shift.startTime,
                            shift.endTime,
                            shift.breakMinutes
                          ),
                        0
                      );

                  const percentage =
                    totalHours > 0
                      ? (departmentHours /
                          totalHours) *
                        100
                      : 0;

                  return (

                    <div
                      key={
                        department
                      }
                    >

                      <div className="mb-1.5 flex items-center justify-between">

                        <span className="text-sm text-slate-600">
                          {department}
                        </span>

                        <span className="text-sm font-bold text-slate-900">
                          {departmentHours.toFixed(
                            1
                          )}{" "}
                          hrs
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
                }
              )}

            </div>

          </div>

          {/* WORKFORCE BI */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Workforce Insights
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Schedule information useful
              for workforce planning.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <InsightCard
                title="Active Employees"
                value={
                  activeEmployees.length
                }
                description="Employees currently available for scheduling."
              />

              <InsightCard
                title="Scheduled Employees"
                value={
                  scheduledEmployeeIds.size
                }
                description="Unique employees receiving at least one shift this week."
              />

              <InsightCard
                title="Avg Hours / Scheduled Employee"
                value={
                  scheduledEmployeeIds.size >
                  0
                    ? `${(
                        totalHours /
                        scheduledEmployeeIds.size
                      ).toFixed(
                        1
                      )} hrs`
                    : "0 hrs"
                }
                description="Average scheduled hours per employee."
              />

              <InsightCard
                title="Avg Labour Cost / Hour"
                value={
                  totalHours > 0
                    ? currency.format(
                        estimatedLabourCost /
                          totalHours
                      )
                    : currency.format(
                        0
                      )
                }
                description="Estimated payroll cost divided by scheduled hours."
              />

            </div>

          </div>

        </section>

        {/* SHIFT TABLE */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5">

            <h2 className="font-bold text-slate-900">
              Shift Details
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Complete schedule for the
              selected week.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-left">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">

                <tr>
                  <th className="px-5 py-4">
                    Employee
                  </th>

                  <th className="px-5 py-4">
                    Date
                  </th>

                  <th className="px-5 py-4">
                    Shift
                  </th>

                  <th className="px-5 py-4">
                    Hours
                  </th>

                  <th className="px-5 py-4">
                    Department
                  </th>

                  <th className="px-5 py-4">
                    Location
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

                {filteredShifts.length ===
                0 ? (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-5 py-14 text-center text-sm text-slate-400"
                    >
                      No shifts scheduled
                      for this week.
                    </td>

                  </tr>

                ) : (

                  filteredShifts
                    .sort(
                      (a, b) =>
                        `${a.date}${a.startTime}`.localeCompare(
                          `${b.date}${b.startTime}`
                        )
                    )
                    .map((shift) => {

                      const employee =
                        employees.find(
                          (item) =>
                            item.id ===
                            shift.employeeId
                        );

                      const hours =
                        calculateHours(
                          shift.startTime,
                          shift.endTime,
                          shift.breakMinutes
                        );

                      return (

                        <tr
                          key={shift.id}
                          className="border-t border-slate-100 text-sm"
                        >

                          <td className="px-5 py-4">

                            {employee ? (

                              <div>

                                <p className="font-semibold text-slate-900">
                                  {
                                    employee.firstName
                                  }{" "}
                                  {
                                    employee.lastName
                                  }
                                </p>

                                <p className="text-xs text-slate-400">
                                  {
                                    shift.role
                                  }
                                </p>

                              </div>

                            ) : (

                              <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                Open Shift
                              </span>

                            )}

                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {parseDate(
                              shift.date
                            ).toLocaleDateString(
                              "en-CA",
                              {
                                month:
                                  "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </td>

                          <td className="px-5 py-4 font-medium text-slate-700">
                            {
                              shift.startTime
                            }{" "}
                            -{" "}
                            {
                              shift.endTime
                            }
                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-900">
                            {hours.toFixed(
                              1
                            )}{" "}
                            hrs
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {
                              shift.department
                            }
                          </td>

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-1.5 text-slate-500">

                              <MapPin
                                size={14}
                              />

                              {
                                shift.location
                              }

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <StatusBadge
                              status={
                                shift.status
                              }
                            />

                          </td>

                          <td className="px-5 py-4">

                            <div className="flex gap-1">

                              <button
                                onClick={() =>
                                  editShift(
                                    shift
                                  )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Pencil
                                  size={
                                    16
                                  }
                                />
                              </button>

                              <button
                                onClick={() =>
                                  deleteShift(
                                    shift.id
                                  )
                                }
                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2
                                  size={
                                    16
                                  }
                                />
                              </button>

                            </div>

                          </td>

                        </tr>

                      );
                    })

                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </main>
  );
}

function ShiftCard({
  shift,
  employee,
  onEdit,
  onDelete,
}) {
  const hours =
    calculateHours(
      shift.startTime,
      shift.endTime,
      shift.breakMinutes
    );

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">

      <div className="mb-2 flex items-start justify-between gap-2">

        <div className="min-w-0">

          <p className="truncate text-sm font-bold text-slate-900">

            {employee
              ? `${employee.firstName} ${employee.lastName}`
              : "Open Shift"}

          </p>

          <p className="truncate text-xs text-slate-500">
            {shift.role}
          </p>

        </div>

        <StatusBadge
          status={shift.status}
        />

      </div>

      <div className="space-y-1 text-xs text-slate-500">

        <div className="flex items-center gap-1.5">
          <Clock3 size={13} />

          {shift.startTime} -{" "}
          {shift.endTime}

          <span>
            · {hours.toFixed(1)} hrs
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Building2 size={13} />
          {shift.department}
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin size={13} />
          {shift.location}
        </div>

      </div>

      <div className="mt-3 flex gap-1">

        <button
          onClick={() =>
            onEdit(shift)
          }
          className="flex h-8 flex-1 items-center justify-center gap-1 rounded-lg bg-white text-xs font-medium text-slate-600 hover:text-blue-600"
        >
          <Pencil size={13} />
          Edit
        </button>

        <button
          onClick={() =>
            onDelete(shift.id)
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-400 hover:text-red-600"
        >
          <Trash2 size={13} />
        </button>

      </div>

    </div>
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

function MetricCard({
  title,
  value,
  icon: Icon,
  alert = false,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div
        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
          alert
            ? "bg-amber-50 text-amber-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
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

function InsightCard({
  title,
  value,
  description,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function StatusBadge({
  status,
}) {
  const styles = {
    Scheduled:
      "bg-blue-50 text-blue-700",

    Confirmed:
      "bg-violet-50 text-violet-700",

    Completed:
      "bg-emerald-50 text-emerald-700",

    Absent:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`whitespace-nowrap rounded-lg px-2 py-1 text-[10px] font-semibold ${
        styles[status] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default Schedule;