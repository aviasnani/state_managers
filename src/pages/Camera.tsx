import React from 'react';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {useHistory} from 'react-router-dom';
import './Camera.css';
import { IonButton } from '@ionic/react';

const Camera: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Take Photo</IonTitle>
        </IonToolbar>
      </IonHeader>


      <IonContent className="ion-padding">
         <IonCard>
          <IonCardHeader>
            <IonCardTitle>Camera</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block">
              Take Photo
            </IonButton>
          </IonCardContent>
        </IonCard>
       </IonContent>
    </IonPage>
  );
};

export default Camera;
