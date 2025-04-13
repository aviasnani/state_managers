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
} from "@ionic/react";
import "./Map.css";

const Map: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Function to load the Google Maps script dynamically
  const loadGoogleMapsScript = (key: string) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);
  };

  const handleSubmit = () => {
    if (apiKey) {
      loadGoogleMapsScript(apiKey);
    } else {
      alert("Please enter a valid API Key");
    }
  };

  // Get the current location once the map is loaded
  useEffect(() => {
    if (mapLoaded && coordinates === null && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    }
  }, [mapLoaded, coordinates]);

  // Initialize Google Maps when coordinates are available
  useEffect(() => {
    if (coordinates && window.google) {
      const mapElement = document.getElementById("map")!;
      new window.google.maps.Map(mapElement, {
        center: { lat: coordinates.lat, lng: coordinates.lng },
        zoom: 12,
      });
    }
  }, [coordinates, mapLoaded]);

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
            {/* Input to allow the user to enter their API Key */}
            <IonInput
              value={apiKey}
              onIonChange={(e) => setApiKey(e.detail.value!)}
              placeholder="Enter Google Maps API Key"
            />
            <IonButton onClick={handleSubmit}>Load Map</IonButton>

            {/* Add a div element to hold the map */}
            <div id="map" style={{ height: "100%", width: "100%" }}></div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Map;
