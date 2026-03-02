import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const WeeklyTrend = ({ logs = [] }) => {
  const getCount = (weeksAgo, emotionLabel) => {
    const now = new Date();
    const start = new Date(
      now.getTime() - (weeksAgo + 1) * 7 * 24 * 60 * 60 * 1000,
    );
    const end = new Date(now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000);

    return logs.filter((l) => {
      const d = new Date(l.createdAt);
      return d >= start && d < end && l.label === emotionLabel;
    }).length;
  };

  const weekData = [3, 2, 1, 0].map((w, i) => ({
    week: `Week ${4 - w}`,
    happy: getCount(w, "Happy"),
    sad: getCount(w, "Sad"),
    angry: getCount(w, "Angry"),
    neutral: getCount(w, "Neutral"),
  }));

  return (
    <div className="bg-surface p-6 rounded-3xl border border-forest-800/20 h-full">
      <h3 className="text-lg font-semibold mb-6">Emotional Trends</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weekData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#243d33"
              vertical={false}
            />
            <XAxis dataKey="week" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="happy"
              stroke="#3bcc88"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="sad"
              stroke="#fca5a5"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="angry"
              stroke="#f87171"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke="#94a3b8"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyTrend;
