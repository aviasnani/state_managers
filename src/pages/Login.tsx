import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

const handleSubmit = () => {
  if (username === "aviasnani" && password === "helloWorld"){
    history.push('/tabs/home');

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
      <IonList>
        <IonItem>
        <IonLabel position="floating">Username</IonLabel>
       <IonInput
        type = "text"
        value={username}
        onIonChange={e => setUsername(e.detail.value!)}
        clearInput
      />
      </IonItem>
      <IonItem>
      <IonLabel position="floating">Password</IonLabel>
      <IonInput
         type="password"
         value={password}
         onIonChange={e => setPassword(e.detail.value!)}
         clearInput
      />
      </IonItem>
      </IonList>

      <div className="ion-padding">
      <IonButton expand="full" onClick={handleSubmit}>
        Login
      </IonButton>
      </div>
    </IonContent>
  </IonPage>
);
};

export default Login;
