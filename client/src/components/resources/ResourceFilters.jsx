const categories = [
  "All",
  "Happy",
  "Sad",
  "Angry",
  "Fear",
  "Surprise",
  "Neutral",
];
const types = [
  "All Types",
  "Videos",
  "Audio",
  "Posters",
  "Guides",
  "Books",
  "Quotes",
];

const ResourceFilters = ({
  activeCategory,
  onCategoryChange,
  activeType,
  onTypeChange,
}) => {
  return (
    <div className="space-y-3">
      {/* Category filters */}
      <div>
        <p className="text-xs font-medium text-text-muted mb-2">
          Filter by mood / category
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200
                ${
                  activeCategory === cat
                    ? "bg-forest-700 text-white shadow-sm shadow-forest-900"
                    : "bg-surface-card/60 text-text-secondary hover:bg-surface-hover hover:text-emerald-300"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Type filters */}
      <div>
        <p className="text-xs font-medium text-text-muted mb-2">
          Resource type
        </p>
        <div className="flex gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => onTypeChange(type)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200
                ${
                  activeType === type
                    ? "bg-emerald-500 text-white shadow-sm shadow-forest-900"
                    : "bg-surface-card/60 text-text-secondary hover:bg-surface-hover hover:text-emerald-300"
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceFilters;
