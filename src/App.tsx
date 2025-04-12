import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Home from './pages/Home';

setupIonicReact();

const App: React.FC = () => {

  return (<IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route  path="/login" component={Login} exact />
        <Route path="/home" component={Home} exact />
        <Redirect exact from ="/" to ="/login" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>

)
};
export default App;
