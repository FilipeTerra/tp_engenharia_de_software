import React from 'react';

const RecentEvents: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Recent Events</h2>
      <div className="space-y-4">
        {/* Placeholder for recent events */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Event 1</h3>
            <p>Event description...</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Event 2</h3>
            <p>Event description...</p>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Event 3</h3>
            <p>Event description...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentEvents;
