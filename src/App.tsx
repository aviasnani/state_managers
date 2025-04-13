import { Redirect, Route } from 'react-router-dom';
import { 
  IonApp, 
  IonIcon, 
  IonLabel, 
  IonRouterOutlet, 
  IonSplitPane, 
  IonTabBar, 
  IonTabButton, 
  IonTabs, 
  setupIonicReact,
  useIonToast,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Camera from './pages/Camera';
import Journal from './pages/Journal';
import Map from './pages/Map';
import Weather from './pages/Weather';
import Menu from './pages/Menu';
import SignUp from './pages/SignUp';

import { 
  camera,          
  images,          
  journal,         
  map,
  cloudy,   
} from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
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

/* Core CSS required for Ionic components to work properly */
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

/* Theme variables */
import './theme/variables.css';

setupIonicReact({
  mode: 'ios',
  swipeBackEnabled: true,
});

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [presentToast] = useIonToast();

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const showAuthAlert = (type: 'login' | 'signup') => {
    presentToast({
      message: type === 'login' 
        ? 'You are already logged in. Please logout first to access the login page.'
        : 'You are already registered and logged in. Please logout first to create a new account.',
      duration: 1000,
      position: 'bottom',
      color: 'warning'
    });
    return <Redirect to="/tabs/home" />;
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main" when="md">
          {isAuthenticated && <Menu />}
          <IonRouterOutlet id="main">
            {/* Auth Routes */}
            <Route exact path="/login">
              {isAuthenticated ? showAuthAlert('login') : <Login />}
            </Route>
            <Route exact path="/signup">
              {isAuthenticated ? showAuthAlert('signup') : <SignUp />}
            </Route>

            {/* Protected Routes */}
            <Route path="/tabs" render={() => {
              if (!isAuthenticated) {
                return <Redirect to="/login" />;
              }

              return (
                <IonTabs>
                  <IonRouterOutlet>
                    <Route exact path="/tabs/home">
                      <Home />
                    </Route>
                    <Route exact path="/tabs/camera">
                      <Camera />
                    </Route>
                    <Route exact path="/tabs/journal">
                      <Journal />
                    </Route>
                    <Route exact path="/tabs/map">
                      <Map />
                    </Route>
                    <Route exact path="/tabs/weather">
                      <Weather />
                    </Route>
                    <Route exact path="/tabs">
                      <Redirect to="/tabs/home" />
                    </Route>
                  </IonRouterOutlet>

                  <IonTabBar slot="bottom">
                    <IonTabButton tab="home" href="/tabs/home">
                      <IonIcon icon={images} />
                      <IonLabel>Feed</IonLabel>
                    </IonTabButton>
                    
                    <IonTabButton tab="camera" href="/tabs/camera">
                      <IonIcon icon={camera} />
                      <IonLabel>Camera</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="journal" href="/tabs/journal">
                      <IonIcon icon={journal} />
                      <IonLabel>Journal</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="map" href="/tabs/map">
                      <IonIcon icon={map} />
                      <IonLabel>Map</IonLabel>
                    </IonTabButton>

                    <IonTabButton tab="weather" href="/tabs/weather">
                      <IonIcon icon={cloudy} />
                      <IonLabel>Weather</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              );
            }} />

            {/* Default Route */}
            <Route exact path="/">
              <Redirect to={isAuthenticated ? "/tabs/home" : "/login"} />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;