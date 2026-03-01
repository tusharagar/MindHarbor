import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = 'Search anything...', value, onChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full pl-10 pr-4 py-2.5
          bg-surface-card rounded-xl
          text-sm text-text-primary placeholder:text-text-muted
          focus:outline-none focus:ring-2 focus:ring-forest-600
          transition-all duration-200
        "
      />
    </div>
  );
};

export default SearchBar;
