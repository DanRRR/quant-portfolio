"""
Vercel serverless function: GET /api/quote?symbols=SPY,QQQ,TLT

Returns a JSON snapshot for each symbol with last close, % change vs prior
close, and ~30 trading days of history. Source: Stooq (no API key required).

Run locally with `vercel dev` so this is mounted alongside Next.js at /api/quote.
"""
from __future__ import annotations

import csv
import io
import json
import os
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler

# --- config -----------------------------------------------------------------

DEFAULT_SYMBOLS = ("SPY", "QQQ", "TLT")
HISTORY_DAYS = 30
TIMEOUT_S = 8


def _stooq_url(symbol: str) -> str:
    # Stooq US tickers use the ".us" suffix and lowercase
    s = symbol.lower()
    if "." not in s:
        s = f"{s}.us"
    qs = urllib.parse.urlencode({"s": s, "i": "d"})
    return f"https://stooq.com/q/d/l/?{qs}"


def _fetch_csv(symbol: str) -> list[dict]:
    req = urllib.request.Request(
        _stooq_url(symbol),
        headers={"User-Agent": "quant-portfolio/1.0 (+https://danruksujarit.com)"},
    )
    with urllib.request.urlopen(req, timeout=TIMEOUT_S) as resp:
        body = resp.read().decode("utf-8", errors="replace")
    rows = list(csv.DictReader(io.StringIO(body)))
    # Stooq returns oldest -> newest; keep last N rows
    return rows[-HISTORY_DAYS:]


def _shape_quote(symbol: str, rows: list[dict]) -> dict:
    history = [
        {"t": r["Date"], "close": float(r["Close"])}
        for r in rows
        if r.get("Close") and r.get("Date")
    ]
    if len(history) < 2:
        raise ValueError(f"insufficient data for {symbol}")
    last = history[-1]["close"]
    prev = history[-2]["close"]
    change_pct = (last / prev - 1.0) * 100.0
    return {
        "symbol": symbol.upper(),
        "last": last,
        "change_pct": change_pct,
        "history": history,
    }


# --- handler ----------------------------------------------------------------


class handler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802 (Vercel Python contract)
        try:
            parsed = urllib.parse.urlparse(self.path)
            params = urllib.parse.parse_qs(parsed.query)
            symbols_param = params.get("symbols", [",".join(DEFAULT_SYMBOLS)])[0]
            symbols = [s.strip() for s in symbols_param.split(",") if s.strip()]
            symbols = symbols[:8]  # cap

            quotes = []
            errors = []
            for sym in symbols:
                try:
                    rows = _fetch_csv(sym)
                    quotes.append(_shape_quote(sym, rows))
                except Exception as e:  # noqa: BLE001
                    errors.append({"symbol": sym, "error": str(e)})

            payload = {
                "as_of": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "quotes": quotes,
                "errors": errors,
            }
            body = json.dumps(payload).encode("utf-8")

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Cache-Control", "public, s-maxage=300, stale-while-revalidate=900")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except Exception as e:  # noqa: BLE001
            err = json.dumps({"error": str(e)}).encode("utf-8")
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(err)))
            self.end_headers()
            self.wfile.write(err)
