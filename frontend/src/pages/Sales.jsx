import { useEffect, useMemo, useState } from "react";

import {
  Plus,
  CalendarDays,
  DollarSign,
  TrendingUp,
  WalletCards,
  Percent,
  ReceiptText,
  Trophy,
  Trash2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
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
} from "recharts";

const STORAGE_KEY = "karma360_sales_entries";

const currency = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

const periodOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
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
      start: new Date(date.getFullYear(), date.getMonth(), 1),
      end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
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
      start: new Date(date.getFullYear(), date.getMonth() - 1, 1),
      end: new Date(date.getFullYear(), date.getMonth(), 0),
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

function getNumberOfDays(range) {
  const milliseconds = range.end.getTime() - range.start.getTime();

  return Math.floor(milliseconds / 86400000) + 1;
}

function calculateTotals(entries) {
  const revenue = entries.reduce(
    (total, entry) => total + Number(entry.revenue),
    0
  );

  const cost = entries.reduce(
    (total, entry) => total + Number(entry.cost),
    0
  );

  const profit = revenue - cost;

  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

  return {
    revenue,
    cost,
    profit,
    margin,
  };
}

function formatShortDate(date) {
  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });
}

function Sales() {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    date: getToday(),
    revenue: "",
    cost: "",
    channel: "In-store",
    note: "",
  });

  const [period, setPeriod] = useState("monthly");
  const [focusDate, setFocusDate] = useState(getToday());
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const currentRange = useMemo(
    () => getRange(period, focusDate),
    [period, focusDate]
  );

  const previousRange = useMemo(
    () => getPreviousRange(period, focusDate, currentRange),
    [period, focusDate, currentRange]
  );

  const currentEntries = useMemo(() => {
    return entries.filter((entry) =>
      isInsideRange(entry.date, currentRange)
    );
  }, [entries, currentRange]);

  const previousEntries = useMemo(() => {
    return entries.filter((entry) =>
      isInsideRange(entry.date, previousRange)
    );
  }, [entries, previousRange]);

  const totals = useMemo(
    () => calculateTotals(currentEntries),
    [currentEntries]
  );

  const previousTotals = useMemo(
    () => calculateTotals(previousEntries),
    [previousEntries]
  );

  const revenueChange = useMemo(() => {
    if (previousTotals.revenue === 0) {
      return totals.revenue > 0 ? 100 : 0;
    }

    return (
      ((totals.revenue - previousTotals.revenue) /
        previousTotals.revenue) *
      100
    );
  }, [totals.revenue, previousTotals.revenue]);

  const averageDailyRevenue =
    totals.revenue / Math.max(getNumberOfDays(currentRange), 1);

  const bestDay = useMemo(() => {
    const grouped = {};

    currentEntries.forEach((entry) => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = 0;
      }

      grouped[entry.date] += Number(entry.revenue);
    });

    const result = Object.entries(grouped).sort(
      (a, b) => b[1] - a[1]
    );

    if (!result.length) {
      return null;
    }

    return {
      date: result[0][0],
      revenue: result[0][1],
    };
  }, [currentEntries]);

  const chartData = useMemo(() => {
    if (period === "yearly") {
      const year = parseDate(focusDate).getFullYear();

      return Array.from({ length: 12 }, (_, index) => {
        const monthEntries = entries.filter((entry) => {
          const date = parseDate(entry.date);

          return (
            date.getFullYear() === year &&
            date.getMonth() === index
          );
        });

        const monthTotals = calculateTotals(monthEntries);

        return {
          label: new Date(year, index, 1).toLocaleDateString(
            "en-CA",
            {
              month: "short",
            }
          ),
          revenue: monthTotals.revenue,
          profit: monthTotals.profit,
          cost: monthTotals.cost,
        };
      });
    }

    const data = [];

    let day = new Date(currentRange.start);

    while (day <= currentRange.end) {
      const key = toDateInput(day);

      const dayEntries = currentEntries.filter(
        (entry) => entry.date === key
      );

      const dayTotals = calculateTotals(dayEntries);

      data.push({
        label: formatShortDate(day),
        revenue: dayTotals.revenue,
        profit: dayTotals.profit,
        cost: dayTotals.cost,
      });

      day = addDays(day, 1);
    }

    return data;
  }, [
    period,
    focusDate,
    entries,
    currentEntries,
    currentRange,
  ]);

  const channelData = useMemo(() => {
    const grouped = {};

    currentEntries.forEach((entry) => {
      if (!grouped[entry.channel]) {
        grouped[entry.channel] = 0;
      }

      grouped[entry.channel] += Number(entry.revenue);
    });

    return Object.entries(grouped)
      .map(([channel, revenue]) => ({
        channel,
        revenue,
        percentage:
          totals.revenue > 0
            ? (revenue / totals.revenue) * 100
            : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [currentEntries, totals.revenue]);

  const monthlyOverview = useMemo(() => {
    const year = parseDate(focusDate).getFullYear();

    return Array.from({ length: 12 }, (_, index) => {
      const monthEntries = entries.filter((entry) => {
        const date = parseDate(entry.date);

        return (
          date.getFullYear() === year &&
          date.getMonth() === index
        );
      });

      const monthTotals = calculateTotals(monthEntries);

      return {
        month: new Date(year, index, 1).toLocaleDateString(
          "en-CA",
          {
            month: "short",
          }
        ),
        ...monthTotals,
      };
    });
  }, [entries, focusDate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    const revenue = Number(form.revenue);
    const cost = Number(form.cost || 0);

    if (!form.date) {
      setError("Please select a date.");
      return;
    }

    if (!form.revenue || revenue <= 0) {
      setError("Revenue must be greater than $0.");
      return;
    }

    if (cost < 0) {
      setError("Direct costs cannot be negative.");
      return;
    }

    const newEntry = {
      id:
        window.crypto?.randomUUID?.() ||
        Date.now().toString(),
      date: form.date,
      revenue,
      cost,
      channel: form.channel,
      note: form.note.trim(),
    };

    setEntries((previous) => [newEntry, ...previous]);

    setFocusDate(form.date);

    setForm((previous) => ({
      ...previous,
      revenue: "",
      cost: "",
      note: "",
    }));
  };

  const deleteEntry = (id) => {
    setEntries((previous) =>
      previous.filter((entry) => entry.id !== id)
    );
  };

  const periodTitle = `${currentRange.start.toLocaleDateString(
    "en-CA",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  )} - ${currentRange.end.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })}`;

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
              Sales
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Record revenue, monitor gross profit and understand
              how your business is performing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setPeriod(option.value)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  period === option.value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT FORM */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Plus size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Add Sales Entry
              </h2>

              <p className="text-xs text-slate-500">
                Enter the revenue generated on a specific date.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
          >
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Revenue
              </label>

              <div className="relative">
                <DollarSign
                  size={17}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="number"
                  name="revenue"
                  min="0"
                  step="0.01"
                  value={form.revenue}
                  onChange={handleChange}
                  placeholder="250.00"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Direct Costs / COGS
              </label>

              <div className="relative">
                <DollarSign
                  size={17}
                  className="absolute left-3 top-3.5 text-slate-400"
                />

                <input
                  type="number"
                  name="cost"
                  min="0"
                  step="0.01"
                  value={form.cost}
                  onChange={handleChange}
                  placeholder="80.00"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sales Channel
              </label>

              <select
                name="channel"
                value={form.channel}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option>In-store</option>
                <option>Online</option>
                <option>Service</option>
                <option>Marketplace</option>
                <option>Wholesale</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                <Plus size={18} />
                Add Entry
              </button>
            </div>

            <div className="md:col-span-2 xl:col-span-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Note
              </label>

              <input
                type="text"
                name="note"
                value={form.note}
                onChange={handleChange}
                placeholder="Example: Weekend promotion, catering order, busy Friday..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </form>

          {error && (
            <p className="mt-4 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
        </section>

        {/* PERIOD CONTROL */}

        <section className="mb-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-blue-600" size={21} />

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
              setFocusDate(event.target.value)
            }
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
          />
        </section>

        {/* KPI CARDS */}

        <section className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <MetricCard
            title="Revenue"
            value={currency.format(totals.revenue)}
            icon={DollarSign}
            change={revenueChange}
          />

          <MetricCard
            title="Gross Profit"
            value={currency.format(totals.profit)}
            icon={TrendingUp}
          />

          <MetricCard
            title="Direct Costs"
            value={currency.format(totals.cost)}
            icon={WalletCards}
          />

          <MetricCard
            title="Gross Margin"
            value={`${totals.margin.toFixed(1)}%`}
            icon={Percent}
          />

          <MetricCard
            title="Average / Day"
            value={currency.format(averageDailyRevenue)}
            icon={ReceiptText}
          />

          <MetricCard
            title="Best Day"
            value={
              bestDay
                ? currency.format(bestDay.revenue)
                : currency.format(0)
            }
            subtitle={
              bestDay
                ? parseDate(
                    bestDay.date
                  ).toLocaleDateString("en-CA", {
                    month: "short",
                    day: "numeric",
                  })
                : "No sales yet"
            }
            icon={Trophy}
          />
        </section>

        {/* CHART */}

        <section className="mb-7 grid gap-5 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Revenue & Gross Profit
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Performance for the selected period
                </p>
              </div>

              <BarChart3 className="text-blue-600" />
            </div>

            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(value) => `$${value}`}
                  />

                  <Tooltip
                    formatter={(value) =>
                      currency.format(value)
                    }
                  />

                  <Legend />

                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#2563eb"
                    radius={[5, 5, 0, 0]}
                  />

                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Gross Profit"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHANNEL BREAKDOWN */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Sales by Channel
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Where your revenue is coming from
            </p>

            <div className="mt-6 space-y-5">
              {channelData.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-6 text-center">
                  <p className="text-sm text-slate-500">
                    Add sales entries to see your channel
                    breakdown.
                  </p>
                </div>
              ) : (
                channelData.map((item) => (
                  <div key={item.channel}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.channel}
                      </span>

                      <span className="text-sm font-semibold text-slate-900">
                        {currency.format(item.revenue)}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-right text-xs text-slate-400">
                      {item.percentage.toFixed(1)}%
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* YEAR OVERVIEW */}

        <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">
              {parseDate(focusDate).getFullYear()} Year Overview
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Revenue and gross profit by month
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
            {monthlyOverview.map((month) => (
              <div
                key={month.month}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {month.month}
                </p>

                <p className="mt-2 text-lg font-bold text-slate-900">
                  {currency.format(month.revenue)}
                </p>

                <p
                  className={`mt-1 text-xs font-medium ${
                    month.profit >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {currency.format(month.profit)} profit
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SALES HISTORY */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">
              Sales History.
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Every sales record entered into Karma360
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Revenue</th>
                  <th className="px-5 py-4">
                    Direct Cost
                  </th>
                  <th className="px-5 py-4">
                    Gross Profit
                  </th>
                  <th className="px-5 py-4">Channel</th>
                  <th className="px-5 py-4">Note</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>

              <tbody>
                {entries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-sm text-slate-400"
                    >
                      No sales have been recorded yet.
                    </td>
                  </tr>
                ) : (
                  [...entries]
                    .sort(
                      (a, b) =>
                        parseDate(b.date) -
                        parseDate(a.date)
                    )
                    .map((entry) => {
                      const profit =
                        Number(entry.revenue) -
                        Number(entry.cost);

                      return (
                        <tr
                          key={entry.id}
                          className="border-t border-slate-100 text-sm"
                        >
                          <td className="px-5 py-4 font-medium text-slate-700">
                            {parseDate(
                              entry.date
                            ).toLocaleDateString(
                              "en-CA",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>

                          <td className="px-5 py-4 font-semibold text-slate-900">
                            {currency.format(
                              entry.revenue
                            )}
                          </td>

                          <td className="px-5 py-4 text-slate-500">
                            {currency.format(entry.cost)}
                          </td>

                          <td
                            className={`px-5 py-4 font-semibold ${
                              profit >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {currency.format(profit)}
                          </td>

                          <td className="px-5 py-4">
                            <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                              {entry.channel}
                            </span>
                          </td>

                          <td className="max-w-[250px] truncate px-5 py-4 text-slate-500">
                            {entry.note || "—"}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() =>
                                deleteEntry(entry.id)
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={17} />
                            </button>
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

function MetricCard({
  title,
  value,
  icon: Icon,
  change,
  subtitle,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={20} />
        </div>

        {change !== undefined && (
          <ChangeIndicator value={change} />
        )}
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function ChangeIndicator({ value }) {
  if (value > 0) {
    return (
      <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
        <ArrowUpRight size={13} />
        {value.toFixed(1)}%
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
        <ArrowDownRight size={13} />
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
      <Minus size={13} />
      0%
    </span>
  );
}

export default Sales;