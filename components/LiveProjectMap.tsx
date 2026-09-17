'use client';

import React, { useEffect, useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAppStore } from '@/store/useAppStore';
import { MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

export default function LiveProjectMap() {
  const { projects } = useAppStore();
  const [viewState, setViewState] = useState({
    latitude: 9.0765, // Default to Abuja
    longitude: 7.3986,
    zoom: 5
  });
  
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setViewState({
            latitude,
            longitude,
            zoom: 10
          });
        },
        (error) => {
          // Desktop browsers often fail or timeout without GPS. 
          // Fallback to a free IP geolocation API.
          fetch('https://ipapi.co/json/')
            .then(res => res.json())
            .then(data => {
              if (data.latitude && data.longitude) {
                setUserLocation({ lat: data.latitude, lng: data.longitude });
                setViewState({ latitude: data.latitude, longitude: data.longitude, zoom: 10 });
                setLocationError(false);
              } else {
                setLocationError(true);
              }
            })
            .catch(() => {
              setLocationError(true);
            });
        },
        // Increased timeout to 15s because desktops take much longer to triangulate via WiFi/IP
        { enableHighAccuracy: true, maximumAge: 60000, timeout: 15000 }
      );
    } else {
      setLocationError(true);
    }
  }, []);

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const { resolvedTheme } = useTheme();

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === "YOUR_MAPBOX_TOKEN_HERE") {
    return (
      <div className="w-full h-48 md:h-80 bg-slate-50 dark:bg-[#121212] rounded-3xl flex flex-col items-center justify-center border border-slate-200 dark:border-zinc-800">
        <MapPin className="text-slate-400 dark:text-zinc-600 mb-2" size={32} />
        <p className="text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider text-sm">Mapbox Token Required</p>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-2 max-w-sm text-center">
          Please add a valid Mapbox access token to `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local` to view the interactive map.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 md:h-[400px] rounded-3xl overflow-hidden border border-slate-200 dark:border-[#282A2C] shadow-inner relative group">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={resolvedTheme === 'dark' ? "mapbox://styles/mapbox/dark-v11" : "mapbox://styles/mapbox/light-v11"}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="bottom-right" />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker latitude={userLocation.lat} longitude={userLocation.lng} anchor="center">
            <div className="relative flex h-5 w-5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/70 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border-2 border-white shadow-sm"></span>
            </div>
          </Marker>
        )}

        {/* Project Markers */}
        {projects.map(project => {
          const isVerified = project.status === 'expert_audited' || project.status === 'community_verified';
          return (
            <Marker 
              key={project.id} 
              latitude={project.location.lat} 
              longitude={project.location.lng} 
              anchor="bottom"
            >
              <Link href={`/project/${project.id}`} className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                <div className={`
                  px-2 py-1 rounded-md text-[10px] font-bold shadow-md mb-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full
                  ${isVerified ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'}
                `}>
                  {project.project_name}
                </div>
                <MapPin 
                  size={32} 
                  className={`drop-shadow-md ${isVerified ? 'text-green-600 fill-green-100' : 'text-yellow-500 fill-yellow-100'}`} 
                />
              </Link>
            </Marker>
          );
        })}
      </Map>

      {/* Geolocation Status Indicator */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#131314]/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200 dark:border-[#282A2C] flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-[#E3E3E3] pointer-events-none">
        {userLocation ? (
          <><Navigation size={14} className="text-primary" /> Location Active</>
        ) : locationError ? (
          <><Navigation size={14} className="text-red-500" /> Location Denied</>
        ) : (
          <><span className="w-2 h-2 rounded-full bg-primary animate-pulse block"></span> Locating...</>
        )}
      </div>
    </div>
  );
}
