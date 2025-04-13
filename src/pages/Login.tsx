import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonToast,
  IonText,
} from '@ionic/react';
import { logInOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [presentToast] = useIonToast();
  const history = useHistory();

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      presentToast({
        message: 'Please fill in all fields',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      return;
    }

    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // Set authentication state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));

      await presentToast({
        message: 'Login successful!',
        duration: 1000,
        color: 'success',
        position: 'bottom'
      });

      // Navigate and force reload
      history.push('/tabs/home');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      presentToast({
        message: 'Invalid email or password',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div style={{ 
          maxWidth: '400px', 
          margin: '0 auto', 
          padding: '20px',
          textAlign: 'center' 
        }}>
          <IonIcon
            icon={personCircleOutline}
            style={{
              fontSize: '70px',
              color: 'var(--ion-color-primary)'
            }}
          />
          <h2>Welcome Back!</h2>
          <p>Please sign in to continue</p>

          <div style={{ marginTop: '20px' }}>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem style={{ marginTop: '10px' }}>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                required
              />
            </IonItem>

            <IonButton
              expand="block"
              style={{ marginTop: '30px' }}
              onClick={handleLogin}
            >
              <IonIcon icon={logInOutline} slot="start" />
              Login
            </IonButton>

            <div style={{ marginTop: '20px' }}>
              <IonText color="medium">
                Don't have an account?{' '}
                <IonText 
                  color="primary" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push('/signup')}
                >
                  Sign Up
                </IonText>
              </IonText>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
