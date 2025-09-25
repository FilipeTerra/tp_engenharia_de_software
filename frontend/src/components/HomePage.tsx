import React from 'react';
import Header from './Header';
import SearchBar from './SearchBar';
import RecentEvents from './RecentEvents';
import RecentArticles from './RecentArticles';

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <SearchBar />
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/2 px-4">
            <RecentEvents />
          </div>
          <div className="w-full md:w-1/2 px-4">
            <RecentArticles />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
