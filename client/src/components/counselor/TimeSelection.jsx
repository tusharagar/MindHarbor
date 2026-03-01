const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
];

const unavailable = ['10:00 AM', '2:30 PM', '11:30 AM'];

const TimeSelection = ({ selectedTime, onTimeSelect }) => {
  return (
    <div className="card-soft p-5">
      <h4 className="text-sm font-semibold text-text-primary mb-1">Select Time</h4>
      <p className="text-xs text-text-muted mb-4">Choose a convenient time slot</p>

      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map((slot) => {
          const isUnavailable = unavailable.includes(slot);
          const isActive = selectedTime === slot;

          return (
            <button
              key={slot}
              disabled={isUnavailable}
              onClick={() => onTimeSelect(slot)}
              className={`
                py-2 px-3 rounded-xl text-xs font-medium
                transition-all duration-200
                ${isUnavailable
                  ? 'bg-surface/50 text-text-muted/30 cursor-not-allowed line-through'
                  : isActive
                    ? 'bg-forest-700 text-white shadow-sm shadow-forest-900'
                    : 'bg-surface-card text-text-secondary hover:bg-surface-hover hover:text-emerald-300'
                }
              `}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSelection;
