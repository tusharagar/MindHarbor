import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { day: 'Mon', mood: 4, emoji: '😌' },
  { day: 'Tue', mood: 3, emoji: '😐' },
  { day: 'Wed', mood: 5, emoji: '😊' },
  { day: 'Thu', mood: 2, emoji: '😔' },
  { day: 'Fri', mood: 4, emoji: '😌' },
  { day: 'Sat', mood: 5, emoji: '😊' },
  { day: 'Sun', mood: 4, emoji: '😌' },
];

const colors = ['#3bcc88', '#73e2ad', '#86efac', '#c4a87a', '#3bcc88', '#86efac', '#73e2ad'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const entry = data.find((d) => d.day === label);
    return (
      <div className="card-elevated px-3 py-2 text-xs">
        <p className="font-medium">{label}: {entry?.emoji} ({payload[0].value}/5)</p>
      </div>
    );
  }
  return null;
};

const MoodHistory = () => {
  return (
    <div>
      <p className="section-label text-text-muted mb-1">Past week</p>
      <h3 className="text-lg font-semibold text-text-primary mb-6">Mood History</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <BarChart data={data} barCategoryGap="25%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#637d70' }}
            />
            <YAxis domain={[0, 5]} hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="mood" radius={[8, 8, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i]} fillOpacity={0.6} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MoodHistory;
