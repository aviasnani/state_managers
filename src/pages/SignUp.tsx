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
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { personAddOutline, personCircleOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [presentToast] = useIonToast();
  const history = useHistory();

  const handleSignUp = async () => {
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
      presentToast({
        message: 'Please fill in all fields',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      return;
    }

    if (password !== confirmPassword) {
      presentToast({
        message: 'Passwords do not match',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      return;
    }

    // Get existing users or initialize empty array
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if email already exists
    if (users.some((user: any) => user.email === email)) {
      presentToast({
        message: 'Email already registered',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Set as logged in
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    await presentToast({
      message: 'Registration successful!',
      duration: 1000,
      color: 'success',
      position: 'bottom'
    });

    // Navigate and force reload
    history.push('/tabs/home');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Sign Up</IonTitle>
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
          <h2>Create Account</h2>
          <p>Please fill in the form to register</p>

          <div style={{ marginTop: '20px' }}>
            <IonItem>
              <IonLabel position="floating">Full Name</IonLabel>
              <IonInput
                type="text"
                value={name}
                onIonChange={e => setName(e.detail.value!)}
                required
              />
            </IonItem>

            <IonItem style={{ marginTop: '10px' }}>
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

            <IonItem style={{ marginTop: '10px' }}>
              <IonLabel position="floating">Confirm Password</IonLabel>
              <IonInput
                type="password"
                value={confirmPassword}
                onIonChange={e => setConfirmPassword(e.detail.value!)}
                required
              />
            </IonItem>

            <IonButton
              expand="block"
              style={{ marginTop: '30px' }}
              onClick={handleSignUp}
            >
              <IonIcon icon={personAddOutline} slot="start" />
              Sign Up
            </IonButton>

            <div style={{ marginTop: '20px' }}>
              <IonText color="medium">
                Already have an account?{' '}
                <IonText 
                  color="primary" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => history.push('/login')}
                >
                  Login
                </IonText>
              </IonText>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default SignUp;
