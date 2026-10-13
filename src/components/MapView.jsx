import { useState } from 'react';
import LiveMap from './LiveMap.jsx';
import GoogleLiveMap from './GoogleLiveMap.jsx';

const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Google Maps when a key is configured (and valid); OpenStreetMap/Leaflet otherwise.
export default function MapView(props) {
  const [googleFailed, setGoogleFailed] = useState(false);
  if (KEY && !googleFailed) {
    return <GoogleLiveMap apiKey={KEY} onFail={() => setGoogleFailed(true)} {...props} />;
  }
  return <LiveMap {...props} />;
}
