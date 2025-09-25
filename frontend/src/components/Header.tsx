import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Digital Library</h1>
      <button className="btn btn-primary">Login</button>
    </header>
  );
};

export default Header;
