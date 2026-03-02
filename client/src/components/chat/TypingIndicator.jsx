const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
        <span className="text-white text-sm">🤖</span>
      </div>
      <div className="bg-surface-raised rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-emerald-400 rounded-full"
            style={{ animation: 'typing 1.4s infinite 0s' }}
          />
          <span
            className="w-2 h-2 bg-emerald-400 rounded-full"
            style={{ animation: 'typing 1.4s infinite 0.2s' }}
          />
          <span
            className="w-2 h-2 bg-emerald-400 rounded-full"
            style={{ animation: 'typing 1.4s infinite 0.4s' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
