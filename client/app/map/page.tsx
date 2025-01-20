'use client';

import React, { useState } from 'react';
import MapComponent from '@/components/MapComponent';
import LocationManager from '@/components/LocationManager';

export default function MapPage() {
  const [locations, setLocations] = useState([]);

  return (
    <div className="flex h-screen">
      {/* Left: Location Management */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <LocationManager onLocationsChange={setLocations} />
      </div>

      <div className="w-[1px] bg-gray-300"></div>

      {/* Right: Map */}
      <div className="w-2/3">
        <MapComponent locations={locations} />
      </div>
    </div>
  );
}
