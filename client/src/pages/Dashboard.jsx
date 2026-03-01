import WelcomeCard from '../components/dashboard/WelcomeCard';
import DailyMoodCard from '../components/dashboard/DailyMoodCard';
import MoodTrendChart from '../components/dashboard/MoodTrendChart';
import QuickActions from '../components/dashboard/QuickActions';
import RecommendedResources from '../components/dashboard/RecommendedResources';
import RecentActivity from '../components/dashboard/RecentActivity';

const Dashboard = () => {
  return (
    <div>
      {/* Full-bleed hero — no containment */}
      <section className="gradient-hero px-5 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-20">
        <div className="max-w-5xl">
          <WelcomeCard />
          <div className="mt-8">
            <DailyMoodCard />
          </div>
        </div>
      </section>

      {/* Contained body */}
      <div className="content-contained space-y-14 py-10">
        {/* Quick actions — horizontal strip */}
        <QuickActions />

        {/* Asymmetric: mood trend (wide) + activity (narrow) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <MoodTrendChart />
          </div>
          <div className="lg:col-span-5">
            <RecentActivity />
          </div>
        </section>

        {/* Resources: full width */}
        <section>
          <RecommendedResources />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
