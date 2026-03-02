import Modal from '../common/Modal';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import { CalendarHeart, Clock, CheckCircle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, counselor, date, time, onConfirm }) => {
  if (!counselor) return null;

  const dateStr = date
    ? date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Booking" maxWidth="max-w-sm">
      <div className="text-center">
        <Avatar name={counselor.name} size="xl" className="mx-auto" />
        <h4 className="text-base font-semibold text-text-primary mt-3">{counselor.name}</h4>
        <p className="text-xs text-emerald-400">{counselor.specialization}</p>
      </div>

      <div className="space-y-3 mt-5">
        <div className="flex items-center gap-3 p-3 bg-forest-800/30 rounded-xl">
          <CalendarHeart size={16} className="text-emerald-400" />
          <span className="text-sm text-text-primary">{dateStr}</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-emerald-400/10 rounded-xl">
          <Clock size={16} className="text-emerald-300" />
          <span className="text-sm text-text-primary">{time}</span>
        </div>
      </div>

      <p className="text-xs text-text-muted text-center mt-4">
        You'll receive a confirmation email with session details and a meeting link.
      </p>

      <div className="flex gap-3 mt-5">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" icon={CheckCircle} onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
