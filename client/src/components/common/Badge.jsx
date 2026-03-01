const colorMap = {
  lavender: 'bg-forest-800/40 text-emerald-300',
  mint: 'bg-mint-500/15 text-mint-300',
  sky: 'bg-emerald-500/15 text-emerald-300',
  warm: 'bg-earth-200/15 text-earth-200',
  red: 'bg-red-500/15 text-red-300',
  gray: 'bg-surface-hover text-text-muted',
};

const Badge = ({ children, color = 'lavender', className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${colorMap[color]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
