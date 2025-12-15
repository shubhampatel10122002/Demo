'use client';

import { useState } from 'react';
import DiscoverPage from './components/DiscoverPage';
import SearchResultsPage from './components/SearchResultsPage';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <>
      {currentPage === 'home' ? (
        <DiscoverPage onNavigate={setCurrentPage} />
      ) : (
        <SearchResultsPage onNavigate={setCurrentPage} />
      )}
    </>
  );
}
