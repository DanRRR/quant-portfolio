"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Quote = {
  symbol: string;
  last: number;
  change_pct: number;
  history: { t: string; close: number }[];
};

type ApiResponse = { quotes: Quote[]; as_of: string };

export default function MarketSnapshot() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quote?symbols=SPY,QQQ,TLT")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((json: ApiResponse) => {
        if (!cancelled) setData(json);
      })
      .catch((e) => {
        if (!cancelled) setError(String(e));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="text-sm text-red-400 border border-[var(--color-border)] rounded-md p-3">
        Failed to load market data: {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="text-sm text-[var(--color-fg-muted)] border border-[var(--color-border)] rounded-md p-3">
        Loading…
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] rounded-md p-4 bg-[var(--color-surface)]">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data.quotes.map((q) => (
          <div key={q.symbol}>
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-sm">{q.symbol}</span>
              <span
                className={
                  "text-xs " +
                  (q.change_pct >= 0 ? "text-emerald-400" : "text-rose-400")
                }
              >
                {q.change_pct >= 0 ? "+" : ""}
                {q.change_pct.toFixed(2)}%
              </span>
            </div>
            <div className="text-xl font-semibold">
              {q.last.toFixed(2)}
            </div>
            <div className="h-16 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={q.history}>
                  <CartesianGrid stroke="#1f242b" vertical={false} />
                  <XAxis dataKey="t" hide />
                  <YAxis hide domain={["dataMin", "dataMax"]} />
                  <Tooltip
                    contentStyle={{
                      background: "#0b0d10",
                      border: "1px solid #1f242b",
                      fontSize: 12,
                    }}
                    labelStyle={{ color: "#9aa3ad" }}
                    formatter={(v: number) => v.toFixed(2)}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke={q.change_pct >= 0 ? "#4ade80" : "#fb7185"}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
      <div className="text-xs text-[var(--color-fg-muted)] mt-3">
        as of {data.as_of}
      </div>
    </div>
  );
}
