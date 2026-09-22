import { useEffect, useMemo, useState } from "react";

import {
  Building2,
  UsersRound,
  Zap,
  Droplets,
  Wifi,
  Megaphone,
  PackageOpen,
  Wrench,
  Plus,
  Trash2,
  CalendarDays,
  DollarSign,
  WalletCards,
  TrendingUp,
  TrendingDown,
  Percent,
  BarChart3,
  CircleDollarSign,
} from "lucide-react";

import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const EXPENSE_STORAGE_KEY = "karma360_expense_entries";
const SALES_STORAGE_KEY = "karma360_sales_entries";

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const categories = [
  {
    id: "rent",
    name: "Rent",
    icon: Building2,
    defaultFrequency: "monthly",
    color: "#2563eb",
    description: "Office, store or workspace rent",
  },
  {
    id: "salary",
    name: "Employee Salaries",
    icon: UsersRound,
    defaultFrequency: "biweekly",
    color: "#7c3aed",
    description: "Payroll and employee wages",
  },
  {
    id: "electricity",
    name: "Electricity",
    icon: Zap,
    defaultFrequency: "monthly",
    color: "#f59e0b",
    description: "Electricity and power bills",
  },
  {
    id: "water",
    name: "Water",
    icon: Droplets,
    defaultFrequency: "monthly",
    color: "#06b6d4",
    description: "Water and utility bills",
  },
  {
    id: "internet",
    name: "Internet",
    icon: Wifi,
    defaultFrequency: "monthly",
    color: "#14b8a6",
    description: "Internet and communication costs",
  },
  {
    id: "marketing",
    name: "Marketing",
    icon: Megaphone,
    defaultFrequency: "monthly",
    color: "#ec4899",
    description: "Advertising and promotion",
  },
  {
    id: "stock",
    name: "Stock & Orders",
    icon: PackageOpen,
    defaultFrequency: "one-time",
    color: "#f97316",
    description: "Inventory and supplier purchases",
  },
  {
    id: "unexpected",
    name: "Other / Unexpected",
    icon: Wrench,
    defaultFrequency: "one-time",
    color: "#64748b",
    description: "Repairs, unexpected payments and other costs",
  },
];

const periodOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const frequencyOptions = [
  { value: "one-time", label: "One-time" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function addDays(date, amount) {
  const result = new Date(date);

  result.setDate(result.getDate() + amount);

  return result;
}

function startOfWeek(date) {
  const result = new Date(date);

  const day = result.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);

  return result;
}

function endOfWeek(date) {
  return addDays(startOfWeek(date), 6);
}

function getRange(period, focusDate) {
  const date = parseDate(focusDate);

  if (period === "daily") {
    return {
      start: date,
      end: date,
    };
  }

  if (period === "weekly") {
    return {
      start: startOfWeek(date),
      end: endOfWeek(date),
    };
  }

  if (period === "biweekly") {
    return {
      start: addDays(date, -13),
      end: date,
    };
  }

  if (period === "monthly") {
    return {
      start: new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      ),

      end: new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ),
    };
  }

  return {
    start: new Date(date.getFullYear(), 0, 1),
    end: new Date(date.getFullYear(), 11, 31),
  };
}

function getPreviousRange(period, focusDate, currentRange) {
  const date = parseDate(focusDate);

  if (period === "daily") {
    const previous = addDays(date, -1);

    return {
      start: previous,
      end: previous,
    };
  }

  if (period === "weekly") {
    return {
      start: addDays(currentRange.start, -7),
      end: addDays(currentRange.end, -7),
    };
  }

  if (period === "biweekly") {
    return {
      start: addDays(currentRange.start, -14),
      end: addDays(currentRange.end, -14),
    };
  }

  if (period === "monthly") {
    return {
      start: new Date(
        date.getFullYear(),
        date.getMonth() - 1,
        1
      ),

      end: new Date(
        date.getFullYear(),
        date.getMonth(),
        0
      ),
    };
  }

  return {
    start: new Date(date.getFullYear() - 1, 0, 1),
    end: new Date(date.getFullYear() - 1, 11, 31),
  };
}

function isInsideRange(dateValue, range) {
  const date = parseDate(dateValue);

  return date >= range.start && date <= range.end;
}

function differenceInDays(date1, date2) {
  const milliseconds =
    date1.getTime() - date2.getTime();

  return Math.floor(milliseconds / 86400000);
}

