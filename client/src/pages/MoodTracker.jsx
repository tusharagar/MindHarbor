import { useState } from 'react';
import CameraDetection from '../components/mood/CameraDetection';
import EmotionResult from '../components/mood/EmotionResult';
import MoodHistory from '../components/mood/MoodHistory';
import WeeklyTrend from '../components/mood/WeeklyTrend';
import MoodButtons from '../components/mood/MoodButtons';

const MoodTracker = () => {
  const [detectionResult, setDetectionResult] = useState(null);

  return (
    <div>
      {/* Hero header */}
      <section className="gradient-hero px-5 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-20">
        <div className="max-w-5xl">
          <p className="section-label text-emerald-400 mb-2">Understand yourself</p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            Mood Tracker
          </h1>
          <p className="text-base text-text-secondary mt-2 max-w-lg">
            Every feeling is valid — let's explore your emotions together 💜
          </p>
        </div>
      </section>

      <div className="content-contained space-y-14 py-10">
        {/* Camera + Result — asymmetric 7/5 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <CameraDetection onDetect={setDetectionResult} />
          </div>
          <div className="lg:col-span-5">
            <EmotionResult result={detectionResult} />
          </div>
        </section>

        <div className="section-rule" />

        {/* Manual mood logging */}
        <section>
          <MoodButtons />
        </section>

        <div className="section-rule" />

        {/* History + Trend — asymmetric 5/7 (swapped) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <MoodHistory />
          </div>
          <div className="lg:col-span-7">
            <WeeklyTrend />
          </div>
        </section>
      </div>
    </div>
  );
};

export default MoodTracker;
