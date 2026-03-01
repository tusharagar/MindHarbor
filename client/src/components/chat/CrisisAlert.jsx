import { AlertTriangle, Phone } from 'lucide-react';
import Button from '../common/Button';

const CrisisAlert = ({ onDismiss }) => {
  return (
    <div className="mx-4 mt-2 p-4 bg-red-500/10 rounded-2xl animate-slide-up">
      <div className="flex items-start gap-3">
          <div className="p-2 bg-red-500/15 rounded-xl flex-shrink-0">
          <AlertTriangle size={18} className="text-red-500" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-red-400">We're here for you</h4>
          <p className="text-xs text-red-300 mt-1 leading-relaxed">
            It sounds like you might be going through a difficult time. If you're in crisis,
            please reach out to a professional immediately. You don't have to face this alone.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="danger" size="sm" icon={Phone}>
              <a href="tel:9152987821">iCall: 9152987821</a>
            </Button>
            <Button variant="secondary" size="sm" onClick={onDismiss}>
              I'm okay, continue chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisAlert;
