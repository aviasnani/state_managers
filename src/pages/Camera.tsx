import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonCard,
  IonCardContent,
  IonFooter,
  IonToolbar,
  IonButton,
  IonIcon,
  IonHeader,
  IonTitle
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { camera } from 'ionicons/icons';

interface Photo {
  id: number;
  dataUrl: string;
  timestamp: string;
}

const CameraPage: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    // Load photos from localStorage on component mount
    const savedPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
    setPhotos(savedPhotos);
  }, []);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        const newPhoto = {
          id: Date.now(),
          dataUrl: image.dataUrl,
          timestamp: new Date().toISOString()
        };

        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);
        localStorage.setItem('photos', JSON.stringify(updatedPhotos));
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Photos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <IonRow>
            {photos.map((photo) => (
              <IonCol size="6" sizeMd="4" sizeLg="3" key={photo.id}>
                <IonCard>
                  <IonCardContent className="ion-no-padding">
                    <IonImg 
                      src={photo.dataUrl} 
                      alt={`Photo taken at ${new Date(photo.timestamp).toLocaleString()}`}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButton 
            expand="block" 
            onClick={takePicture}
            className="ion-margin"
            color="primary"
            size="large"
          >
            <IonIcon icon={camera} slot="start" />
            Take Photo
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default CameraPage;