import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import {useHistory} from 'react-router-dom';
import './Home.css';
import { IonButton } from '@ionic/react';

const Home: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Welcome to the home page</h2>
        <IonButton expand="full" onClick={() => history.push('/login')}> Logout </IonButton>
       </IonContent>
    </IonPage>
  );
};

export default Home;
