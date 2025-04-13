import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonButtons, IonBackButton } from '@ionic/react';

const SignUp: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const history = useHistory();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const user = { name, email, username, password };
      localStorage.setItem('user', JSON.stringify(user));

      alert('User registered successfully!');
      window.location.href = '/login';
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
        <IonList>
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput type="text" 
            value={name} onIonChange={e => setName(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput type="email"
            value={email} onIonChange={e => setEmail(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput type="text"
              value={username} onIonChange={e => setUsername(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password"
              value={password} onIonChange={e => setPassword(e.detail.value!)} />
          </IonItem>
        </IonList>
        <div className="ion-padding">
          <IonButton expand="block" type="submit" onClick={handleSubmit}>
            Sign Up
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default SignUp;