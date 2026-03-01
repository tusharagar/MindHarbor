import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import ProgressBar from '../components/common/ProgressBar';
import { TrendingUp, Heart, Brain, Star, Sparkles } from 'lucide-react';

// Mood over time
const moodOverTime = [
  { date: 'Jan', score: 3.2 },
  { date: 'Feb', score: 3.5 },
  { date: 'Mar', score: 3.1 },
  { date: 'Apr', score: 3.8 },
  { date: 'May', score: 4.0 },
  { date: 'Jun', score: 3.7 },
  { date: 'Jul', score: 4.2 },
  { date: 'Aug', score: 4.1 },
];

// Emotion distribution
const emotionDist = [
  { name: 'Happy', value: 35, color: '#3bcc88' },
  { name: 'Calm', value: 25, color: '#73e2ad' },
  { name: 'Neutral', value: 20, color: '#c4a87a' },
  { name: 'Anxious', value: 12, color: '#fca5a5' },
  { name: 'Sad', value: 8, color: '#6fa88a' },
];

// Weekly activity
const weeklyActivity = [
  { day: 'Mon', sessions: 3 },
  { day: 'Tue', sessions: 2 },
  { day: 'Wed', sessions: 4 },
  { day: 'Thu', sessions: 1 },
  { day: 'Fri', sessions: 5 },
  { day: 'Sat', sessions: 2 },
  { day: 'Sun', sessions: 3 },
];

const stats = [
  { label: 'Mood Score', value: '4.2', unit: '/5', icon: Heart, accent: 'text-emerald-400', trend: '+0.3' },
  { label: 'Sessions', value: '18', unit: 'this month', icon: Brain, accent: 'text-emerald-300', trend: '+5' },
  { label: 'Streak', value: '7', unit: 'days', icon: Star, accent: 'text-amber-400', trend: 'Best yet!' },
  { label: 'Wellness', value: '82', unit: '%', icon: TrendingUp, accent: 'text-mint-300', trend: '+8%' },
];

const tooltipStyle = {
  borderRadius: '12px',
  border: 'none',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  fontSize: '12px',
  background: '#142a21',
  color: '#e4ede8',
};

const Analytics = () => {
  return (
    <div>
      {/* Hero-style header with stats */}
      <section className="gradient-hero px-5 lg:px-8 pt-10 pb-16 lg:pt-14 lg:pb-20">
        <div className="max-w-5xl">
          <p className="section-label text-emerald-400 mb-2">Your journey</p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            Analytics
          </h1>
          <p className="text-base text-text-secondary mt-2 max-w-lg">
            Your mental wellness journey — you're doing great! 🌟
          </p>

          {/* Stat numbers — large, no cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon size={14} className={stat.accent} strokeWidth={1.8} />
                  <span className="text-xs text-text-muted uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-sm text-text-muted">{stat.unit}</span>
                </div>
                <span className="text-xs text-emerald-400 mt-1 inline-block">{stat.trend}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="content-contained space-y-14 py-10">
        {/* Mood over time — open chart */}
        <section>
          <p className="section-label text-text-muted mb-1">8-month trend</p>
          <h3 className="text-lg font-semibold text-text-primary mb-6">Mood Patterns Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={moodOverTime}>
                <defs>
                  <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3bcc88" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3bcc88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#243d33" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#637d70' }} />
                <YAxis domain={[1, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#637d70' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke="#3bcc88" strokeWidth={2} fill="url(#analyticsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Asymmetric: Emotion distribution (wide) + Weekly activity (narrow) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="section-label text-text-muted mb-1">Breakdown</p>
            <h3 className="text-lg font-semibold text-text-primary mb-6">Emotion Distribution</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={emotionDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {emotionDist.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="section-label text-text-muted mb-1">This week</p>
            <h3 className="text-lg font-semibold text-text-primary mb-6">Weekly Activity</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={weeklyActivity} barCategoryGap="25%">
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#637d70' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="sessions" fill="#3bcc88" radius={[8, 8, 0, 0]} fillOpacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Progress — open section */}
        <section>
          <p className="section-label text-text-muted mb-1">Milestones</p>
          <h3 className="text-lg font-semibold text-text-primary mb-6">Your Progress</h3>
          <div className="space-y-5 max-w-2xl">
            <ProgressBar value={82} label="Overall Wellness" color="lavender" />
            <ProgressBar value={90} label="Mood Logging Consistency" color="mint" />
            <ProgressBar value={65} label="Resource Engagement" color="sky" />
            <ProgressBar value={45} label="Counselor Sessions Completed" color="warm" />
          </div>
        </section>

        {/* Positive reinforcement — full-width tinted band */}
        <section className="surface-tint rounded-2xl px-6 py-8 text-center">
          <Sparkles size={20} className="text-emerald-400 mx-auto mb-3" strokeWidth={1.8} />
          <h3 className="text-lg font-semibold text-text-primary">You're Making Progress!</h3>
          <p className="text-sm text-text-secondary mt-2 max-w-md mx-auto leading-relaxed">
            Your mood score has improved by 0.3 points this month. Consistency is key —
            keep checking in with yourself. You're doing amazing! 💚
          </p>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
