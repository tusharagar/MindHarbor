import { useState } from 'react';
import Button from '../common/Button';

const moods = [
  { emoji: '😊', label: 'Happy', color: 'bg-mint-400/10 hover:bg-mint-400/20' },
  { emoji: '😌', label: 'Calm', color: 'bg-emerald-400/10 hover:bg-emerald-400/20' },
  { emoji: '🥰', label: 'Loved', color: 'bg-red-400/8 hover:bg-red-400/15' },
  { emoji: '😐', label: 'Neutral', color: 'bg-earth-200/10 hover:bg-earth-200/20' },
  { emoji: '😔', label: 'Sad', color: 'bg-forest-600/15 hover:bg-forest-600/25' },
  { emoji: '😰', label: 'Anxious', color: 'bg-amber-400/8 hover:bg-amber-400/15' },
  { emoji: '😡', label: 'Angry', color: 'bg-red-400/8 hover:bg-red-400/15' },
  { emoji: '😴', label: 'Tired', color: 'bg-surface-hover hover:bg-surface-raised' },
];

const MoodButtons = ({ onLog }) => {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [logged, setLogged] = useState(false);

  const handleLog = () => {
    if (selected !== null) {
      if (onLog) onLog({ mood: moods[selected], note });
      setLogged(true);
      setTimeout(() => setLogged(false), 3000);
    }
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">Log Your Mood</h3>
      <p className="text-xs text-text-muted mb-4">How are you feeling right now?</p>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {moods.map((mood, i) => (
          <button
            key={mood.label}
            onClick={() => { setSelected(i); setLogged(false); }}
            className={`
              flex flex-col items-center gap-1 p-3 rounded-xl
              transition-all duration-200
              ${selected === i
                ? `${mood.color} ring-2 ring-forest-500 scale-105`
                : `hover:bg-surface-hover/60`
              }
            `}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[10px] font-medium text-text-secondary">{mood.label}</span>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="animate-fade-in">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about how you feel... (optional)"
            className="
              w-full p-3 rounded-xl
              text-sm text-text-primary placeholder:text-text-muted
              resize-none h-20 bg-surface
              focus:outline-none focus:ring-2 focus:ring-forest-600
              transition-all duration-200 mb-3
            "
          />
          <Button onClick={handleLog}>
            Log Mood {moods[selected].emoji}
          </Button>
        </div>
      )}

      {logged && (
        <div className="mt-3 p-3 bg-mint-400/10 rounded-xl animate-slide-up">
          <p className="text-xs text-emerald-300 text-center">
            ✅ Mood logged successfully! Keep tracking — it helps 💜
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodButtons;