function safeReadStorage(key) {
  try {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function isExpenseDue(expense, date) {
  const startDate = parseDate(expense.startDate);

  if (date < startDate) {
    return false;
  }

  const difference = differenceInDays(
    date,
    startDate
  );

  if (expense.frequency === "one-time") {
    return difference === 0;
  }

  if (expense.frequency === "daily") {
    return true;
  }

  if (expense.frequency === "weekly") {
    return difference % 7 === 0;
  }

  if (expense.frequency === "biweekly") {
    return difference % 14 === 0;
  }

  if (expense.frequency === "monthly") {
    return date.getDate() === startDate.getDate();
  }

  return false;
}

function buildExpenseOccurrences(expenses, range) {
  const occurrences = [];

  expenses.forEach((expense) => {
    let date = new Date(range.start);

    while (date <= range.end) {
      if (isExpenseDue(expense, date)) {
        occurrences.push({
          id: `${expense.id}-${toDateInput(date)}`,
          expenseId: expense.id,
          date: toDateInput(date),
          category: expense.category,
          categoryName: expense.categoryName,
          amount: Number(expense.amount),
          frequency: expense.frequency,
          note: expense.note,
        });
      }

      date = addDays(date, 1);
    }
  });

  return occurrences;
}

function calculateSalesRevenue(entries, range) {
  return entries
    .filter((entry) =>
      isInsideRange(entry.date, range)
    )
    .reduce(
      (total, entry) =>
        total + Number(entry.revenue || 0),
      0
    );
}

function calculateExpenseTotal(occurrences) {
  return occurrences.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  );
}

function percentageChange(current, previous) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return (
    ((current - previous) / previous) * 100
  );
}

function createInitialDrafts() {
  const drafts = {};

  categories.forEach((category) => {
    drafts[category.id] = {
      amount: "",
      startDate: getToday(),
      frequency: category.defaultFrequency,
      note: "",
    };
  });

  return drafts;
}

