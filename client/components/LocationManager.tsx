'use client';

import React, { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { SafeUser } from "@/app/types";
import { Tab } from "@headlessui/react";
import Select from 'react-select';
import dayjs from "dayjs";
import axios from 'axios';
import CountrySelect, { CountrySelectValue } from './inputs/CountrySelect';

interface Location {
  id: string;
  name: string;
  country: CountrySelectValue;
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
    country: '',
    description: '',
    cityDetails: '',
    visitedOn: '',
    coordinates: [0, 0],
    photos: [],
  });
  const [selectedTab, setSelectedTab] = useState(0);
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

  const setCustomValue = (key: string, value: any) => {
    setNewLocation((prev) => ({
      ...prev,
      [key]: value, 
    }));
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
        //e.preventDefault(); 
        const response = await fetch('/api/addLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newLocation.name,
                country: newLocation.country?.label,
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
      
      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-2 border-b-2">
          <Tab className={({ selected }) =>
            selected ? "px-4 py-2 text-white bg-blue-600 rounded-t-md" : "px-4 py-2 text-gray-600 bg-gray-200 rounded-t-md"
          }>
            Add Location
          </Tab>
          <Tab className={({ selected }) =>
            selected ? "px-4 py-2 text-white bg-blue-600 rounded-t-md" : "px-4 py-2 text-gray-600 bg-gray-200 rounded-t-md"
          }>
            Your Locations
          </Tab>
          <Tab className={({ selected }) =>
            selected ? "px-4 py-2 text-white bg-blue-600 rounded-t-md" : "px-4 py-2 text-gray-600 bg-gray-200 rounded-t-md"
          }>
            Your Stats
          </Tab>
        </Tab.List>
          {/* add location */}
          <Tab.Panel>
            <h3 className="mt-4 text-lg font-bold">Add New Location</h3>
            <form onSubmit={handleAddLocation} className="flex flex-col space-y-2">
              <input type="text" placeholder="Name" value={newLocation.name} onChange={(e) => setNewLocation((prev) => ({ ...prev, name: e.target.value }))} className="border rounded px-2 py-1" />
              <div className="z-15">
                <CountrySelect 
                  value={newLocation.country} 
                  onChange={(value) => setCustomValue('country', value)}
                />
              </div>
              <input type="text" placeholder="Short description" value={newLocation.description} onChange={(e) => setNewLocation((prev) => ({ ...prev, description: e.target.value }))} className="border rounded px-2 py-1" />
              <textarea rows={5} placeholder="Tell us what you did here!" value={newLocation.cityDetails} onChange={(e) => setNewLocation((prev) => ({ ...prev, cityDetails: e.target.value }))} className="border rounded px-2 py-1 w-full"></textarea>

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
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md">Add Location</button>
            </form>
          </Tab.Panel>

          <Tab.Panels className="mt-4">
          {/* existing location */}
          <Tab.Panel>
            <h2 className="text-xl font-bold mb-4">Manage Locations</h2>
            <div className="space-y-2">
              {locations.map((location) => (
                <div key={location.id} className="flex justify-between items-center border p-2 rounded">
                  <div>
                    <h3 className="font-bold">{location.name}</h3>
                    <p>{location.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDeleteLocation(location.id)} className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Tab.Panel>

          {/* stats panel */}
          <Tab.Panel>
              <h1>Number of places:</h1>
              <h1>Number of countries: </h1>
              <h1>Country you've been to the most:</h1>
              <h1>Year with the Most Travel</h1>
              <h1>The last time you've been on a trip</h1>
              <h1>Furthest Location from Home</h1>
              <h1>First Trip Ever Logged:</h1>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default LocationManager;

