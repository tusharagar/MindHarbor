import { useState } from 'react';
import CounselorCard from '../components/counselor/CounselorCard';
import BookingCalendar from '../components/counselor/BookingCalendar';
import TimeSelection from '../components/counselor/TimeSelection';
import ConfirmationModal from '../components/counselor/ConfirmationModal';

const counselors = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialization: 'Anxiety & Stress Management',
    qualification: 'PhD Clinical Psychology, NIMHANS',
    rating: 4.9,
    experience: 8,
    available: true,
    tags: ['Anxiety', 'Academic Stress', 'CBT'],
  },
  {
    id: 2,
    name: 'Dr. Arjun Mehta',
    specialization: 'Depression & Mood Disorders',
    qualification: 'MD Psychiatry, AIIMS Delhi',
    rating: 4.8,
    experience: 12,
    available: true,
    tags: ['Depression', 'Mood', 'Therapy'],
  },
  {
    id: 3,
    name: 'Dr. Sneha Iyer',
    specialization: 'Relationship & Social Anxiety',
    qualification: 'MPhil Clinical Psychology, TISS',
    rating: 4.7,
    experience: 5,
    available: false,
    tags: ['Relationships', 'Social Anxiety', 'Self-esteem'],
  },
  {
    id: 4,
    name: 'Dr. Karan Patel',
    specialization: 'Mindfulness & Well-being',
    qualification: 'PsyD, Mumbai University',
    rating: 4.6,
    experience: 6,
    available: true,
    tags: ['Mindfulness', 'Well-being', 'Career Stress'],
  },
];

const CounselorBooking = () => {
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleBook = (counselor) => {
    setSelectedCounselor(counselor);
    setBooked(false);
  };

  const handleConfirm = () => {
    setShowModal(false);
    setBooked(true);
    setTimeout(() => setBooked(false), 5000);
  };

  const canConfirm = selectedCounselor && selectedDate && selectedTime;

  return (
    <div>
      {/* Hero header */}
      <section className="gradient-hero px-5 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16">
        <div className="max-w-5xl">
          <p className="section-label text-emerald-400 mb-2">Professional support</p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            Counselor Booking
          </h1>
          <p className="text-base text-text-secondary mt-2 max-w-lg">
            Connect with verified mental health professionals 🫂
          </p>
        </div>
      </section>

      <div className="content-contained py-8 space-y-8">
        {booked && (
          <div className="surface-tint rounded-2xl p-5 text-center animate-slide-up">
            <p className="text-sm font-medium text-emerald-300">✅ Session booked successfully!</p>
            <p className="text-xs text-text-muted mt-1">
              Check your email for confirmation details. Take care of yourself 💚
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Counselor list — wide */}
          <div className="lg:col-span-7 space-y-5">
            <p className="section-label text-text-muted">Available counselors</p>
            {counselors.map((c) => (
              <CounselorCard key={c.id} counselor={c} onBook={handleBook} />
            ))}
          </div>

          {/* Booking sidebar — narrow */}
          <div className="lg:col-span-5 space-y-5">
            {selectedCounselor ? (
              <>
                <div className="surface-tint rounded-2xl p-4">
                  <p className="text-xs text-emerald-400 uppercase tracking-wider mb-1">Booking with</p>
                  <p className="text-sm font-semibold text-text-primary">{selectedCounselor.name}</p>
                  <p className="text-xs text-text-muted">{selectedCounselor.specialization}</p>
                </div>
                <BookingCalendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
                <TimeSelection
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
                {canConfirm && (
                  <button
                    onClick={() => setShowModal(true)}
                    className="
                      w-full py-3 rounded-xl gradient-primary text-white text-sm font-semibold
                      hover:opacity-90 transition-opacity duration-200
                      animate-slide-up
                    "
                  >
                    Review & Confirm Booking
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                  <p className="text-3xl mb-3">📅</p>
                  <p className="text-sm text-text-secondary">Select a counselor</p>
                  <p className="text-xs text-text-muted mt-1">
                    Choose a professional from the list to start booking
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        counselor={selectedCounselor}
        date={selectedDate}
        time={selectedTime}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default CounselorBooking;
