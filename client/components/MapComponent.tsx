'use client';

import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { SafeUser } from '@/app/types';

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

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;
  
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
        version: 'weekly',
      });
  
      try {
        const google = await loader.load();
  
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

        // ✅ Check if locations exist before mapping
        if (Array.isArray(locations) && locations.length > 0) {
          locations.forEach((location) => {
            const marker = new google.maps.Marker({
              position: {
                lat: location.coordinates[0],
                lng: location.coordinates[1],
              },
              map,
              title: location.name,
            });
  
            const infoWindow = new google.maps.InfoWindow({
              content: `<div><h3>${location.name}</h3><p>${location.description}</p></div>`,
            });
  
            marker.addListener('click', () => {
              infoWindow.open(map, marker);
            });
          });
        }
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };
  
    initMap();
  }, [onMapClick, locations]); // ✅ Depend on `locations`

  return <div ref={mapRef} className="w-full h-full"></div>;
}
