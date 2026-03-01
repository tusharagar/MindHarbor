import { useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import Button from '../common/Button';

const CameraDetection = ({ onDetect }) => {
  const [active, setActive] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const handleDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      if (onDetect) {
        onDetect({
          emotion: 'Calm',
          confidence: 87,
          emoji: '😌',
        });
      }
    }, 2000);
  };

  return (
    <div className="rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-1">Camera Mood Detection</h3>
      <p className="text-xs text-text-muted mb-4">
        Let our AI detect your current mood through facial expression analysis
      </p>

      <div
        className={`
          relative w-full aspect-video rounded-xl overflow-hidden
          flex items-center justify-center
          ${active ? 'bg-gray-900' : 'bg-surface-raised'}
          transition-colors duration-300
        `}
      >
        {active ? (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full border-2 border-dashed border-forest-500 flex items-center justify-center mb-3">
              {detecting ? (
                <div className="w-16 h-16 rounded-full bg-emerald-400/30 animate-pulse-soft" />
              ) : (
                <Camera size={32} className="text-emerald-400" />
              )}
            </div>
            <p className="text-xs text-gray-400">
              {detecting ? 'Analyzing your expression...' : 'Camera feed active'}
            </p>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-forest-800/30 flex items-center justify-center mb-3">
              <CameraOff size={24} className="text-emerald-400" />
            </div>
            <p className="text-sm text-text-secondary">Camera is off</p>
            <p className="text-xs text-text-muted mt-1">
              Enable camera to detect your mood automatically
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-4">
        <Button
          variant={active ? 'danger' : 'primary'}
          size="sm"
          icon={active ? CameraOff : Camera}
          onClick={() => setActive(!active)}
        >
          {active ? 'Turn Off' : 'Enable Camera'}
        </Button>
        {active && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDetect}
            disabled={detecting}
          >
            {detecting ? 'Detecting...' : 'Detect Mood'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraDetection;