function Expenses() {
  const [expenses, setExpenses] = useState(() =>
    safeReadStorage(EXPENSE_STORAGE_KEY)
  );

  const [salesEntries] = useState(() =>
    safeReadStorage(SALES_STORAGE_KEY)
  );

  const [drafts, setDrafts] = useState(
    createInitialDrafts
  );

  const [period, setPeriod] =
    useState("monthly");

  const [focusDate, setFocusDate] =
    useState(getToday());

  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      EXPENSE_STORAGE_KEY,
      JSON.stringify(expenses)
    );
  }, [expenses]);

  const currentRange = useMemo(
    () => getRange(period, focusDate),
    [period, focusDate]
  );

  const previousRange = useMemo(
    () =>
      getPreviousRange(
        period,
        focusDate,
        currentRange
      ),
    [period, focusDate, currentRange]
  );

  const currentOccurrences = useMemo(
    () =>
      buildExpenseOccurrences(
        expenses,
        currentRange
      ),
    [expenses, currentRange]
  );

  const previousOccurrences = useMemo(
    () =>
      buildExpenseOccurrences(
        expenses,
        previousRange
      ),
    [expenses, previousRange]
  );

  const revenue = useMemo(
    () =>
      calculateSalesRevenue(
        salesEntries,
        currentRange
      ),
    [salesEntries, currentRange]
  );

  const previousRevenue = useMemo(
    () =>
      calculateSalesRevenue(
        salesEntries,
        previousRange
      ),
    [salesEntries, previousRange]
  );

  const totalExpenses = useMemo(
    () =>
      calculateExpenseTotal(
        currentOccurrences
      ),
    [currentOccurrences]
  );

  const previousExpenses = useMemo(
    () =>
      calculateExpenseTotal(
        previousOccurrences
      ),
    [previousOccurrences]
  );

  const netResult = revenue - totalExpenses;

  const previousNetResult =
    previousRevenue - previousExpenses;

  const netMargin =
    revenue > 0
      ? (netResult / revenue) * 100
      : 0;

  const expenseRatio =
    revenue > 0
      ? (totalExpenses / revenue) * 100
      : 0;

  const expenseChange = percentageChange(
    totalExpenses,
    previousExpenses
  );

  const netChange = percentageChange(
    netResult,
    previousNetResult
  );

  const monthlyCommitment = useMemo(() => {
    return expenses.reduce((total, expense) => {
      const amount = Number(expense.amount);

      if (expense.frequency === "daily") {
        return total + amount * 30.4;
      }

      if (expense.frequency === "weekly") {
        return total + amount * (52 / 12);
      }

      if (expense.frequency === "biweekly") {
        return total + amount * (26 / 12);
      }

      if (expense.frequency === "monthly") {
        return total + amount;
      }

      return total;
    }, 0);
  }, [expenses]);

  const categoryBreakdown = useMemo(() => {
    return categories
      .map((category) => {
        const amount = currentOccurrences
          .filter(
            (item) =>
              item.category === category.id
          )
          .reduce(
            (total, item) =>
              total + Number(item.amount),
            0
          );

        return {
          name: category.name,
          value: amount,
          color: category.color,
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [currentOccurrences]);

  const largestCategory =
    categoryBreakdown.length > 0
      ? categoryBreakdown[0]
      : null;

  const chartData = useMemo(() => {
    if (period === "yearly") {
      const year =
        parseDate(focusDate).getFullYear();

      return Array.from(
        { length: 12 },
        (_, monthIndex) => {
          const monthRange = {
            start: new Date(
              year,
              monthIndex,
              1
            ),

            end: new Date(
              year,
              monthIndex + 1,
              0
            ),
          };

          const monthRevenue =
            calculateSalesRevenue(
              salesEntries,
              monthRange
            );

          const monthExpenses =
            calculateExpenseTotal(
              buildExpenseOccurrences(
                expenses,
                monthRange
              )
            );

          return {
            label: new Date(
              year,
              monthIndex,
              1
            ).toLocaleDateString("en-CA", {
              month: "short",
            }),

            revenue: monthRevenue,
            expenses: monthExpenses,
            net:
              monthRevenue -
              monthExpenses,
          };
        }
      );
    }

    const data = [];

    let date = new Date(currentRange.start);

    while (date <= currentRange.end) {
      const key = toDateInput(date);

      const dayRevenue = salesEntries
        .filter(
          (entry) => entry.date === key
        )
        .reduce(
          (total, entry) =>
            total +
            Number(entry.revenue || 0),
          0
        );

      const dayExpenses =
        currentOccurrences
          .filter(
            (expense) =>
              expense.date === key
          )
          .reduce(
            (total, expense) =>
              total +
              Number(expense.amount),
            0
          );

      data.push({
        label:
          date.toLocaleDateString(
            "en-CA",
            {
              month: "short",
              day: "numeric",
            }
          ),

        revenue: dayRevenue,
        expenses: dayExpenses,
        net: dayRevenue - dayExpenses,
      });

      date = addDays(date, 1);
    }

    return data;
  }, [
    period,
    focusDate,
    salesEntries,
    expenses,
    currentRange,
    currentOccurrences,
  ]);

  function updateDraft(
    categoryId,
    field,
    value
  ) {
    setDrafts((previous) => ({
      ...previous,

      [categoryId]: {
        ...previous[categoryId],
        [field]: value,
      },
    }));
  }

  function addExpense(category) {
    const draft = drafts[category.id];

    setError("");

    const amount = Number(draft.amount);

    if (!amount || amount <= 0) {
      setError(
        `Enter a valid amount for ${category.name}.`
      );

      return;
    }

    if (!draft.startDate) {
      setError(
        `Select a date for ${category.name}.`
      );

      return;
    }

    const newExpense = {
      id:
        window.crypto?.randomUUID?.() ||
        Date.now().toString(),

      category: category.id,
      categoryName: category.name,
      amount,
      startDate: draft.startDate,
      frequency: draft.frequency,
      note: draft.note.trim(),
    };

    setExpenses((previous) => [
      newExpense,
      ...previous,
    ]);

    setFocusDate(draft.startDate);

    setDrafts((previous) => ({
      ...previous,

      [category.id]: {
        ...previous[category.id],
        amount: "",
        note: "",
      },
    }));
  }

  function deleteExpense(id) {
    setExpenses((previous) =>
      previous.filter(
        (expense) => expense.id !== id
      )
    );
  }

  const periodTitle = `${currentRange.start.toLocaleDateString(
    "en-CA",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  )} - ${currentRange.end.toLocaleDateString(
    "en-CA",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  )}`;

  return (
    <main className="min-w-0 flex-1 bg-slate-50">
      <div className="mx-auto max-w-[1700px] p-5 lg:p-8">

        {/* HEADER */}

        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">
              Karma360
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Expenses
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Track recurring and unexpected
              business costs and compare them
              directly with your sales revenue.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">

            {periodOptions.map(
              (option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setPeriod(option.value)
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    period === option.value
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {option.label}
                </button>
              )
            )}

          </div>
        </div>

        {/* EXPENSE CATEGORY CARDS */}

        <section className="mb-7">

          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Add Business Expenses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter each cost according to
              its payment schedule.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {categories.map(
              (category) => {
                const Icon =
                  category.icon;

                const draft =
                  drafts[category.id];

                return (
                  <div
                    key={category.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <div className="mb-4 flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Icon size={20} />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-900">
                          {category.name}
                        </h3>

                        <p className="text-[11px] text-slate-400">
                          {
                            category.description
                          }
                        </p>
                      </div>

                    </div>

                    <div className="space-y-3">

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-500">
                          Amount
                        </label>

                        <div className="relative">

                          <DollarSign
                            size={16}
                            className="absolute left-3 top-3 text-slate-400"
                          />

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              draft.amount
                            }
                            onChange={(
                              event
                            ) =>
                              updateDraft(
                                category.id,
                                "amount",
                                event.target
                                  .value
                              )
                            }
                            placeholder="0.00"
                            className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                          />

                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-500">
                            Date
                          </label>

                          <input
                            type="date"
                            value={
                              draft.startDate
                            }
                            onChange={(
                              event
                            ) =>
                              updateDraft(
                                category.id,
                                "startDate",
                                event.target
                                  .value
                              )
                            }
                            className="h-10 w-full rounded-xl border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-slate-500">
                            Frequency
                          </label>

                          <select
                            value={
                              draft.frequency
                            }
                            onChange={(
                              event
                            ) =>
                              updateDraft(
                                category.id,
                                "frequency",
                                event.target
                                  .value
                              )
                            }
                            className="h-10 w-full rounded-xl border border-slate-200 px-2 text-xs outline-none focus:border-blue-500"
                          >

                            {frequencyOptions.map(
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

                      </div>

                      <input
                        type="text"
                        value={draft.note}
                        onChange={(event) =>
                          updateDraft(
                            category.id,
                            "note",
                            event.target.value
                          )
                        }
                        placeholder="Optional note..."
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                      />

                      <button
                        onClick={() =>
                          addExpense(category)
                        }
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        <Plus size={16} />

                        Add Expense
                      </button>

                    </div>
                  </div>
                );
              }
            )}

          </div>

          {error && (
            <p className="mt-4 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}

        </section>

        {/* PERIOD SELECTOR */}

        <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <CalendarDays
              size={21}
              className="text-blue-600"
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Dashboard Period
              </p>

              <p className="text-sm font-semibold text-slate-800">
                {periodTitle}
              </p>
            </div>

          </div>

          <input
            type="date"
            value={focusDate}
            onChange={(event) =>
              setFocusDate(
                event.target.value
              )
            }
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
          />

        </section>

        {/* KPI CARDS */}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">

          <MetricCard
            title="Sales Revenue"
            value={currency.format(
              revenue
            )}
            icon={CircleDollarSign}
          />

          <MetricCard
            title="Total Expenses"
            value={currency.format(
              totalExpenses
            )}
            icon={WalletCards}
            change={expenseChange}
            changeType="expense"
          />

          <MetricCard
            title="Net Result"
            value={currency.format(
              netResult
            )}
            icon={
              netResult >= 0
                ? TrendingUp
                : TrendingDown
            }
            positive={
              netResult >= 0
            }
            change={netChange}
          />

          <MetricCard
            title="Net Margin"
            value={`${netMargin.toFixed(
              1
            )}%`}
            icon={Percent}
            positive={
              netMargin >= 0
            }
          />

          <MetricCard
            title="Expense Ratio"
            value={`${expenseRatio.toFixed(
              1
            )}%`}
            icon={BarChart3}
          />

          <MetricCard
            title="Monthly Commitments"
            value={currency.format(
              monthlyCommitment
            )}
            icon={Building2}
          />

        </section>

        {/* CHARTS */}

        <section className="mb-7 grid gap-5 xl:grid-cols-[2fr_1fr]">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5">
              <h2 className="font-bold text-slate-900">
                Revenue vs Expenses
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Compare revenue, operating
                costs and net result.
              </p>
            </div>

            <div className="h-[350px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <ComposedChart
                  data={chartData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 11,
                    }}
                    tickFormatter={(
                      value
                    ) => `$${value}`}
                  />

                  <Tooltip
                    formatter={(value) =>
                      currency.format(
                        value
                      )
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#2563eb"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="expenses"
                    name="Expenses"
                    fill="#f97316"
                    radius={[
                      5,
                      5,
                      0,
                      0,
                    ]}
                  />

                  <Line
                    type="monotone"
                    dataKey="net"
                    name="Net Result"
                    stroke="#10b981"
                    strokeWidth={3}
                  />

                </ComposedChart>

              </ResponsiveContainer>

            </div>
          </div>

          {/* EXPENSE BREAKDOWN */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Expense Breakdown
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Where your business money is
              being spent.
            </p>

            {categoryBreakdown.length ===
            0 ? (
              <div className="flex h-[300px] items-center justify-center text-center text-sm text-slate-400">
                Add expenses to generate
                the breakdown.
              </div>
            ) : (
              <>
                <div className="h-[230px]">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={
                          categoryBreakdown
                        }
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={85}
                      >

                        {categoryBreakdown.map(
                          (item) => (
                            <Cell
                              key={
                                item.name
                              }
                              fill={
                                item.color
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip
                        formatter={(
                          value
                        ) =>
                          currency.format(
                            value
                          )
                        }
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                <div className="space-y-2">

                  {categoryBreakdown.map(
                    (item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between"
                      >

                        <div className="flex items-center gap-2">

                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                item.color,
                            }}
                          />

                          <span className="text-xs text-slate-600">
                            {item.name}
                          </span>

                        </div>

                        <span className="text-xs font-semibold text-slate-800">
                          {currency.format(
                            item.value
                          )}
                        </span>

                      </div>
                    )
                  )}

                </div>
              </>
            )}

          </div>

        </section>

        {/* BI INSIGHTS */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2 className="font-bold text-slate-900">
              Business Intelligence
              Summary
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Automatic observations based
              on your current business data.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">

            <InsightCard
              title="Profitability"
              value={
                netResult >= 0
                  ? "Profitable period"
                  : "Expenses exceed revenue"
              }
              description={
                revenue === 0
                  ? "Enter sales data to calculate profitability."
                  : `Your net result is ${currency.format(
                      netResult
                    )}, giving you a ${netMargin.toFixed(
                      1
                    )}% net margin.`
              }
              positive={
                netResult >= 0
              }
            />

            <InsightCard
              title="Largest Cost"
              value={
                largestCategory
                  ? largestCategory.name
                  : "No data yet"
              }
              description={
                largestCategory
                  ? `${largestCategory.name} represents ${(
                      (largestCategory.value /
                        totalExpenses) *
                      100
                    ).toFixed(
                      1
                    )}% of expenses for this period.`
                  : "Add expense records to identify your largest cost category."
              }
            />

            <InsightCard
              title="Expense Trend"
              value={
                expenseChange > 0
                  ? `Up ${expenseChange.toFixed(
                      1
                    )}%`
                  : expenseChange < 0
                  ? `Down ${Math.abs(
                      expenseChange
                    ).toFixed(1)}%`
                  : "No change"
              }
              description="Compared with the previous equivalent period."
              positive={
                expenseChange <= 0
              }
            />

          </div>

        </section>

        {/* EXPENSE HISTORY */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 p-5">

            <h2 className="font-bold text-slate-900">
              Expense Records
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Recurring and one-time cost
              rules saved in Karma360.
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">

                <tr>
                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Amount
                  </th>

                  <th className="px-5 py-4">
                    Starts
                  </th>

                  <th className="px-5 py-4">
                    Frequency
                  </th>

                  <th className="px-5 py-4">
                    Note
                  </th>

                  <th className="px-5 py-4">
                  </th>
                </tr>

              </thead>

              <tbody>

                {expenses.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-sm text-slate-400"
                    >
                      No expenses have been
                      recorded yet.
                    </td>
                  </tr>

                ) : (

                  expenses.map(
                    (expense) => (

                      <tr
                        key={expense.id}
                        className="border-t border-slate-100 text-sm"
                      >

                        <td className="px-5 py-4 font-semibold text-slate-800">
                          {
                            expense.categoryName
                          }
                        </td>

                        <td className="px-5 py-4 font-bold text-slate-900">
                          {currency.format(
                            expense.amount
                          )}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {parseDate(
                            expense.startDate
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

                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
                            {
                              expense.frequency
                            }
                          </span>

                        </td>

                        <td className="max-w-[260px] truncate px-5 py-4 text-slate-500">
                          {expense.note ||
                            "—"}
                        </td>

                        <td className="px-5 py-4 text-right">

                          <button
                            onClick={() =>
                              deleteExpense(
                                expense.id
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >

                            <Trash2
                              size={17}
                            />

                          </button>

                        </td>

                      </tr>
                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  positive = true,
  change,
  changeType,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="mb-4 flex items-start justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={20} />
        </div>

        {change !== undefined && (
          <span
            className={`rounded-lg px-2 py-1 text-xs font-semibold ${
              changeType === "expense"
                ? change <= 0
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
                : change >= 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        )}

      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p
        className={`mt-1 text-2xl font-bold tracking-tight ${
          title === "Net Result"
            ? positive
              ? "text-emerald-600"
              : "text-red-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

function InsightCard({
  title,
  value,
  description,
  positive,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p
        className={`mt-2 text-lg font-bold ${
          positive === true
            ? "text-emerald-600"
            : positive === false
            ? "text-red-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default Expenses;