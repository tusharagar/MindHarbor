const Card = ({ children, className = '', gradient = '', onClick, hover = false, variant = 'default' }) => {
  const base = variant === 'elevated' ? 'card-elevated' : variant === 'ghost' ? '' : 'card-soft';

  return (
    <div
      onClick={onClick}
      className={`
        ${base} p-5
        ${gradient}
        ${hover ? 'cursor-pointer hover:bg-surface-hover/50 hover:-translate-y-0.5 transition-all duration-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
