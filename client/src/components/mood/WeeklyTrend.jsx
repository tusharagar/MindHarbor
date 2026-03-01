import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const weekData = [
  { week: 'Week 1', happy: 3, calm: 2, anxious: 1 },
  { week: 'Week 2', happy: 4, calm: 3, anxious: 2 },
  { week: 'Week 3', happy: 3, calm: 4, anxious: 1 },
  { week: 'Week 4', happy: 5, calm: 3, anxious: 0 },
];

const tooltipStyle = {
  borderRadius: '12px',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  fontSize: '12px',
  background: '#142a21',
  color: '#e4ede8',
};

const WeeklyTrend = () => {
  return (
    <div>
      <p className="section-label text-text-muted mb-1">4-week view</p>
      <h3 className="text-lg font-semibold text-text-primary mb-4">Weekly Emotional Trends</h3>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-text-muted">Happy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-mint-300" />
          <span className="text-xs text-text-muted">Calm</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-300" />
          <span className="text-xs text-text-muted">Anxious</span>
        </div>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#243d33" vertical={false} />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#637d70' }}
            />
            <YAxis domain={[0, 5]} hide />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="happy" stroke="#3bcc88" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="calm" stroke="#86efac" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="anxious" stroke="#fca5a5" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyTrend;
