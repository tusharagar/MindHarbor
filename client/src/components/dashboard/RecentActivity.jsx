import {
  MessageCircleHeart,
  SmilePlus,
  CalendarHeart,
  BookOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { moodService } from "../../services/moodService";

const emojiMap = {
  Angry: "😡",
  Disgust: "🤢",
  Fear: "😨",
  Happy: "😊",
  Neutral: "😐",
  Sad: "😔",
  Surprise: "😲",
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentMoods = async () => {
      try {
        const response = await moodService.getMoods();
        const moods = response.data.data || [];

        // Convert moods to activity format, take only recent 4
        const moodActivities = moods.slice(0, 4).map((mood) => {
          const timeAgo = getTimeAgo(new Date(mood.createdAt));
          return {
            icon: SmilePlus,
            text: `You logged your mood as ${mood.label} ${emojiMap[mood.label] || ""}`,
            time: timeAgo,
            accent: mood.value >= 3 ? "text-mint-300" : "text-earth-200",
          };
        });

        setActivities(moodActivities);
      } catch (error) {
        console.error("Failed to fetch recent moods:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMoods();
  }, []);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 172800) return "Yesterday";
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  return (
    <div>
      <p className="section-label text-text-muted mb-1">Your history</p>
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        Recent Activity
      </h3>

      {loading ? (
        <div className="text-center py-8 text-text-muted text-sm">
          Loading activities...
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 text-text-muted text-sm">
          No recent activities yet
        </div>
      ) : (
        <div className="relative pl-5">
          {/* Vertical timeline line */}
          <div className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-emerald-500/30 to-transparent" />

          <div className="space-y-5">
            {activities.map((activity, i) => (
              <div
                key={i}
                className="relative flex items-start gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Dot on timeline */}
                <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-emerald-500/40" />
                <activity.icon
                  size={15}
                  className={`${activity.accent} mt-0.5 shrink-0`}
                  strokeWidth={1.8}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary leading-snug">
                    {activity.text}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
