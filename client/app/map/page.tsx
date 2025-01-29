'use client';

import React, { useEffect, useState } from 'react';
import MapComponent from '@/components/MapComponent';
import LocationManager from '@/components/LocationManager';
import { SafeUser } from '../types';

export default function MapPage() {
  // const [locations, setLocations] = useState([]);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [newLocationCoords, setNewLocationCoords] = useState<[number, number] | null>(null);

  // uses currentUser api to retrieve the current user and pass it to the children components
  useEffect(() => {
    const fetchCurrentUser = async() => {
      try { 
        const response = await fetch('/api/currentUser');
        const data: SafeUser | null = await response.json();
        setCurrentUser(data);
      } catch(error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleMapClick = (coordinates: [number, number]) => {
    console.log(coordinates); 
    setNewLocationCoords(coordinates);
  };

  return (
    <div className="flex h-screen">
      {/* Left: Location Management */}
      <div className="w-1/3 bg-gray-100 p-4 overflow-y-auto">
        <LocationManager 
        currentUser={currentUser}
        newLocationCoords={newLocationCoords}  />
      </div>

      <div className="w-[1px] bg-gray-300"></div>

      {/* Right: Map */}
      <div className="w-2/3">
        <MapComponent currentUser={currentUser} onMapClick={handleMapClick} />
      </div>
    </div>
  );
}
