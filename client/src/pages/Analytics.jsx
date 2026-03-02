import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import ProgressBar from "../components/common/ProgressBar";
import { Heart, Brain, Star, AlertTriangle } from "lucide-react";
import { analyticsService } from "../services/analyticsService";

const tooltipStyle = {
  borderRadius: "12px",
  border: "none",
  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
  fontSize: "12px",
  background: "#142a21",
  color: "#e4ede8",
};

// Map raw NLP score (range ~-3 to +3) → 0–10 for display
// Adjust the +3 offset and /6 divisor if your model's range differs
const normalizeScore = (score) =>
  Math.min(Math.max(((score + 3) / 6) * 10, 0), 10).toFixed(1);

const trendColor = {
  improving: "text-emerald-400",
  declining: "text-red-400",
  stable: "text-amber-400",
};
const trendEmoji = { improving: "📈", declining: "📉", stable: "➡️" };

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsService
      .getAnalytics()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Build chart data — each point is one session's average score normalized to 0-10
  const chartData =
    data?.sessions?.map((s, i) => ({
      session: `S${i + 1}`,
      score: parseFloat(normalizeScore(s.mentalScore)),
      rawScore: s.mentalScore.toFixed(2),
      date: new Date(s.date).toLocaleDateString("en-IN"),
      status: s.status,
    })) || [];

  const normalizedAvg =
    data?.averageScore != null ? normalizeScore(data.averageScore) : "—";
  const normalizedLast =
    data?.lastScore != null ? normalizeScore(data.lastScore) : "—";
  const normalizedFirst =
    data?.firstScore != null ? normalizeScore(data.firstScore) : null;

  return (
    <div>
      {/* ── Hero ── */}
      <section className="gradient-hero px-5 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="max-w-5xl">
          <p className="section-label text-emerald-400 mb-2">Your journey</p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            Analytics
          </h1>
          <p className="text-base text-text-secondary mt-2 max-w-lg">
            Your mental wellness journey — you're doing great! 🌟
          </p>

          {!loading && data && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
              {[
                {
                  label: "Avg Wellness",
                  value: normalizedAvg,
                  unit: "/10",
                  icon: Heart,
                  accent: "text-emerald-400",
                  trend: data.trend
                    ? `${trendEmoji[data.trend]} ${data.trend}`
                    : "",
                },
                {
                  label: "Sessions",
                  value: data.sessions.length,
                  unit: "analyzed",
                  icon: Brain,
                  accent: "text-emerald-300",
                  trend: "",
                },
                {
                  label: "Distress",
                  value: data.distressSessions ?? 0,
                  unit: "sessions",
                  icon: AlertTriangle,
                  accent:
                    data.distressSessions > 0
                      ? "text-red-400"
                      : "text-emerald-400",
                  trend:
                    data.distressSessions > 0
                      ? "⚠️ Seek support"
                      : "✅ All clear",
                },
                {
                  label: "Latest Score",
                  value: normalizedLast,
                  unit: "/10",
                  icon: Star,
                  accent: "text-amber-400",
                  trend: "",
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon
                      size={14}
                      className={stat.accent}
                      strokeWidth={1.8}
                    />
                    <span className="text-xs text-text-muted uppercase tracking-wider">
                      {stat.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-sm text-text-muted">{stat.unit}</span>
                  </div>
                  {stat.trend && (
                    <span
                      className={`text-xs mt-1 inline-block ${trendColor[data.trend] || "text-text-muted"}`}
                    >
                      {stat.trend}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="content-contained space-y-14 py-10">
        {/* ── Score Chart ── */}
        {chartData.length > 0 && (
          <section>
            <p className="section-label text-text-muted mb-1">Session trend</p>
            <h3 className="text-lg font-semibold text-text-primary mb-6">
              Mental Wellness Score Over Sessions
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="scoreGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#3bcc88"
                        stopOpacity={0.25}
                      />
                      <stop offset="95%" stopColor="#3bcc88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#243d33"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="session"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#637d70" }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#637d70" }}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v, _, props) => [
                      `${v}/10 (raw: ${props.payload.rawScore}) — ${props.payload.date}`,
                      "Wellness",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#3bcc88"
                    strokeWidth={2}
                    fill="url(#scoreGradient)"
                    dot={{ r: 4, fill: "#3bcc88" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ── Progress Bars ── */}
        {data && data.sessions.length > 0 && (
          <section>
            <p className="section-label text-text-muted mb-1">Milestones</p>
            <h3 className="text-lg font-semibold text-text-primary mb-6">
              Your Progress
            </h3>
            <div className="space-y-5 max-w-2xl">
              <ProgressBar
                value={parseFloat(normalizedAvg) * 10}
                label="Average Wellness Score"
                color="lavender"
              />
              <ProgressBar
                value={parseFloat(normalizedLast) * 10}
                label="Latest Session Score"
                color="mint"
              />
              <ProgressBar
                value={
                  normalizedFirst
                    ? Math.min(
                        Math.max(
                          ((parseFloat(normalizedLast) -
                            parseFloat(normalizedFirst)) /
                            10) *
                            100 +
                            50,
                          0,
                        ),
                        100,
                      )
                    : 50
                }
                label="Improvement vs First Session"
                color="sky"
              />
              <ProgressBar
                value={Math.min(data.sessions.length * 10, 100)}
                label="Session Consistency"
                color="warm"
              />
            </div>
          </section>
        )}

        {/* ── Empty state ── */}
        {!loading && (!data || data.sessions.length === 0) && (
          <section className="text-center py-20">
            <p className="text-4xl mb-3">🧘</p>
            <h3 className="text-lg font-semibold text-text-primary">
              No data yet
            </h3>
            <p className="text-sm text-text-muted mt-2">
              Complete a chat session to start seeing your wellness analytics.
            </p>
          </section>
        )}
      </div>
    </div>
  );
};

export default Analytics;
