import { useCallback, useEffect, useState } from 'react';
import Home from './screens/Home.jsx';
import MapScreen from './screens/MapScreen.jsx';
import Forecast from './screens/Forecast.jsx';
import Alerts from './screens/Alerts.jsx';
import About from './screens/About.jsx';
import { LiveProvider } from './lib/live.jsx';
import BottomNav from './components/BottomNav.jsx';
import ChatWidget from './components/ChatWidget.jsx';

const SCREENS = { home: Home, map: MapScreen, forecast: Forecast, alerts: Alerts, about: About };

// Inline handlers carried over from the Stitch markup call through this helper.
window.__run = (el, code, event) => new Function('event', code).call(el, event);

const fromHash = () => {
  const key = window.location.hash.replace('#', '');
  return key in SCREENS ? key : 'home';
};

export default function App() {
  const [screen, setScreen] = useState(fromHash);

  const go = useCallback((key) => {
    window.location.hash = key;
    setScreen(key);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onHash = () => setScreen(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const Screen = SCREENS[screen];
  return (
    <LiveProvider>
      <Screen key={screen} go={go} />
      <BottomNav active={screen} go={go} />
      <ChatWidget />
    </LiveProvider>
  );
}
