import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search for Events and Articles"
        className="input input-bordered w-full"
      />
    </div>
  );
};

export default SearchBar;
