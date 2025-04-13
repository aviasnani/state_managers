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
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonCardHeader,
  IonCardSubtitle,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';
import './Home.css';

interface Photo {
  id: number;
  dataUrl: string;
  timestamp: string;
  userId: string;
}

const Home: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const loadPhotos = () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    
    const allPhotos = JSON.parse(localStorage.getItem('photos') || '[]');
    // Filter photos for current user
    const userPhotos = allPhotos.filter((photo: Photo) => photo.userId === user.id);
    setPhotos(userPhotos);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadPhotos();
    event.detail.complete();
  };

  return (
    
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Photo Feed</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {photos.length === 0 ? (
          <div className="no-photos">
            <p>No photos yet. Take some photos to see them here!</p>
          </div>
        ) : (
          <IonGrid>
            <IonRow>
              {photos.map((photo) => (
                <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={photo.id}>
                  <IonCard className="photo-card">
                    <IonImg 
                      src={photo.dataUrl} 
                      alt={`Photo taken at ${new Date(photo.timestamp).toLocaleString()}`}
                      className="photo-image"
                    />
                    <IonCardHeader>
                      <IonCardSubtitle>
                        {new Date(photo.timestamp).toLocaleString()}
                      </IonCardSubtitle>
                    </IonCardHeader>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
