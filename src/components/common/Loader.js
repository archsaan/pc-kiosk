import React from 'react';

const Loader = ({ size = 10, color = '#e00000' }) => {
  const sizeClass = `w-${size} h-${size}`;

  return (
    <div className={`loader border-4 border-gray-300 border-t-[${color}] rounded-full ${sizeClass} animate-spin`}></div>
  );
};

export default Loader;
