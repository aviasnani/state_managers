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
  IonItem,
  IonLabel,
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
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

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

        // Initialize marker
        const newMarker = new window.google.maps.Marker({
          position: DEFAULT_COORDINATES,
          map: newMap,
          title: "Selected Location",
          animation: google.maps.Animation.DROP,
        });

        // Initialize geocoder
        const newGeocoder = new window.google.maps.Geocoder();

        setMap(newMap);
        setMarker(newMarker);
        setGeocoder(newGeocoder);
        console.log("Map initialized successfully");
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to initialize map. Please try again.");
      }
    }
  }, [mapLoaded, map]);

  // Function to handle location search
  const handleLocationSearch = () => {
    if (!geocoder || !map || !marker) {
      setError("Map not initialized. Please load the map first.");
      return;
    }

    if (!searchLocation.trim()) {
      setError("Please enter a location to search");
      return;
    }

    setLoading(true);
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        
        // Update map center
        map.setCenter(location);
        map.setZoom(15);

        // Update marker position
        marker.setPosition(location);
        marker.setTitle(results[0].formatted_address);

        // Optional: Show an InfoWindow with the address
        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${results[0].formatted_address}</strong></div>`
        });
        
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Trigger the click event to show the InfoWindow immediately
        google.maps.event.trigger(marker, 'click');

      } else {
        setError("Location not found. Please try a different search term.");
      }
      setLoading(false);
    });
  };

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
            <IonItem className="ion-margin-bottom">
              <IonLabel position="stacked">Google Maps API Key</IonLabel>
              <IonInput
                value={apiKey}
                onIonChange={(e) => setApiKey(e.detail.value!)}
                placeholder="Enter Google Maps API Key"
                className="api-key-input"
              />
            </IonItem>
            <IonButton 
              onClick={handleSubmit} 
              expand="block"
              className="ion-margin-bottom"
            >
              Load Map
            </IonButton>

            {mapLoaded && (
              <div className="search-container ion-margin-bottom">
                <IonItem>
                  <IonLabel position="stacked">Search Location</IonLabel>
                  <IonInput
                    value={searchLocation}
                    onIonChange={(e) => setSearchLocation(e.detail.value!)}
                    placeholder="Enter location to search"
                  />
                </IonItem>
                <IonButton 
                  expand="block"
                  onClick={handleLocationSearch}
                  className="ion-margin-top"
                >
                  Search Location
                </IonButton>
              </div>
            )}

            <div id="map" className="map-container"></div>
          </IonCardContent>
        </IonCard>

        <IonLoading isOpen={loading} message="Loading..." />
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
