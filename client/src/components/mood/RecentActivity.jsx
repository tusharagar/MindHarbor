import { Clock, Camera, Edit3 } from "lucide-react";

const emojiMap = {
  Angry: "😡",
  Disgust: "🤢",
  Fear: "😨",
  Happy: "😊",
  Neutral: "😐",
  Sad: "😔",
  Surprise: "😲",
};

const RecentActivity = ({ logs = [] }) => {
  const recent = logs.slice(0, 5);

  return (
    <div className="bg-surface-raised rounded-2xl p-6 border border-forest-800/20">
      <h3 className="text-lg font-semibold text-text-primary mb-5">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {recent.length === 0 ? (
          <p className="text-xs text-text-muted italic text-center py-4">
            No activity yet...
          </p>
        ) : (
          recent.map((log) => (
            <div
              key={log._id || Math.random()}
              className="flex items-center justify-between p-3 rounded-xl bg-forest-900/20 border border-forest-700/20"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emojiMap[log.label] || "😐"}</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {log.label}
                  </p>
                  <p className="text-[10px] text-text-muted flex items-center gap-1">
                    <Clock size={10} />{" "}
                    {new Date(log.createdAt || Date.now()).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                </div>
              </div>
              {log.capturedVia === "ai" ? (
                <Camera size={14} className="text-emerald-400" />
              ) : (
                <Edit3 size={14} className="text-mint-300" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
