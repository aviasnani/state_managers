import React from 'react';
import { IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {useHistory} from 'react-router-dom';
import './Home.css';
import { IonButton } from '@ionic/react';

const Home: React.FC = () => {
  const history = useHistory();
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
      <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome to Photo Feed</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Your captured photos will appear here
          </IonCardContent>
        </IonCard>


       </IonContent>


    </IonPage>
  );
};

export default Home;
