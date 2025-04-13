import React, { useState, useEffect } from 'react';
import { 
  IonButtons, 
  IonContent, 
  IonHeader, 
  IonMenuButton, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const CameraPage: React.FC = () => {
  const [photo, setPhoto] = useState<string>('');

  useEffect(() => {
    // Load last photo from localStorage on component mount
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    if (photos.length > 0) {
      setPhoto(photos[photos.length - 1].dataUrl);
    }
  }, []);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      setPhoto(image.dataUrl || '');
      
      // Save to localStorage
      const photos = JSON.parse(localStorage.getItem('photos') || '[]');
      photos.push({
        id: Date.now(),
        dataUrl: image.dataUrl,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('photos', JSON.stringify(photos));
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Camera</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonButton expand="block" onClick={takePicture}>
                Take Photo
              </IonButton>
            </IonCol>
            <IonCol size="6">
              {photo && (
                <IonCard>
                  <IonCardContent>
                    <IonImg src={photo} alt="Captured photo" />
                  </IonCardContent>
                </IonCard>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CameraPage;