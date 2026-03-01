import { useState } from 'react';
import ResourceCard from '../components/resources/ResourceCard';
import ResourceFilters from '../components/resources/ResourceFilters';
import SearchBar from '../components/common/SearchBar';

const allResources = [
  {
    id: 1,
    title: 'Managing Exam Stress Effectively',
    description: 'Learn practical techniques to handle exam pressure and stay calm during tests.',
    type: 'article',
    category: 'Stress',
    duration: '5 min read',
    offline: false,
    mood: ['Stress', 'Anxiety'],
  },
  {
    id: 2,
    title: 'Guided Breathing for Calm',
    description: 'A soothing 10-minute breathing exercise to reduce anxiety and bring peace.',
    type: 'audio',
    category: 'Anxiety',
    duration: '10 min',
    offline: true,
    mood: ['Anxiety', 'Sleep'],
  },
  {
    id: 3,
    title: 'Understanding Your Anxiety',
    description: 'A compassionate video guide on recognizing and coping with anxiety.',
    type: 'video',
    category: 'Anxiety',
    duration: '12 min',
    offline: false,
    mood: ['Anxiety'],
  },
  {
    id: 4,
    title: 'Better Sleep Habits for Students',
    description: 'Improve your sleep quality with these evidence-based tips for college life.',
    type: 'article',
    category: 'Sleep',
    duration: '4 min read',
    offline: true,
    mood: ['Sleep', 'Self-care'],
  },
  {
    id: 5,
    title: 'Mindfulness Meditation',
    description: 'A gentle meditation session to help you stay grounded and present.',
    type: 'audio',
    category: 'Self-care',
    duration: '15 min',
    offline: false,
    mood: ['Self-care', 'Focus'],
  },
  {
    id: 6,
    title: 'Building Healthy Relationships',
    description: 'Tips on communicating better and building supportive connections.',
    type: 'video',
    category: 'Relationships',
    duration: '8 min',
    offline: false,
    mood: ['Relationships'],
  },
  {
    id: 7,
    title: 'Focus Techniques for Studying',
    description: 'Boost your concentration with the Pomodoro method and active recall techniques.',
    type: 'article',
    category: 'Focus',
    duration: '6 min read',
    offline: true,
    mood: ['Focus', 'Stress'],
  },
  {
    id: 8,
    title: 'Progressive Muscle Relaxation',
    description: 'Release physical tension with this guided relaxation exercise.',
    type: 'audio',
    category: 'Stress',
    duration: '12 min',
    offline: false,
    mood: ['Stress', 'Sleep'],
  },
  {
    id: 9,
    title: 'Self-Care Routines That Work',
    description: 'Simple daily habits that make a big difference in your mental well-being.',
    type: 'video',
    category: 'Self-care',
    duration: '10 min',
    offline: false,
    mood: ['Self-care'],
  },
];

const Resources = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All Types');

  const filtered = allResources.filter((r) => {
    const matchCategory = activeCategory === 'All' || r.category === activeCategory;
    const matchType = activeType === 'All Types' || r.type === activeType.toLowerCase();
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchType && matchSearch;
  });

  return (
    <div>
      {/* Hero header */}
      <section className="gradient-hero px-5 lg:px-8 pt-10 pb-14 lg:pt-14 lg:pb-16">
        <div className="max-w-5xl">
          <p className="section-label text-emerald-400 mb-2">Browse &amp; learn</p>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
            Resource Library
          </h1>
          <p className="text-base text-text-secondary mt-2 max-w-lg">
            Curated content to support your mental well-being 📚
          </p>

          <div className="mt-6">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="max-w-md"
            />
          </div>
        </div>
      </section>

      <div className="content-contained py-8 space-y-8">
        <ResourceFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          activeType={activeType}
          onTypeChange={setActiveType}
        />

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm text-text-secondary">No resources found</p>
            <p className="text-xs text-text-muted mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
