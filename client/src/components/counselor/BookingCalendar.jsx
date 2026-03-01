import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookingCalendar = ({ onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const isPast = (day) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    const todayCopy = new Date();
    todayCopy.setHours(0, 0, 0, 0);
    return date < todayCopy;
  };

  const isSelected = (day) => {
    if (!selectedDate || !day) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  return (
    <div className="card-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <ChevronLeft size={18} className="text-text-secondary" />
        </button>
        <h4 className="text-sm font-semibold text-text-primary">{monthName}</h4>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
        >
          <ChevronRight size={18} className="text-text-secondary" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-text-muted py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <button
            key={i}
            disabled={!day || isPast(day)}
            onClick={() => day && !isPast(day) && onDateSelect(new Date(year, month, day))}
            className={`
              aspect-square rounded-xl flex items-center justify-center text-xs font-medium
              transition-all duration-200
              ${!day ? '' : isPast(day)
                ? 'text-text-muted/40 cursor-not-allowed'
                : isSelected(day)
                  ? 'bg-forest-700 text-white shadow-sm shadow-forest-900'
                  : isToday(day)
                    ? 'bg-forest-800/40 text-emerald-300 font-bold'
                    : 'text-text-primary hover:bg-surface-hover hover:text-emerald-300'
              }
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookingCalendar;
