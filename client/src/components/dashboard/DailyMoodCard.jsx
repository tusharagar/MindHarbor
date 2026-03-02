import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircleHeart } from "lucide-react";

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😐", label: "Neutral" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😢", label: "Anxious" },
];

const DailyMoodCard = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleChatWithAI = () => {
    if (selected === null) return;

    const selectedMood = moods[selected];
    navigate("/chat", {
      state: {
        moodContext: {
          emoji: selectedMood.emoji,
          label: selectedMood.label,
        },
      },
    });
  };

  return (
    <div>
      <p className="text-sm text-text-secondary mb-3">
        How are you feeling right now?
      </p>
      <div className="flex gap-3 flex-wrap">
        {moods.map((mood, i) => (
          <button
            key={mood.label}
            onClick={() => setSelected(i)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full
              transition-all duration-200 text-sm
              ${
                selected === i
                  ? "bg-emerald-400/15 text-emerald-300 scale-105"
                  : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary"
              }
            `}
          >
            <span className="text-xl">{mood.emoji}</span>
            <span className="font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className="mt-4 animate-fade-in space-y-3">
          <p className="text-sm text-emerald-400/80">
            Feeling {moods[selected].label.toLowerCase()} — that's completely
            okay 💜
          </p>
          <button
            onClick={handleChatWithAI}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 transition-all duration-200 text-sm font-medium group"
          >
            <MessageCircleHeart
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            Chat with AI about how you feel
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyMoodCard;
