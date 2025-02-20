'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { SafeUser } from '@/app/types';
import { addMarkersToMap } from '@/services/markerUtils';

interface Location {
  id: string;
  name: string;
  description: string;
  ratings?: any[];
  address?: string;
  coordinates: [number, number]; // Lat, Lng
}

interface MapComponentProps {
  currentUser: SafeUser | null;
  onMapClick: (coordinates: [number, number]) => void;
  locations: Location[];
}

export default function MapComponent({ currentUser, onMapClick, locations }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [googleApi, setGoogleApi] = useState<typeof google | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;
  
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: 'weekly',
      });
  
      try {
        await loader.load();
        const google = window.google;
        setGoogleApi(google);
  
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 43.7, lng: -79.4 },
          zoom: 3,
        });
  
        map.addListener('click', (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            onMapClick([lat, lng]);
          }
        });
        setMap(map);
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };
  
    initMap();
  }, [onMapClick]); 
  useEffect(() => {
    if (map && googleApi) {
      const newMarkers = addMarkersToMap(map, locations, googleApi);
      setMarkers(newMarkers);
    }
  }, [map, locations]);

  return <div ref={mapRef} className="w-full h-full"></div>;
}
