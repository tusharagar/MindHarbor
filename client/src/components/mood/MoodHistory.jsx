import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MoodHistory = ({ logs = [] }) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const chartData = days.map((dayName, index) => {
    const dayLogs = logs.filter(
      (l) => new Date(l.createdAt).getDay() === index,
    );
    // Calculate average mood value (0-6 scale from mood.model.js)
    const avg = dayLogs.length
      ? dayLogs.reduce((a, b) => a + b.value, 0) / dayLogs.length
      : 0;
    return { day: dayName, mood: parseFloat(avg.toFixed(1)) };
  });

  return (
    <div className="bg-surface p-6 rounded-3xl border border-forest-800/20 h-full">
      <h3 className="text-lg font-semibold mb-6">Weekly Intensity</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#637d70" }}
            />
            <YAxis domain={[0, 6]} hide />
            <Tooltip />
            <Bar dataKey="mood" fill="#3bcc88" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodHistory;
