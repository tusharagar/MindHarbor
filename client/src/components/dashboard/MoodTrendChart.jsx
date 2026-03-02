import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { moodService } from "../../services/moodService";

const moodLabels = {
  0: "😡",
  1: "🤢",
  2: "😨",
  3: "😊",
  4: "😐",
  5: "😔",
  6: "😲",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const moodVal = payload[0].value;
    return (
      <div className="card-elevated px-3 py-2 text-xs">
        <p className="font-medium text-text-primary">{label}</p>
        <p className="text-text-secondary">
          {moodLabels[Math.round(moodVal)] || "😐"} Mood: {moodVal.toFixed(1)}/6
        </p>
      </div>
    );
  }
  return null;
};

const MoodTrendChart = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await moodService.getMoods();
        const moods = response.data.data || [];

        // Group moods by day of the week for the last 7 days
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const today = new Date();
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayIndex = date.getDay();

          const dayMoods = moods.filter((m) => {
            const moodDate = new Date(m.createdAt);
            return moodDate.toDateString() === date.toDateString();
          });

          const avgMood = dayMoods.length
            ? dayMoods.reduce((sum, m) => sum + m.value, 0) / dayMoods.length
            : null;

          last7Days.push({
            day: days[dayIndex],
            mood: avgMood !== null ? parseFloat(avgMood.toFixed(1)) : 0,
          });
        }

        setData(last7Days);
      } catch (error) {
        console.error("Failed to fetch mood data:", error);
        // Fallback to empty data
        setData([
          { day: "Mon", mood: 0 },
          { day: "Tue", mood: 0 },
          { day: "Wed", mood: 0 },
          { day: "Thu", mood: 0 },
          { day: "Fri", mood: 0 },
          { day: "Sat", mood: 0 },
          { day: "Sun", mood: 0 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <p className="section-label text-text-muted mb-1">This week</p>
          <h3 className="text-lg font-semibold text-text-primary">
            Mood Trend
          </h3>
        </div>
        <span
          onClick={() => navigate("/analytics")}
          className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors"
        >
          View all →
        </span>
      </div>
      {loading ? (
        <div className="h-56 flex items-center justify-center text-text-muted text-sm">
          Loading mood data...
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3bcc88" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3bcc88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#637d70" }}
              />
              <YAxis domain={[0, 6]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#3bcc88"
                strokeWidth={2}
                fill="url(#moodGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MoodTrendChart;
