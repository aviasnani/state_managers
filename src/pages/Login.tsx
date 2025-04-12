import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

const handleSubmit = () => {
  if (username === "aviasnani" && password === "helloWorld"){
    history.push('/home');

  }else{
    alert("Invalid credentials");
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
      <IonInput
        value={username}
        placeholder="Username"
        onIonChange={e => setUsername(e.detail.value!)}
      />
      <IonInput
        type="password"
        value={password}
        placeholder="Password"
        onIonChange={e => setPassword(e.detail.value!)}
      />
      <IonButton expand="full" onClick={handleSubmit}>
        Login
      </IonButton>
    </IonContent>
  </IonPage>
);
};

export default Login;
