import React, { useEffect, useState } from "react";
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
} from "@ionic/react";
import "./Map.css";

// Default coordinates (Dublin, Ireland)
const DEFAULT_COORDINATES = {
  lat: 53.3498,
  lng: -6.2603
};

const Map: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Function to load the Google Maps script dynamically
  const loadGoogleMapsScript = (key: string) => {
    setLoading(true);
    setError(null);
    
    // Remove any existing script
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log("Google Maps script loaded successfully");
      setMapLoaded(true);
      setLoading(false);
    };
    
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
      setError("Failed to load Google Maps. Please check your API key and internet connection.");
      setLoading(false);
    };
    
    document.body.appendChild(script);
  };

  const handleSubmit = () => {
    if (apiKey) {
      console.log("Submitting API key:", apiKey);
      loadGoogleMapsScript(apiKey);
    } else {
      setError("Please enter a valid API Key");
    }
  };

  // Initialize Google Maps when script is loaded
  useEffect(() => {
    if (mapLoaded && window.google && !map) {
      console.log("Initializing map with default coordinates");
      try {
        const mapElement = document.getElementById("map");
        if (!mapElement) {
          throw new Error("Map container not found");
        }

        const newMap = new window.google.maps.Map(mapElement, {
          center: DEFAULT_COORDINATES,
          zoom: 12,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        // Add a marker at the default location
        new window.google.maps.Marker({
          position: DEFAULT_COORDINATES,
          map: newMap,
          title: "Default Location",
        });

        setMap(newMap);
        console.log("Map initialized successfully");
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to initialize map. Please try again.");
      }
    }
  }, [mapLoaded, map]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Map</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Location Map</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput
              value={apiKey}
              onIonChange={(e) => setApiKey(e.detail.value!)}
              placeholder="Enter Google Maps API Key"
              className="api-key-input"
            />
            <IonButton onClick={handleSubmit} expand="block">
              Load Map
            </IonButton>

            <div id="map" className="map-container"></div>
          </IonCardContent>
        </IonCard>

        <IonLoading isOpen={loading} message="Loading map..." />
        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header="Error"
          message={error || ""}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Map;
