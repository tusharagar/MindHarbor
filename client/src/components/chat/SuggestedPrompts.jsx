const prompts = [
  "I'm feeling stressed about exams",
  "I can't sleep well lately",
  "I feel lonely sometimes",
  "Help me with a breathing exercise",
  "I want to talk about my anxiety",
  "How can I improve my focus?",
];

const SuggestedPrompts = ({ onSelect }) => {
  return (
    <div className="px-4 py-3">
      <p className="text-xs font-medium text-text-muted mb-2">Try saying...</p>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="
              px-3 py-1.5 rounded-full text-xs font-medium
              bg-forest-800/40 text-emerald-300
              hover:bg-forest-700/50
              transition-all duration-200
            "
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;
