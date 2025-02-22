import { Loader } from '@googlemaps/js-api-loader';
import google from 'next-auth/providers/google';

interface Location {
    id: string;
    name: string; 
    description: string;
    coordinates: [number, number];
}

export const addMarkersToMap = (
    map: google.maps.Map,
    locations: Location[],
    google: typeof window.google
): google.maps.Marker[] => {
    const markers: google.maps.Marker[] = [];
    const image = {
      url: "./pin.png",
      scaledSize: new google.maps.Size(30, 30)
    }

    locations.forEach((location) => {
        const marker = new google.maps.Marker({
            position: {
                lat: location.coordinates[0],
                lng: location.coordinates[1],
            },
            map,
            title: location.name,
            animation: google.maps.Animation.DROP,
            icon: image,
        });
        const infoWindow = new google.maps.InfoWindow({
            content: `<div><h3>${location.name}</h3><p>${location.description}</p></div>`,
        });
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
        markers.push(marker);
    })
    return markers; 
}