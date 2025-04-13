import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.username === username && user.password === password) {
        alert('Login successful!');
        window.location.href = '/tabs/home';
      } else {
        alert('Invalid username or password');
      }
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow className="ion-justify-content-center ion-align-items-center" style={{ height: '100vh' }}>
            <IonCol size="12" sizeMd="8" sizeLg="6" sizeXl="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle className="ion-text-center">SpotImage Login</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={handleSubmit}>
                    <IonItem>
                      <IonLabel position="floating">Username</IonLabel>
                      <IonInput
                        type="text"
                        value={username}
                        onIonChange={e => setUsername(e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonItem className="ion-margin-bottom">
                      <IonLabel position="floating">Password</IonLabel>
                      <IonInput
                        type="password"
                        value={password}
                        onIonChange={e => setPassword(e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonButton expand="block" type="submit" className="ion-margin-top">
                      Login
                    </IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;