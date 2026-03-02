import ProgressBar from "../common/ProgressBar";

const emojiMap = {
  Angry: "😡",
  Disgust: "🤢",
  Fear: "😨",
  Happy: "😊",
  Neutral: "😐",
  Sad: "😔",
  Surprise: "😲",
};

const EmotionResult = ({ result }) => {
  if (!result) {
    return (
      <div className="bg-surface-raised rounded-2xl p-5 flex items-center justify-center min-h-[200px] border border-forest-800/20">
        <div className="text-center">
          <p className="text-4xl mb-2">🔍</p>
          <p className="text-sm text-text-secondary font-medium">
            No detection yet
          </p>
          <p className="text-xs text-text-muted mt-1">
            Capture your mood via camera or log manually
          </p>
        </div>
      </div>
    );
  }

  const emoji = emojiMap[result.label] || "😐";
  const emotion = result.label || "Unknown";

  return (
    <div className="bg-surface-raised rounded-2xl p-5 border border-forest-800/30 animate-slide-up">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Detection Result
      </h3>
      <div className="text-center mb-6">
        <span className="text-6xl drop-shadow-lg">{emoji}</span>
        <p className="text-xl font-bold text-text-primary mt-3">{emotion}</p>
      </div>

      {result.confidence && (
        <ProgressBar
          value={result.confidence * 100}
          max={100}
          color="lavender"
          label="Confidence Score"
          className="mb-4"
        />
      )}

      <div className="bg-forest-900/40 border border-emerald-500/10 rounded-xl p-4">
        <p className="text-xs text-emerald-300 text-center leading-relaxed">
          💜 It's perfectly okay to feel{" "}
          <span className="font-bold">{emotion.toLowerCase()}</span>. <br />
          Your feelings are valid and we're here to track them with you.
        </p>
      </div>
    </div>
  );
};

export default EmotionResult;
