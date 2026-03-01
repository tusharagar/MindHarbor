import { Star, Calendar } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';

const CounselorCard = ({ counselor, onBook }) => {
  return (
    <div className="card-soft p-5 hover:bg-surface-hover/30 transition-all duration-200">
      <div className="flex items-start gap-4">
        <Avatar name={counselor.name} size="xl" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary">{counselor.name}</h4>
          <p className="text-xs text-emerald-400 font-medium">{counselor.specialization}</p>
          <p className="text-xs text-text-muted mt-1">{counselor.qualification}</p>

          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-text-primary">{counselor.rating}</span>
            </div>
            <span className="text-xs text-text-muted">{counselor.experience} yrs exp</span>
            <Badge color={counselor.available ? 'mint' : 'gray'}>
              {counselor.available ? 'Available' : 'Busy'}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {counselor.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 bg-forest-800/30 text-emerald-300 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              size="sm"
              icon={Calendar}
              onClick={() => onBook(counselor)}
              disabled={!counselor.available}
            >
              Book Session
            </Button>
            <Button variant="ghost" size="sm">
              View Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounselorCard;
