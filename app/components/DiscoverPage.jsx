'use client';

import React, { useState, useEffect } from 'react';

const DiscoverPage = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('foryou');
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 34, seconds: 12 });

  // Countdown timer effect (for Samsung Flash Deal)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ---------- FIRST CODE (start -> Samsung TV deal section) ----------
  const flashDeals = [
    {
      id: 1,
      name: 'Samsung 65" OLED TV',
      image: '📺',
      originalPrice: 1799,
      dealPrice: 1299,
      savings: 500,
      source: 'Costco',
      endsIn: countdown,
      stock: 12,
      score: 9.2
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'bg-emerald-500';
    if (score >= 7.0) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const QuickCategories = () => (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {[
        { emoji: '👟', label: 'Footwear' },
        { emoji: '💻', label: 'Tech' },
        { emoji: '🏠', label: 'Home' },
        { emoji: '👕', label: 'Fashion' },
        { emoji: '🎮', label: 'Gaming' },
        { emoji: '💄', label: 'Beauty' },
        { emoji: '🏃', label: 'Fitness' },
        { emoji: '📚', label: 'Books' }
      ].map((cat, idx) => (
        <button key={idx} className="flex flex-col items-center gap-1 min-w-[60px]">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-xl hover:bg-indigo-100 transition-colors">
            {cat.emoji}
          </div>
          <span className="text-xs text-gray-600">{cat.label}</span>
        </button>
      ))}
    </div>
  );

  // Flash deal hero: same gradient as SECOND CODE Sony deal top section
  const FlashDealHero = ({ deal }) => (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-4 text-white relative overflow-hidden">
      {/* same bubble style as second code */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium bg-white/20 px-2 py-0.5 rounded-full">⚡ Flash Deal</span>
          <span className="text-xs text-white/80">Only {deal.stock} left</span>
        </div>

        <div className="flex gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center text-4xl">
            {deal.image}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{deal.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold">${deal.dealPrice}</span>
              <span className="text-sm text-white/70 line-through">${deal.originalPrice}</span>
              <span className="bg-amber-400 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold">
                Save ${deal.savings}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-6 h-6 ${getScoreColor(deal.score)} rounded-full flex items-center justify-center text-xs font-bold`}>
                {deal.score}
              </div>
              <span className="text-xs text-white/80">from {deal.source}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="text-center">
              <span className="text-2xl font-bold">{String(deal.endsIn.hours).padStart(2, '0')}</span>
              <span className="text-xs block text-white/70">hrs</span>
            </div>
            <span className="text-xl text-white/50">:</span>
            <div className="text-center">
              <span className="text-2xl font-bold">{String(deal.endsIn.minutes).padStart(2, '0')}</span>
              <span className="text-xs block text-white/70">min</span>
            </div>
            <span className="text-xl text-white/50">:</span>
            <div className="text-center">
              <span className="text-2xl font-bold">{String(deal.endsIn.seconds).padStart(2, '0')}</span>
              <span className="text-xs block text-white/70">sec</span>
            </div>
          </div>

          <button className="bg-white text-indigo-600 px-5 py-2 rounded-full font-semibold text-sm hover:bg-white/90 transition-colors">
            Grab Deal →
          </button>
        </div>
      </div>
    </div>
  );

  // ---------- SECOND CODE (everything from Price Drops section onward) ----------
  const PriceSparkline = ({ data, currentPrice, lowestPrice }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 60;
    const height = 24;

    const points = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="flex items-center gap-2">
        <svg width={width} height={height} className="overflow-visible">
          <polyline
            points={points}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - min) / range) * height}
            r="3"
            fill="#10B981"
          />
        </svg>
        <div className="text-right">
          <div className="text-emerald-600 font-bold text-sm">${currentPrice}</div>
          <div className="text-[10px] text-gray-400 line-through">${lowestPrice}</div>
        </div>
      </div>
    );
  };

  const SentimentBadge = ({ sentiment, score }) => {
    const colors = {
      positive: 'bg-emerald-100 text-emerald-700',
      mixed: 'bg-amber-100 text-amber-700',
      negative: 'bg-red-100 text-red-700'
    };
    const icons = { positive: '↑', mixed: '↔', negative: '↓' };

    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[sentiment]}`}>
        {icons[sentiment]} {score}% positive
      </span>
    );
  };

  const PlatformBadge = ({ platform }) => {
    const styles = {
      reddit: { bg: 'bg-orange-500', icon: '●', label: 'Reddit' },
      youtube: { bg: 'bg-red-500', icon: '▶', label: 'YouTube' },
      tiktok: { bg: 'bg-gray-900', icon: '♪', label: 'TikTok' },
      twitter: { bg: 'bg-blue-400', icon: '𝕏', label: 'X' }
    };
    const style = styles[platform];
    return (
      <span className={`${style.bg} text-white text-[10px] px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-0.5`}>
        <span>{style.icon}</span>
        <span>{style.label}</span>
      </span>
    );
  };

  const priceDrops = [
    {
      id: 1,
      name: 'Sony WH-1000XM5',
      image: '🎧',
      currentPrice: 278,
      wasPrice: 399,
      lowestEver: true,
      dropPercent: 30,
      priceHistory: [399, 380, 350, 340, 299, 278],
      timeLeft: '2h 34m',
      retailer: 'Amazon'
    },
    {
      id: 2,
      name: 'Dyson V15 Detect',
      image: '🧹',
      currentPrice: 549,
      wasPrice: 749,
      lowestEver: false,
      dropPercent: 27,
      priceHistory: [749, 699, 649, 599, 549, 549],
      timeLeft: '5h 12m',
      retailer: 'Best Buy'
    },
    {
      id: 3,
      name: 'Apple AirPods Pro 2',
      image: '🎵',
      currentPrice: 189,
      wasPrice: 249,
      lowestEver: true,
      dropPercent: 24,
      priceHistory: [249, 249, 229, 199, 189, 189],
      timeLeft: '1d 4h',
      retailer: 'Walmart'
    }
  ];

  const buzzingNow = [
    {
      id: 1,
      name: 'Stanley Quencher H2.0',
      image: '🥤',
      price: '$45',
      platform: 'tiktok',
      mentions: '2.4M',
      sentiment: 'positive',
      sentimentScore: 87,
      quote: '"Finally understand the hype. Keeps ice for 2 days straight."',
      author: '@lifestyle_sarah',
      trending: '+340%'
    },
    {
      id: 2,
      name: 'Oura Ring Gen 3',
      image: '💍',
      price: '$299',
      platform: 'reddit',
      mentions: '12.4K',
      sentiment: 'mixed',
      sentimentScore: 64,
      quote: '"Sleep tracking is incredible but battery life could be better"',
      author: 'u/biohacker_mike',
      trending: '+89%'
    },
    {
      id: 3,
      name: 'Theragun Mini',
      image: '💆',
      price: '$199',
      platform: 'youtube',
      mentions: '890K',
      sentiment: 'positive',
      sentimentScore: 91,
      quote: '"Best recovery tool I\'ve owned. Travel-friendly too."',
      author: 'FitnessPro',
      trending: '+156%'
    }
  ];

  const hiddenGems = [
    {
      id: 1,
      name: 'Anker 737 Power Bank',
      image: '🔋',
      price: '$109',
      originalBrand: 'vs Mophie $149',
      score: 9.4,
      reviews: '4.2K reviews',
      insight: 'Same capacity, 37% cheaper, higher user rating',
      tag: 'Better Alternative'
    },
    {
      id: 2,
      name: 'Hismile Toothpaste',
      image: '🦷',
      price: '$12',
      originalBrand: 'vs high-end brands',
      score: 8.9,
      reviews: '18K reviews',
      insight: 'TikTok famous but actually delivers results',
      tag: 'Viral & Verified'
    },
    {
      id: 3,
      name: 'CeraVe PM Lotion',
      image: '🧴',
      price: '$15',
      originalBrand: 'vs $60+ serums',
      score: 9.1,
      reviews: '52K reviews',
      insight: 'Dermatologist recommended, fraction of the cost',
      tag: 'Cult Favorite'
    }
  ];

  const smartCollections = [
    { id: 1, title: 'Regret Not Buying Sooner', icon: '😤', count: 47, gradient: 'from-purple-500 to-indigo-600' },
    { id: 2, title: 'Actually Worth the Hype', icon: '✨', count: 32, gradient: 'from-amber-500 to-orange-600' },
    { id: 3, title: "Reddit's Holy Grails", icon: '🏆', count: 28, gradient: 'from-orange-500 to-red-600' },
    { id: 4, title: 'Budget Beaters', icon: '💰', count: 64, gradient: 'from-emerald-500 to-teal-600' }
  ];

  const communityDebates = [
    {
      id: 1,
      topic: 'AirPods Max vs Sony XM5',
      image: '🎧',
      votes: { option1: 42, option2: 58 },
      options: ['AirPods Max', 'Sony XM5'],
      comments: 234,
      hot: true
    },
    {
      id: 2,
      topic: 'Is Dyson Actually Worth It?',
      image: '💨',
      votes: { yes: 67, no: 33 },
      options: ['Worth it', 'Overpriced'],
      comments: 567,
      hot: false
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen font-sans pb-20">
      {/* Status Bar */}
      <div className="bg-white px-4 py-2 flex justify-between items-center text-xs text-gray-600">
        <span>9:41</span>
        <div className="flex gap-1">
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header (from first code) */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-bold text-xl text-indigo-600">ShopAI</span>
            <p className="text-xs text-gray-500">Good morning, Shubham 👋</p>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">🔍</button>
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center relative">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (from first code) */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'foryou', label: 'For You' },
            { id: 'deals', label: 'Deals' },
            { id: 'trending', label: 'Trending' },
            { id: 'creators', label: 'Creators' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-24">
        {/* Quick Categories (from first code) */}
        <div className="px-4 py-4 bg-white border-b border-gray-100">
          <QuickCategories />
        </div>

        {/* Samsung Flash Deal section (from first code, gradient from second code) */}
        <div className="px-4 py-4">
          <FlashDealHero deal={flashDeals[0]} />
        </div>

        {/* AFTER Samsung deal: follow second code from Price Drops onward */}
        <div className="px-4 pt-2 space-y-6">
          {/* Price Drops Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📉</span>
                <h2 className="font-bold text-gray-900">Price Drops</h2>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">LIVE</span>
              </div>
              <button className="text-indigo-600 text-sm font-medium">See all</button>
            </div>

            <div className="space-y-3">
              {priceDrops.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        {item.lowestEver && (
                          <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">
                            LOWEST EVER
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">{item.retailer}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">⏱ {item.timeLeft} left</span>
                        <span className="text-xs text-emerald-600 font-medium">-{item.dropPercent}%</span>
                      </div>
                    </div>
                    <PriceSparkline data={item.priceHistory} currentPrice={item.currentPrice} lowestPrice={item.wasPrice} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Buzzing Now Section */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <h2 className="font-bold text-gray-900">Buzzing Right Now</h2>
              </div>
              <button className="text-indigo-600 text-sm font-medium">See all</button>
            </div>

            <div className="overflow-x-auto -mx-4 px-4">
              <div className="flex gap-3" style={{ width: 'max-content' }}>
                {buzzingNow.map((item) => (
                  <div key={item.id} className="w-64 bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex-shrink-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.image}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                          <span className="text-indigo-600 font-bold text-sm">{item.price}</span>
                        </div>
                      </div>
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        {item.trending}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <PlatformBadge platform={item.platform} />
                      <span className="text-xs text-gray-500">{item.mentions} mentions</span>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-2 mb-2">
                      <p className="text-xs text-gray-600 italic line-clamp-2">{item.quote}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{item.author}</p>
                    </div>

                    <SentimentBadge sentiment={item.sentiment} score={item.sentimentScore} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Smart Collections */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🧠</span>
                <h2 className="font-bold text-gray-900">Smart Collections</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {smartCollections.map((collection) => (
                <button
                  key={collection.id}
                  className={`bg-gradient-to-br ${collection.gradient} rounded-xl p-4 text-white text-left hover:opacity-95 transition-opacity relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <span className="text-2xl mb-2 block">{collection.icon}</span>
                  <h3 className="font-bold text-sm leading-tight">{collection.title}</h3>
                  <p className="text-xs text-white/70 mt-1">{collection.count} products</p>
                </button>
              ))}
            </div>
          </section>

          {/* Hidden Gems */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💎</span>
                <h2 className="font-bold text-gray-900">Hidden Gems</h2>
              </div>
              <button className="text-indigo-600 text-sm font-medium">See all</button>
            </div>

            <div className="space-y-3">
              {hiddenGems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                          {item.tag}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-indigo-600 font-bold text-sm">{item.price}</span>
                        <span className="text-xs text-gray-400">{item.originalBrand}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{item.insight}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {item.score}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1">{item.reviews}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Community Debates */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">💬</span>
                <h2 className="font-bold text-gray-900">Community Debates</h2>
              </div>
              <button className="text-indigo-600 text-sm font-medium">See all</button>
            </div>

            <div className="space-y-3">
              {communityDebates.map((debate) => (
                <div key={debate.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{debate.image}</span>
                    <h3 className="font-semibold text-gray-900 text-sm flex-1">{debate.topic}</h3>
                    {debate.hot && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                        🔥 Hot
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-indigo-500 rounded-full flex items-center justify-end px-3"
                          style={{ width: `${debate.votes.option1 || debate.votes.yes}%` }}
                        >
                          <span className="text-white text-xs font-bold">
                            {debate.votes.option1 || debate.votes.yes}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{debate.options[0]}</span>
                      <span>{debate.options[1]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">💬 {debate.comments} comments</span>
                    <button className="text-xs text-indigo-600 font-medium">Join discussion →</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Price Prediction Card */}
          <section>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔮</span>
                <h2 className="font-bold">Price Predictions</h2>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Beta</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎮</span>
                    <div>
                      <h3 className="font-medium text-sm">PS5 Slim</h3>
                      <p className="text-xs text-white/60">Currently $449</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 text-xs font-bold bg-amber-400/20 px-2 py-1 rounded-full">
                      ⏳ WAIT
                    </span>
                    <p className="text-[10px] text-white/50 mt-1">-15% likely in 2 weeks</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💻</span>
                    <div>
                      <h3 className="font-medium text-sm">MacBook Air M3</h3>
                      <p className="text-xs text-white/60">Currently $1,049</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 text-xs font-bold bg-emerald-400/20 px-2 py-1 rounded-full">
                      ✓ BUY NOW
                    </span>
                    <p className="text-[10px] text-white/50 mt-1">Near historical low</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation (from second code) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around items-center max-w-md mx-auto">
        <button className="flex flex-col items-center gap-1 text-indigo-600">
          <span className="text-xl">🏠</span>
          <span className="text-xs font-medium">Discover</span>
        </button>
        <button
          onClick={() => onNavigate && onNavigate('search')}
          className="flex flex-col items-center gap-1 text-gray-400"
        >
          <span className="text-xl">🔍</span>
          <span className="text-xs">Search</span>
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
    </div>
  );
};

export default DiscoverPage;
