'use client';

import React, { useState, useRef, useEffect } from 'react';

const SearchResultsPage = ({ onNavigate }) => {
  const [selectedSort, setSelectedSort] = useState('Best Match');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [activeSourceDetail, setActiveSourceDetail] = useState(null);
  const messagesEndRef = useRef(null);

  const [sources, setSources] = useState({
    reddit: true,
    youtube: true,
    quora: true,
    blogs: true
  });

  // Priority filters - updated order with Comfort and Weight active by default
  const [priorities, setPriorities] = useState({
    score: { active: true, label: 'Score 8+' },
    comfort: { active: true, label: 'Comfort' },
    weight: { active: true, label: 'Weight' },
    durability: { active: false, label: 'Durability' },
    style: { active: false, label: 'Style' },
    traction: { active: false, label: 'Grip' },
    breathability: { active: false, label: 'Breathability' }
  });

  // Classical filters
  const [filters, setFilters] = useState({
    priceRange: [80, 200],
    brands: {
      'Nike': true,
      'HOKA': true,
      'Brooks': true,
      'New Balance': true,
      'ASICS': true,
      'Saucony': true
    },
    retailers: {
      'Amazon': true,
      'Dick\'s Sporting Goods': true,
      'Foot Locker': true,
      'Zappos': true,
      'REI': true,
      'Nordstrom': true
    },
    gender: 'all',
    returnPolicy: 'any',
    colors: {
      '#000000': true,
      '#FFFFFF': true,
      '#6B7280': true,
      '#3B82F6': true,
      '#EF4444': true,
      '#10B981': true,
      '#F59E0B': true,
      '#EC4899': true,
    }
  });

  // Detailed source data for Nike Air Zoom Pegasus 40 (product id: 1)
  const sourceDetails = {
    1: {
      reddit: {
        score: 9.4,
        mentions: 847,
        summary: "Reddit users love the responsive cushioning and versatility, but some warn about the narrow toe box for wider feet.",
        categories: {
          comfort: 9.6,
          weight: 8.5,
          durability: 8.9,
          style: 9.1,
          traction: 8.7,
          breathability: 9.0
        },
        context: ["r/RunningShoeGeeks", "r/Sneakers", "r/Running"],
        quotes: [
          { text: "Best all-day shoe I've owned. Wore these for a 12-hour shift and my feet felt great.", sentiment: "positive", source: "r/RunningShoeGeeks", upvotes: 342 },
          { text: "The React foam is incredible for standing. I'm a nurse and these saved my back.", sentiment: "positive", source: "r/Sneakers", upvotes: 218 },
          { text: "Runs narrow. If you have wide feet, go half size up or look at Brooks.", sentiment: "negative", source: "r/Running", upvotes: 156 }
        ],
        recency: "Trending this month"
      },
      youtube: {
        score: 9.1,
        mentions: 234,
        summary: "YouTubers praise the Pegasus 40 as the 'do-everything' daily trainer with improved forefoot cushioning over the 39.",
        categories: {
          comfort: 9.3,
          weight: 8.4,
          durability: 8.7,
          style: 9.0,
          traction: 8.8,
          breathability: 8.9
        },
        context: ["Believe in the Run", "Doctors of Running", "Seth James DeMoor"],
        quotes: [
          { text: "This is THE daily trainer to beat in 2024. Nike finally nailed the forefoot transition.", sentiment: "positive", source: "Believe in the Run", isChannelAuthor: true, views: "245K views" },
          { text: "For all-day comfort on your feet, the Pegasus 40 is hard to beat at this price point.", sentiment: "positive", source: "Doctors of Running", isChannelAuthor: true, views: "128K views" },
          { text: "Not the best for speed work, but that's not what it's designed for.", sentiment: "neutral", source: "Seth James DeMoor", isChannelAuthor: true, views: "89K views" }
        ],
        recency: "12 reviews this month"
      },
      quora: {
        score: 8.8,
        mentions: 156,
        summary: "Quora experts recommend it for healthcare workers and teachers who stand all day, noting excellent arch support.",
        categories: {
          comfort: 9.0,
          weight: 8.2,
          durability: 8.5,
          style: 8.4,
          traction: 8.3,
          breathability: 8.6
        },
        context: ["Podiatrists", "Fitness Experts", "Nurses"],
        quotes: [
          { text: "As a podiatrist, I recommend the Pegasus line to patients who need all-day standing support.", sentiment: "positive", source: "Dr. Michael Chen, DPM", credential: "Podiatrist" },
          { text: "The arch support is excellent without being intrusive. Great for flat feet.", sentiment: "positive", source: "Sarah K.", credential: "Physical Therapist" },
          { text: "Cushioning breaks down after ~400 miles. Budget for replacement every 6 months if daily use.", sentiment: "negative", source: "Mark T.", credential: "Running Coach" }
        ],
        recency: "Active discussion"
      },
      blogs: {
        score: 9.0,
        mentions: 89,
        summary: "Running blogs rate it as the best value daily trainer, with Runner's World giving it an Editor's Choice award.",
        categories: {
          comfort: 9.2,
          weight: 8.3,
          durability: 8.8,
          style: 8.9,
          traction: 8.7,
          breathability: 8.8
        },
        context: ["Runner's World", "Gear Patrol", "Wirecutter"],
        quotes: [
          { text: "The Pegasus 40 continues Nike's legacy of reliable, do-it-all trainers. Editor's Choice.", sentiment: "positive", source: "Runner's World", badge: "Editor's Choice" },
          { text: "If you need one shoe for walking, standing, and occasional runs, this is it.", sentiment: "positive", source: "Wirecutter", badge: "Top Pick" },
          { text: "Not flashy, but incredibly dependable. The Honda Civic of running shoes.", sentiment: "positive", source: "Gear Patrol", badge: null }
        ],
        recency: "Updated Nov 2024"
      }
    }
  };

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'user',
      text: 'best running shoes for standing all day',
      feedSnapshot: 'feed-1'
    },
    {
      id: 2,
      type: 'ai',
      text: 'Found 124 highly-rated shoes for all-day comfort. Prioritized comfort & weight.',
      feedSnapshot: 'feed-1'
    },
    {
      id: 3,
      type: 'user',
      text: 'What are the common complaints?',
      feedSnapshot: 'feed-2'
    },
    {
      id: 4,
      type: 'ai',
      text: 'Users on Reddit and product reviews often mention rapid outsole wear (34%), reduced energy return over time (26%), and shoes feeling heavy (19%).',
      feedSnapshot: 'feed-2',
      hasAction: true
    }
  ]);

  const [chatInput, setChatInput] = useState('');

  const followUpSuggestions = [
    'Nurse favorites?',
    'Easier on knees & back',
    'Better for wide feet',
    'Often regretted'
  ];

  const sortOptions = ['Best Match', 'Highest Score', 'Price: Low→High', 'Price: High→Low'];

  const products = [
    {
      id: 1,
      name: 'Nike Air Zoom Pegasus 40',
      image: '👟',
      priceRange: '$120 – $145',
      retailers: 6,
      overallScore: 9.2,
      scores: { reddit: 9.4, youtube: 9.1, quora: 8.8, blogs: 9.0 },
      tag: 'Top Rated',
      hasDetailedSource: true
    },
    {
      id: 2,
      name: 'HOKA Bondi 8',
      image: '👟',
      priceRange: '$165 – $180',
      retailers: 5,
      overallScore: 9.0,
      scores: { reddit: 9.2, youtube: 9.0, quora: 8.7, blogs: 8.9 },
      tag: 'Best for Comfort',
      hasDetailedSource: false
    },
    {
      id: 3,
      name: 'Brooks Ghost 15',
      image: '👟',
      priceRange: '$130 – $150',
      retailers: 7,
      overallScore: 8.8,
      scores: { reddit: 8.9, youtube: 8.7, quora: 8.6, blogs: 8.8 },
      tag: null,
      hasDetailedSource: false
    },
    {
      id: 4,
      name: 'New Balance Fresh Foam 1080v12',
      image: '👟',
      priceRange: '$150 – $165',
      retailers: 4,
      overallScore: 8.7,
      scores: { reddit: 8.8, youtube: 8.9, quora: 8.4, blogs: 8.5 },
      tag: null,
      hasDetailedSource: false
    },
    {
      id: 5,
      name: 'ASICS Gel-Nimbus 25',
      image: '👟',
      priceRange: '$160 – $175',
      retailers: 5,
      overallScore: 8.6,
      scores: { reddit: 8.5, youtube: 8.8, quora: 8.4, blogs: 8.6 },
      tag: 'Editor\'s Pick',
      hasDetailedSource: false
    },
    {
      id: 6,
      name: 'Saucony Triumph 21',
      image: '👟',
      priceRange: '$140 – $160',
      retailers: 4,
      overallScore: 8.4,
      scores: { reddit: 8.6, youtube: 8.3, quora: 8.2, blogs: 8.4 },
      tag: null,
      hasDetailedSource: false
    }
  ];

  // Auto-scroll to bottom of messages when expanded
  useEffect(() => {
    if (chatExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatExpanded, chatMessages]);

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'bg-emerald-500';
    if (score >= 7.0) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getScoreBgLight = (score) => {
    if (score >= 8.5) return 'bg-emerald-100';
    if (score >= 7.0) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const getScoreTextColor = (score) => {
    if (score >= 8.5) return 'text-emerald-600';
    if (score >= 7.0) return 'text-amber-600';
    return 'text-red-600';
  };

  const togglePriority = (key) => {
    setPriorities(prev => ({
      ...prev,
      [key]: { ...prev[key], active: !prev[key].active }
    }));
  };

  const sourceIcons = {
    reddit: { icon: '●', color: 'text-orange-500', bg: 'bg-orange-500', label: 'Reddit' },
    youtube: { icon: '▶', color: 'text-red-500', bg: 'bg-red-500', label: 'YouTube' },
    quora: { icon: 'Q', color: 'text-red-700', bg: 'bg-red-700', label: 'Quora' },
    blogs: { icon: '✎', color: 'text-blue-500', bg: 'bg-blue-500', label: 'Blogs' }
  };

  const SourceIcon = ({ name, score, productId, hasDetail }) => {
    const source = sourceIcons[name];
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (hasDetail) {
            setActiveSourceDetail({ productId, source: name });
          }
        }}
        className={`flex items-center gap-0.5 ${hasDetail ? 'hover:bg-gray-100 rounded px-1 py-0.5 -mx-1 transition-colors cursor-pointer' : 'cursor-default'}`}
      >
        <span className={`text-xs ${source.color}`}>{source.icon}</span>
        <span className="text-xs text-gray-500">{score}</span>
      </button>
    );
  };

  const CategoryBar = ({ label, score }) => {
    const percentage = (score / 10) * 100;
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600 w-20">{label}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${getScoreColor(score)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-semibold w-8 text-right ${getScoreTextColor(score)}`}>{score}</span>
      </div>
    );
  };

  const QuoteCard = ({ quote, isYouTube }) => {
    const sentimentStyles = {
      positive: { border: 'border-l-emerald-500', bg: 'bg-emerald-50' },
      negative: { border: 'border-l-red-400', bg: 'bg-red-50' },
      neutral: { border: 'border-l-gray-400', bg: 'bg-gray-50' }
    };
    const style = sentimentStyles[quote.sentiment];

    return (
      <div className={`${style.bg} border-l-4 ${style.border} p-3 rounded-r-lg`}>
        <p className="text-sm text-gray-800 leading-relaxed">"{quote.text}"</p>
        <div className="mt-2 flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">{quote.source}</span>
            {isYouTube && quote.isChannelAuthor && (
              <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                Creator
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {quote.upvotes && `↑ ${quote.upvotes}`}
            {quote.views && quote.views}
            {quote.credential && `• ${quote.credential}`}
            {quote.badge && (
              <span className="ml-1 bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-xs">
                {quote.badge}
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };

  const SourceDetailModal = () => {
    if (!activeSourceDetail) return null;

    const { productId, source } = activeSourceDetail;
    const detail = sourceDetails[productId]?.[source];
    const sourceInfo = sourceIcons[source];

    if (!detail) return null;

    const isYouTube = source === 'youtube';

    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-end max-w-md mx-auto"
        onClick={() => setActiveSourceDetail(null)}
      >
        <div
          className="bg-white w-full rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="overflow-y-auto flex-1 px-5 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${sourceInfo.bg} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-lg">{sourceInfo.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{sourceInfo.label}</h3>
                  <p className="text-xs text-gray-500">{detail.mentions} mentions • {detail.recency}</p>
                </div>
              </div>
              <div className={`${getScoreBgLight(detail.score)} px-3 py-1.5 rounded-full`}>
                <span className={`text-lg font-bold ${getScoreTextColor(detail.score)}`}>{detail.score}</span>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-indigo-600">✨</span>
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">AI Summary</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{detail.summary}</p>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Category Scores from {sourceInfo.label}</h4>
              <div className="space-y-2.5">
                <CategoryBar label="Comfort" score={detail.categories.comfort} />
                <CategoryBar label="Weight" score={detail.categories.weight} />
                <CategoryBar label="Durability" score={detail.categories.durability} />
                <CategoryBar label="Style" score={detail.categories.style} />
                <CategoryBar label="Traction" score={detail.categories.traction} />
                <CategoryBar label="Breathability" score={detail.categories.breathability} />
              </div>
            </div>

            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Where people are talking</h4>
              <div className="flex flex-wrap gap-2">
                {detail.context.map((ctx, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                  >
                    {ctx}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">What people are saying</h4>
              <div className="space-y-3">
                {detail.quotes.map((quote, idx) => (
                  <QuoteCard key={idx} quote={quote} isYouTube={isYouTube} />
                ))}
              </div>
            </div>

            <button className="w-full mt-5 py-3 text-indigo-600 font-medium text-sm border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors">
              View all {detail.mentions} mentions →
            </button>
          </div>

          <div className="px-5 pb-5 pt-2 border-t border-gray-100">
            <button
              onClick={() => setActiveSourceDetail(null)}
              className="w-full bg-gray-900 text-white py-3.5 rounded-full font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const PriorityPill = ({ name, priority }) => {
    return (
      <button
        onClick={() => togglePriority(name)}
        className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-all ${
          priority.active
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-gray-600 border-gray-200'
        }`}
      >
        {priority.label}
      </button>
    );
  };

  // Dual Range Slider Component
  const DualRangeSlider = () => {
    const min = 0;
    const max = 300;
    const [minVal, maxVal] = filters.priceRange;

    const minPercent = ((minVal - min) / (max - min)) * 100;
    const maxPercent = ((maxVal - min) / (max - min)) * 100;

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-gray-800">Price Range</span>
          <span className="text-sm text-indigo-600 font-medium">
            ${minVal} – ${maxVal}
          </span>
        </div>
        <div className="relative h-6 flex items-center">
          <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
          <div
            className="absolute h-1.5 bg-indigo-600 rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onChange={(e) => {
              const value = Math.min(Number(e.target.value), maxVal - 20);
              setFilters(prev => ({ ...prev, priceRange: [value, prev.priceRange[1]] }));
            }}
            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />
          <input
            type="range"
            min={min}
            max={max}
            value={maxVal}
            onChange={(e) => {
              const value = Math.max(Number(e.target.value), minVal + 20);
              setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value] }));
            }}
            className="absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>$0</span>
          <span>$300</span>
        </div>
      </div>
    );
  };

  // Color Swatch Selector
  const ColorSwatchSelector = () => {
    const colorNames = {
      '#000000': 'Black',
      '#FFFFFF': 'White',
      '#6B7280': 'Gray',
      '#3B82F6': 'Blue',
      '#EF4444': 'Red',
      '#10B981': 'Green',
      '#F59E0B': 'Orange',
      '#EC4899': 'Pink'
    };

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-gray-800">Colors</span>
          <button
            onClick={() => {
              const allSelected = Object.values(filters.colors).every(v => v);
              setFilters(prev => ({
                ...prev,
                colors: Object.fromEntries(Object.keys(prev.colors).map(k => [k, !allSelected]))
              }));
            }}
            className="text-xs text-indigo-600"
          >
            {Object.values(filters.colors).every(v => v) ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(filters.colors).map(([color, selected]) => (
            <button
              key={color}
              onClick={() => setFilters(prev => ({
                ...prev,
                colors: { ...prev.colors, [color]: !selected }
              }))}
              className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                selected
                  ? 'border-indigo-600 ring-2 ring-indigo-200'
                  : 'border-gray-200'
              }`}
              style={{ backgroundColor: color }}
              title={colorNames[color]}
            >
              {selected && (
                <span className={`text-sm ${color === '#FFFFFF' || color === '#F59E0B' ? 'text-gray-800' : 'text-white'}`}>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Checkbox Group Component
  const CheckboxGroup = ({ title, items, filterKey }) => {
    const toggleItem = (item) => {
      setFilters(prev => ({
        ...prev,
        [filterKey]: {
          ...prev[filterKey],
          [item]: !prev[filterKey][item]
        }
      }));
    };

    const allSelected = Object.values(items).every(v => v);

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-gray-800">{title}</span>
          <button
            onClick={() => {
              const newValue = !allSelected;
              setFilters(prev => ({
                ...prev,
                [filterKey]: Object.fromEntries(Object.keys(prev[filterKey]).map(k => [k, newValue]))
              }));
            }}
            className="text-xs text-indigo-600"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(items).map(([item, checked]) => (
            <button
              key={item}
              onClick={() => toggleItem(item)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                checked
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              {checked && <span className="mr-1">✓</span>}
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Chat Message Component
  const ChatMessage = ({ message, isLast }) => {
    if (message.type === 'user') {
      return (
        <div className="flex justify-end mb-2">
          <div className="bg-indigo-600 text-white px-3 py-2 rounded-2xl rounded-br-sm max-w-[85%] text-sm">
            {message.text}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-2">
        <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%] text-sm">
          {message.text}
          {message.feedSnapshot && !isLast && (
            <button className="block mt-1.5 text-xs text-indigo-600 font-medium hover:underline">
              ↩ View this feed
            </button>
          )}
        </div>
        {message.hasAction && isLast && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Update feed to reduce these?</span>
            <button className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full font-medium hover:bg-indigo-700 transition-colors">
              Yes
            </button>
            <button className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium hover:bg-gray-300 transition-colors">
              No
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen font-sans relative">
      {/* Status Bar */}
      <div className="bg-white px-4 py-2 flex justify-between items-center text-xs text-gray-600">
        <span>9:41</span>
        <div className="flex gap-1">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <span className="font-bold text-lg text-indigo-600">ShopAI</span>
        <button className="text-gray-600">🔔</button>
      </div>

      {/* Priority Pills Row - Updated order */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-12 z-10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <PriorityPill name="score" priority={priorities.score} />
          <PriorityPill name="comfort" priority={priorities.comfort} />
          <PriorityPill name="weight" priority={priorities.weight} />
          <PriorityPill name="durability" priority={priorities.durability} />
          <PriorityPill name="style" priority={priorities.style} />
          <PriorityPill name="traction" priority={priorities.traction} />
          <PriorityPill name="breathability" priority={priorities.breathability} />
        </div>
      </div>

      {/* Secondary Control Row */}
      <div className="bg-white px-4 py-2.5 border-b border-gray-100 flex justify-between items-center">
        <button
          onClick={() => setShowSourceModal(true)}
          className="text-indigo-600 text-sm font-medium flex items-center gap-1"
        >
          Source Preferences
        </button>
        <button
          onClick={() => setShowFilterPanel(true)}
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      {/* Results Header */}
      <div className="px-4 py-3 flex justify-between items-center">
        <span className="text-gray-600 text-sm">124 results</span>
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-1 text-sm text-gray-700 font-medium"
          >
            {selectedSort} <span className="text-xs">▼</span>
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30 w-44">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedSort(option);
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    selectedSort === option ? 'text-indigo-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-3 pb-80">
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-36 flex items-center justify-center">
                <span className="text-6xl">{product.image}</span>
                {product.tag && (
                  <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {product.tag}
                  </span>
                )}
                <div className={`absolute top-2 right-2 ${getScoreColor(product.overallScore)} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md`}>
                  {product.overallScore}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 h-10">
                  {product.name}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-indigo-600 font-bold text-sm">{product.priceRange}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {product.retailers} retailers
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                  <SourceIcon name="reddit" score={product.scores.reddit} productId={product.id} hasDetail={product.hasDetailedSource} />
                  <SourceIcon name="youtube" score={product.scores.youtube} productId={product.id} hasDetail={product.hasDetailedSource} />
                  <SourceIcon name="quora" score={product.scores.quora} productId={product.id} hasDetail={product.hasDetailedSource} />
                  <SourceIcon name="blogs" score={product.scores.blogs} productId={product.id} hasDetail={product.hasDetailedSource} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window - Fixed at Bottom above Nav */}
      <div className={`fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-xl transition-all duration-300 ease-in-out ${
        chatExpanded ? 'h-90' : 'h-14'
      }`}>

        {/* Collapsed State */}
        {!chatExpanded && (
          <div
            onClick={() => setChatExpanded(true)}
            className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors h-full"
          >
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 text-sm">💬</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500">
                Tap to tweak your search...
              </p>
            </div>
            <span className="text-gray-400 text-xs flex-shrink-0">▲</span>
          </div>
        )}

        {/* Expanded State */}
        {chatExpanded && (
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div
              onClick={() => setChatExpanded(false)}
              className="px-4 py-2 border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 flex-shrink-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-indigo-600">💬</span>
                <span className="text-sm font-medium text-gray-700">Shopping Assistant</span>
              </div>
              <span className="text-gray-400 text-xs">▼ Collapse</span>
            </div>

            {/* Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {chatMessages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isLast={idx === chatMessages.length - 1}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Follow-up Suggestions */}
            <div className="px-3 py-2 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {followUpSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-full whitespace-nowrap hover:bg-indigo-100 hover:text-indigo-700 transition-colors flex-shrink-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-3 py-2 border-t border-gray-100 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white flex-shrink-0 hover:bg-indigo-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center max-w-md mx-auto">
        <button
          onClick={() => onNavigate && onNavigate('home')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <span className="text-xl">🏠</span>
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="text-xl">🔍</span>
          <span className="text-xs font-medium">Search</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">👤</span>
          <span className="text-xs">Creators</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">🛒</span>
          <span className="text-xs">Cart</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
          <span className="text-xl">⚙️</span>
          <span className="text-xs">Profile</span>
        </button>
      </div>

      {/* Source Preferences Modal */}
      {showSourceModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end max-w-md mx-auto"
          onClick={() => setShowSourceModal(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Source Preferences</h3>
              <button
                onClick={() => setShowSourceModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Toggle which sources influence product scores.
            </p>

            <div className="space-y-4">
              {Object.entries(sources).map(([source, enabled]) => (
                <div key={source} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {source === 'reddit' && '🔴'}
                      {source === 'youtube' && '▶️'}
                      {source === 'quora' && '🔵'}
                      {source === 'blogs' && '📝'}
                    </span>
                    <span className="capitalize font-medium text-gray-800">{source}</span>
                  </div>
                  <button
                    onClick={() => setSources({...sources, [source]: !enabled})}
                    className={`w-12 h-7 rounded-full transition-colors ${
                      enabled ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSourceModal(false)}
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-full font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Slide-in Filter Panel */}
      {showFilterPanel && (
        <div className="fixed inset-0 z-50 flex max-w-md mx-auto">
          {/* Dimmed Background */}
          <div
            className="w-[25%] bg-black/50"
            onClick={() => setShowFilterPanel(false)}
          />

          {/* Filter Panel */}
          <div className="w-[75%] bg-white h-full overflow-hidden shadow-2xl flex flex-col">
            {/* Panel Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center z-10 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Content - Scrollable */}
            <div className="flex-1 p-5 overflow-y-auto">
              {/* Price Range */}
              <DualRangeSlider />

              {/* Brands */}
              <CheckboxGroup
                title="Brands"
                items={filters.brands}
                filterKey="brands"
              />

              {/* Retailers */}
              <CheckboxGroup
                title="Retailers"
                items={filters.retailers}
                filterKey="retailers"
              />

              {/* Gender */}
              <div className="mb-6">
                <span className="font-medium text-gray-800 block mb-3">Gender</span>
                <div className="flex flex-wrap gap-2">
                  {['all', 'mens', 'womens', 'unisex'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFilters(prev => ({ ...prev, gender: g }))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        filters.gender === g
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {g === 'all' ? 'All' : g === 'mens' ? "Men's" : g === 'womens' ? "Women's" : 'Unisex'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <ColorSwatchSelector />

              {/* Return Policy */}
              <div className="mb-6">
                <span className="font-medium text-gray-800 block mb-3">Return Policy</span>
                <div className="flex flex-wrap gap-2">
                  {['any', 'free', '30+', '60+'].map((policy) => (
                    <button
                      key={policy}
                      onClick={() => setFilters(prev => ({ ...prev, returnPolicy: policy }))}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        filters.returnPolicy === policy
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}
                    >
                      {policy === 'any' ? 'Any' : policy === 'free' ? 'Free' : policy === '30+' ? '30d+' : '60d+'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button - Fixed at bottom */}
            <div className="bg-white border-t border-gray-100 p-4 flex-shrink-0">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [50, 250],
                      brands: Object.fromEntries(Object.keys(filters.brands).map(k => [k, true])),
                      retailers: Object.fromEntries(Object.keys(filters.retailers).map(k => [k, true])),
                      gender: 'all',
                      returnPolicy: 'any',
                      colors: Object.fromEntries(Object.keys(filters.colors).map(k => [k, true]))
                    });
                  }}
                  className="flex-1 py-3 rounded-full border border-gray-300 text-gray-700 font-medium text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="flex-[2] py-3 rounded-full bg-indigo-600 text-white font-semibold text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Detail Modal */}
      <SourceDetailModal />
    </div>
  );
};

export default SearchResultsPage;
