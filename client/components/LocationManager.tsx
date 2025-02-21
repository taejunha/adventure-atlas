'use client';

import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import { SafeUser } from "@/app/types";
import axios from 'axios';
import { create } from 'domain';

interface Location {
  id: string;
  name: string;
  description: string;
  cityDetails: string;
  visitedOn: string;
  coordinates: [number, number];
  photos: string[];
}

interface LocationManagerProps {
  currentUser: SafeUser | null;
  // onLocationsChange: (locations: Location[]) => void;
  newLocationCoords: [number, number] | null;
  locations: Location[];
}

const LocationManager: React.FC<LocationManagerProps> = ({ locations, currentUser, newLocationCoords }) => {
  // console.log(currentUser); // for testing purposes
  const [newLocation, setNewLocation] = useState<Location>({
    id: '',
    name: '',
    description: '',
    cityDetails: '',
    visitedOn: '',
    coordinates: [0, 0],
    photos: [],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (newLocationCoords) {
      setNewLocation((prev) => ({
        ...prev,
        coordinates: newLocationCoords,
      }));
    }
  }, [newLocationCoords]);

  // handles adding locations to the database
  const handleAddLocation = async (e: React.FormEvent) => {
    try {
        // e.preventDefault(); 
        const response = await fetch('/api/addLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newLocation.name,
                description: newLocation.description,
                cityDetails: newLocation.cityDetails,
                visitedOn: newLocation.visitedOn,
                coordinates: newLocation.coordinates,
                userId: currentUser?.id,
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            throw new Error(errorData.error); 
        }

        // preparing the FormData for photo upload
        const addedLocation = await response.json();
        const locationId = addedLocation.id; 

        const data = new FormData();
        selectedFiles.forEach((file) => data.append('files', file));
        for (const [key, value] of data.entries()) {
          console.log(key, value);
        }

        // upload photos to AWS
        const uploadResponse = await axios.post(`/api/uploadPhoto?locationId=${locationId}&userId=${currentUser?.id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });

        console.log(uploadResponse);

        const photoUrls = uploadResponse.data.photos.map((photo: any) => photo.url);

        // setLocations((prevLocations) => [...prevLocations, addedLocation]);
    } catch (error) {
        console.error("Error adding location", error)
    }
  };

  // delete location
  const handleDeleteLocation = async (locationId: string) => {
    try {
      const response = await fetch(`/api/deleteLocation?locationId=${locationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error("Failed to delete");

      window.location.reload(); 
    } catch (error) {
      console.error(error); 
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl">Welcome <span className="font-bold">{currentUser?.name}</span>!</h1>
      
      <br></br>
      <h2 className="text-xl font-bold mb-4">Manage Locations</h2>
      <div className="space-y-2">
        {locations.map((location) => (
          <div key={location.id} className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{location.name}</h3>
              <p>{location.description}</p>
            </div>
            <div className="flex gap-2">
                <button className="bg-willow-brook-700 hover:bg-yellow-600 text-white px-2 py-1 rounded">
                    Edit
                </button>
                <button
                onClick={() => handleDeleteLocation(location.id)}
                className="bg-willow-brook-800 hover:bg-red-500 text-white px-2 py-1 rounded"
                >
                Delete
                </button>
          </div>
          </div>
        ))}
      </div>

      <h3 className="mt-4 text-lg font-bold">Add New Location</h3>
      <form onSubmit={handleAddLocation} className="flex flex-col space-y-2">
        <input
          type="text"
          placeholder="Name"
          value={newLocation.name}
          onChange={(e) =>
            setNewLocation((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border rounded px-2 py-1"
        />

        <input
          type="text"
          placeholder="Short description of the place"
          value={newLocation.description}
          onChange={(e) =>
            setNewLocation((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="border rounded px-2 py-1"
        />

        <textarea
          rows={5}
          placeholder="Tell us what you did here!"
          value={newLocation.cityDetails}
          onChange={(e) =>
            setNewLocation((prev) => ({
              ...prev,
             cityDetails: e.target.value,
            }))
          }
          className="border rounded px-2 py-1 w-full overflow-y-scroll">
        </textarea>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker 
              label="When did you visit?" 
              views={['year', 'month', 'day']}
              value={newLocation.visitedOn ? dayjs(newLocation.visitedOn) : null}
              onChange={(date) => 
                setNewLocation((prev) => ({
                  ...prev,
                  visitedOn: date ? date.toISOString() : "",
                }))
               }
              />
          </DemoContainer>
        </LocalizationProvider>

        <input
          type="number"
          placeholder="Latitude"
          value={newLocation.coordinates[0]}
          onChange={(e) =>
            setNewLocation((prev) => ({
              ...prev,
              coordinates: [parseFloat(e.target.value), prev.coordinates[1]],
            }))
          }
          className="border rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={newLocation.coordinates[1]}
          onChange={(e) =>
            setNewLocation((prev) => ({
              ...prev,
              coordinates: [prev.coordinates[0], parseFloat(e.target.value)],
            }))
          }
          className="border rounded px-2 py-1"
        />
        
        {/* Upload Photos */}
       <p className="font-bold text-xl">Upload Photos</p>
       <div>
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Choose Photos</label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            />
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Selected Photos ({selectedFiles.length})</h3>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Location
        </button>
      </form>
    </div>
  );
};

export default LocationManager;

