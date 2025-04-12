import React from 'react';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {useHistory} from 'react-router-dom';
import './Journal.css';
import { IonButton } from '@ionic/react';

const Journal: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Journal</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
      <IonCard>
          <IonCardHeader>
            <IonCardTitle>Your Journal Entries</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Your photo journal entries will appear here
          </IonCardContent>
        </IonCard>
       </IonContent>
    </IonPage>
  );
};

export default Journal;
