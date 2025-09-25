import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-base-200 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        <Link to="/">Digital Library</Link>
      </h1>
      <nav className="flex items-center gap-4">
        <Link to="/gerenciar-eventos" className="btn btn-ghost">Gerenciar Eventos</Link>
        <button className="btn btn-primary">Login</button>
      </nav>
    </header>
  );
};

export default Header;
