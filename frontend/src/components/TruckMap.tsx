import React from 'react';

const TruckMap = () => {
  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg relative">
      <a href="https://www.google.com/maps/place/KIIT+Campus/@20.3538431,85.8169059,17z/">
        <img src="map.jpg" alt="" />
      </a>
      <p className='flex justify-center mt-8'>Click on Image to see the map</p>
    </div>
  );
};

export default TruckMap;
