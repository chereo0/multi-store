import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ className = "w-12 h-12" }) => {
  return (
    <Link to="/home" className="flex items-center space-x-3">
      <div className={`${className} bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300`}>
        <span className="text-white font-bold text-xl">M</span>
      </div>
      <span className="text-white font-bold text-xl">Multistore</span>
    </Link>
  );
};

export default Logo;

