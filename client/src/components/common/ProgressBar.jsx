const ProgressBar = ({ value = 0, max = 100, color = 'lavender', label, className = '' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorMap = {
    lavender: 'bg-emerald-400',
    mint: 'bg-mint-400',
    sky: 'bg-emerald-500',
    warm: 'bg-earth-300',
  };

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-text-secondary">{label}</span>
          <span className="text-xs text-text-muted">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-forest-800/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorMap[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
