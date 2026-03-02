const variants = {
  primary:
    'bg-forest-700 text-white hover:bg-forest-600 shadow-sm shadow-forest-900',
  secondary:
    'bg-surface-hover text-emerald-300 border border-forest-600 hover:bg-surface-raised',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-hover',
  mint:
    'bg-mint-500/80 text-white hover:bg-mint-500 shadow-sm shadow-forest-900',
  sky:
    'bg-emerald-500/80 text-white hover:bg-emerald-500 shadow-sm shadow-forest-900',
  danger:
    'bg-red-500/80 text-white hover:bg-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-xl
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:ring-offset-2 focus:ring-offset-surface
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={16} />}
    </button>
  );
};

export default Button;
