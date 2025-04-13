import React, { useState, useEffect } from 'react';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonLoading,
  IonAlert,
  IonItem,
  IonLabel,
  IonIcon,
} from '@ionic/react';
import { sunny, rainy, cloudy, snow, thunderstorm, water, thermometer, speedometer } from 'ionicons/icons';
import './Weather.css';

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      code: number;
    };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
    pressure_mb: number;
  };
}

const Weather: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);

    // Get saved API key for user
    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    if (userSettings[user.id]?.weatherApiKey) {
      setApiKey(userSettings[user.id].weatherApiKey);
    }
  }, []);

  const saveApiKey = (key: string) => {
    if (!currentUser) return;

    // Get all user settings
    const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    // Update settings for current user
    userSettings[currentUser.id] = {
      ...userSettings[currentUser.id],
      weatherApiKey: key
    };

    // Save back to localStorage
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  };

  const getWeatherIcon = (code: number) => {
    // WeatherAPI.com condition codes
    if (code === 1000) return sunny; // Clear
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195].includes(code)) return rainy; // Rain
    if ([1003, 1006, 1009].includes(code)) return cloudy; // Cloudy
    if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225].includes(code)) return snow; // Snow
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return thunderstorm; // Thunder
    return sunny; // Default
  };

  const fetchWeather = async () => {
    if (!location.trim() || !apiKey.trim()) {
      setError('Please enter both location and API key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeatherData(data);
      
      // Save API key if request was successful
      saveApiKey(apiKey);
    } catch (err) {
      setError('Failed to fetch weather data. Please check your location and API key.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Weather</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="weather-card">
          <IonCardHeader>
            <IonCardTitle>Weather Forecast</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">WeatherAPI.com API Key</IonLabel>
              <IonInput
                type="password"
                value={apiKey}
                onIonChange={(e) => setApiKey(e.detail.value!)}
                placeholder="Enter your API key"
                className="api-key-input"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Location</IonLabel>
              <IonInput
                value={location}
                onIonChange={(e) => setLocation(e.detail.value!)}
                placeholder="Enter location (e.g., Dublin, Ireland)"
                className="location-input"
              />
            </IonItem>
            <IonButton onClick={fetchWeather} expand="block" className="search-button">
              Get Weather
            </IonButton>

            {weatherData && (
              <div className="weather-info">
                <div className="weather-header">
                  <IonIcon
                    icon={getWeatherIcon(weatherData.current.condition.code)}
                    className="weather-icon"
                  />
                  <h2>{weatherData.location.name}</h2>
                  <p className="location-details">
                    {weatherData.location.region && `${weatherData.location.region}, `}
                    {weatherData.location.country}
                  </p>
                </div>
                <div className="weather-details">
                  <div className="temperature">
                    {Math.round(weatherData.current.temp_c)}°C
                  </div>
                  <div className="feels-like">
                    Feels like {Math.round(weatherData.current.feelslike_c)}°C
                  </div>
                  <div className="description">
                    {weatherData.current.condition.text}
                  </div>
                  <div className="additional-info">
                    <div className="info-item">
                      <IonIcon icon={water} />
                      <span>Humidity: {weatherData.current.humidity}%</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={speedometer} />
                      <span>Wind: {Math.round(weatherData.current.wind_kph)} km/h</span>
                    </div>
                    <div className="info-item">
                      <IonIcon icon={thermometer} />
                      <span>Pressure: {weatherData.current.pressure_mb} mb</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </IonCardContent>
        </IonCard>

        <IonLoading isOpen={loading} message="Fetching weather data..." />
        
        {error && (
          <IonAlert
            isOpen={!!error}
            onDidDismiss={() => setError(null)}
            header="Error"
            message={error}
            buttons={['OK']}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Weather; 
