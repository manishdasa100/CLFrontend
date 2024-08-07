// src/components/GridBackground.js
import React from 'react';

const GridBackground = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full grid grid-cols-12 grid-rows-12">
        {Array.from({ length: 144 }).map((_, index) => (
          <div
            key={index}
            className="border border-gray-800"
            style={{ width: '100%', height: '100%' }}
          ></div>
        ))}
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial"></div>
    </div>
  );
};

export default GridBackground;
