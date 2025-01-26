'use client';
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { SafeUser } from "@/app/types";

interface MapComponentProps {
  currentUser: SafeUser | null; 
}

interface Location {
  id: string;
  name: string;
  description: string;
  ratings: any[];
  address?: string;
  coordinates: [number, number]; // Lat, Lng
}

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      // Initialize the Google Maps API Loader
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string, // Ensure this environment variable is set
        version: 'weekly',
      });

      try {
        const google = await loader.load();

        const mapOptions: google.maps.MapOptions = {
          center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
          zoom: 3,
        };

        const map = new google.maps.Map(mapRef.current, mapOptions);

        // Add markers for each location
        // locations.forEach((location) => {
        //   const marker = new google.maps.Marker({
        //     position: { lat: location.coordinates[0], lng: location.coordinates[1] },
        //     map,
        //     title: location.name,
        //   });

          // Info window for marker
        //   const infoWindow = new google.maps.InfoWindow({
        //     content: `
        //       <div>
        //         <h3>${location.name}</h3>
        //         <p>${location.description}</p>
        //       </div>
        //     `,
        //   });

        //   marker.addListener('click', () => {
        //     infoWindow.open(map, marker);
        //   });
        // });
      } catch (error) {
        console.error('Failed to load Google Maps:', error);
      }
    };

    initMap();
  }, []);

  return (
    <div ref={mapRef} className="w-full h-full">

    </div>
  );
}
