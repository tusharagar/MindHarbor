import ProgressBar from '../common/ProgressBar';

const EmotionResult = ({ result }) => {
  if (!result) {
    return (
      <div className="rounded-2xl p-5 flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <p className="text-4xl mb-2">🔍</p>
          <p className="text-sm text-text-secondary">No detection yet</p>
          <p className="text-xs text-text-muted mt-1">
            Use the camera or log your mood manually
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 animate-slide-up">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Detection Result</h3>

      <div className="text-center mb-4">
        <span className="text-5xl">{result.emoji}</span>
        <p className="text-lg font-semibold text-text-primary mt-2">{result.emotion}</p>
      </div>

      <ProgressBar
        value={result.confidence}
        max={100}
        color="lavender"
        label="Confidence Score"
        className="mb-4"
      />

      <div className="bg-forest-800/30 rounded-xl p-3">
        <p className="text-xs text-emerald-300 text-center">
          💜 It's perfectly okay to feel {result.emotion.toLowerCase()}. We're here for you.
        </p>
      </div>
    </div>
  );
};

export default EmotionResult;
