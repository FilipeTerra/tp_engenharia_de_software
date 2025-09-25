import React from 'react';

const RecentArticles: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Articles</h2>
      <div className="space-y-4">
        {/* Placeholder for recent articles */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Article 1</h3>
            <p>Article description...</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Article 2</h3>
            <p>Article description...</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Article 3</h3>
            <p>Article description...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentArticles;
