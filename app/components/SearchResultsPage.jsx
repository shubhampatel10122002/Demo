'use client';

import React, { useState, useRef, useEffect } from 'react';

const SearchResultsPage = () => {
  const [selectedSort, setSelectedSort] = useState('Best Match');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const messagesEndRef = useRef(null);

  const [sources, setSources] = useState({
    reddit: true,
    youtube: true,
    quora: true,
    blogs: true
  });

  // Priority filters - simple active/inactive
  const [priorities, setPriorities] = useState({
    comfort: { active: true },
    cushioning: { active: true },
    durability: { active: false },
    stability: { active: false },
    breathability: { active: false },
    weight: { active: false },
    score: { active: true }
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
      text: 'Found 124 highly-rated shoes for all-day comfort. Prioritized cushioning & support.',
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
      text: 'Runners frequently mention rapid outsole wear (34%), reduced energy return over time (26%), and shoes feeling heavy (19%).',
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
      tag: 'Top Rated'
    },
    {
      id: 2,
      name: 'HOKA Bondi 8',
      image: '👟',
      priceRange: '$165 – $180',
      retailers: 5,
      overallScore: 9.0,
      scores: { reddit: 9.2, youtube: 9.0, quora: 8.7, blogs: 8.9 },
      tag: 'Best for Comfort'
    },
    {
      id: 3,
      name: 'Brooks Ghost 15',
      image: '👟',
      priceRange: '$130 – $150',
      retailers: 7,
      overallScore: 8.8,
      scores: { reddit: 8.9, youtube: 8.7, quora: 8.6, blogs: 8.8 },
      tag: null
    },
    {
      id: 4,
      name: 'New Balance Fresh Foam 1080v12',
      image: '👟',
      priceRange: '$150 – $165',
      retailers: 4,
      overallScore: 8.7,
      scores: { reddit: 8.8, youtube: 8.9, quora: 8.4, blogs: 8.5 },
      tag: null
    },
    {
      id: 5,
      name: 'ASICS Gel-Nimbus 25',
      image: '👟',
      priceRange: '$160 – $175',
      retailers: 5,
      overallScore: 8.6,
      scores: { reddit: 8.5, youtube: 8.8, quora: 8.4, blogs: 8.6 },
      tag: 'Editor\'s Pick'
    },
    {
      id: 6,
      name: 'Saucony Triumph 21',
      image: '👟',
      priceRange: '$140 – $160',
      retailers: 4,
      overallScore: 8.4,
      scores: { reddit: 8.6, youtube: 8.3, quora: 8.2, blogs: 8.4 },
      tag: null
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

  const togglePriority = (key) => {
    setPriorities(prev => ({
      ...prev,
      [key]: { active: !prev[key].active }
    }));
  };

  const SourceIcon = ({ name, score }) => {
    const icons = {
      reddit: '●',
      youtube: '▶',
      quora: 'Q',
      blogs: '✎'
    };
    const colors = {
      reddit: 'text-orange-500',
      youtube: 'text-red-500',
      quora: 'text-red-700',
      blogs: 'text-blue-500'
    };
    return (
      <div className="flex items-center gap-0.5">
        <span className={`text-xs ${colors[name]}`}>{icons[name]}</span>
        <span className="text-xs text-gray-500">{score}</span>
      </div>
    );
  };

  const PriorityPill = ({ name, label, priority }) => {
    return (
      <button
        onClick={() => togglePriority(name)}
        className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-all ${
          priority.active
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-gray-600 border-gray-200'
        }`}
      >
        {label}
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
        <button className="text-gray-400 text-lg">←</button>
        <span className="font-bold text-lg text-indigo-600">ShopAI</span>
        <button className="text-gray-600">🔔</button>
      </div>

      {/* Priority Pills Row */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-12 z-10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <PriorityPill name="comfort" label="Comfort" priority={priorities.comfort} />
          <PriorityPill name="cushioning" label="Cushioning" priority={priorities.cushioning} />
          <PriorityPill name="score" label="Score 8+" priority={priorities.score} />
          <PriorityPill name="durability" label="Durability" priority={priorities.durability} />
          <PriorityPill name="stability" label="Stability" priority={priorities.stability} />
          <PriorityPill name="breathability" label="Breathability" priority={priorities.breathability} />
          <PriorityPill name="weight" label="Lightweight" priority={priorities.weight} />
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
                  <SourceIcon name="reddit" score={product.scores.reddit} />
                  <SourceIcon name="youtube" score={product.scores.youtube} />
                  <SourceIcon name="quora" score={product.scores.quora} />
                  <SourceIcon name="blogs" score={product.scores.blogs} />
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
                Tap to refine your search...
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
        <button className="flex flex-col items-center gap-1 text-gray-400">
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
              Apply
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
    </div>
  );
};

export default SearchResultsPage;
